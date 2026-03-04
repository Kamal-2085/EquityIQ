import { WebSocketServer } from "ws";
import YahooFinance from "yahoo-finance2";
import { getChartData } from "../services/yahoo.services.js";
import { createYahooStreamer } from "../services/yahooStreamer.js";

const OPEN_STATE = 1;
const TICK_INTERVAL_MS = 1000;
const CHART_INTERVAL_MS = 5000;
const LIVE_INTERVALS = new Set(["1m", "5m"]);

const intervalToSeconds = (interval) => {
  if (interval === "1m") return 60;
  if (interval === "5m") return 300;
  return null;
};

const isLiveChart = (range, interval) =>
  range === "1d" && LIVE_INTERVALS.has(interval);

const toUnixSeconds = (timeValue) => {
  if (typeof timeValue !== "number" || Number.isNaN(timeValue)) {
    return Math.floor(Date.now() / 1000);
  }
  return timeValue > 1e12
    ? Math.floor(timeValue / 1000)
    : Math.floor(timeValue);
};

const resolveTickPrice = (tick) =>
  tick?.price ??
  tick?.regularMarketPrice ??
  tick?.marketPrice ??
  tick?.lastPrice ??
  null;

const normalizeSymbol = (symbol) =>
  String(symbol || "")
    .trim()
    .replace(/^\^/, "")
    .toUpperCase();

const toDateKey = (unixSeconds) => {
  const date = new Date(unixSeconds * 1000);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

const createClientState = () => ({
  indices: false,
  symbols: new Set(),
  charts: new Map(),
});

const sanitizeSymbols = (symbols) =>
  [...new Set(symbols.map((symbol) => String(symbol || "").trim()))].filter(
    Boolean,
  );

export const startMarketSocket = (server) => {
  const wss = new WebSocketServer({ server, path: "/ws/market" });
  const clients = new Map();
  const streamer = createYahooStreamer();
  const liveCandleState = new Map();
  const liveSeriesStore = new Map();
  let liveSymbols = new Set();
  let intervalId = null;
  let chartIntervalId = null;
  let isTicking = false;
  let isChartTicking = false;

  const hasAnySubscriptions = () => {
    for (const state of clients.values()) {
      if (state.indices || state.symbols.size > 0) return true;
    }
    return false;
  };

  const hasAnyChartSubscriptions = () => {
    for (const state of clients.values()) {
      if (state.charts.size > 0) return true;
    }
    return false;
  };

  const hasAnyNonLiveChartSubscriptions = () => {
    for (const state of clients.values()) {
      if (state.charts.size === 0) continue;
      for (const chart of state.charts.values()) {
        if (!isLiveChart(chart.range, chart.interval)) return true;
      }
    }
    return false;
  };

  const rebuildStreamerSubscriptions = () => {
    const symbols = new Set();
    clients.forEach((state) => {
      state.charts.forEach((chart) => {
        if (isLiveChart(chart.range, chart.interval)) {
          symbols.add(chart.symbol);
        }
      });
    });
    liveSymbols = new Set([...symbols].map(normalizeSymbol));
    streamer.setSymbols([...symbols]);
  };

  const symbolsMatch = (chartSymbol, incomingSymbol) =>
    normalizeSymbol(chartSymbol) === normalizeSymbol(incomingSymbol);

  const emitLiveChartUpdate = (symbol, interval, point) => {
    const entries = [...clients.entries()];
    entries.forEach(([ws, state]) => {
      if (ws.readyState !== OPEN_STATE) return;
      state.charts.forEach((chart) => {
        if (
          symbolsMatch(chart.symbol, symbol) &&
          chart.interval === interval &&
          isLiveChart(chart.range, chart.interval)
        ) {
          ws.send(
            JSON.stringify({
              type: "chart_update",
              key: chart.key,
              symbol: chart.symbol,
              range: chart.range,
              interval: chart.interval,
              data: [point],
              meta: {
                mode: "update",
                source: "yahoo_streamer",
              },
            }),
          );
        }
      });
    });
  };

  const getMarketOpenSeconds = (unixSeconds) => {
    const date = new Date(unixSeconds * 1000);
    const open = new Date(date);
    open.setHours(9, 15, 0, 0);
    return Math.floor(open.getTime() / 1000);
  };

  const updateLiveSeriesStore = (symbol, interval, point) => {
    const normalized = normalizeSymbol(symbol);
    const key = `${normalized}|${interval}`;
    const next = liveSeriesStore.get(key) || [];
    const last = next[next.length - 1];
    if (last && toDateKey(last.time) !== toDateKey(point.time)) {
      liveSeriesStore.set(key, [point]);
      return;
    }
    if (last && last.time === point.time) {
      next[next.length - 1] = point;
      liveSeriesStore.set(key, next);
      return;
    }
    next.push(point);
    if (next.length > 2000) {
      liveSeriesStore.set(key, next.slice(-2000));
      return;
    }
    liveSeriesStore.set(key, next);
  };

  const buildLiveSnapshot = (symbol, interval) => {
    const normalized = normalizeSymbol(symbol);
    const key = `${normalized}|${interval}`;
    const series = liveSeriesStore.get(key) || [];
    if (series.length === 0) return [];
    const nowSeconds = Math.floor(Date.now() / 1000);
    const openSeconds = getMarketOpenSeconds(nowSeconds);
    const filtered = series.filter(
      (point) =>
        point.time >= openSeconds &&
        point.time <= nowSeconds &&
        toDateKey(point.time) === toDateKey(nowSeconds),
    );
    if (filtered.length === 0) return [];
    const first = filtered[0];
    const snapshot = [
      ...(first.time > openSeconds
        ? [{ time: openSeconds, value: first.value }]
        : []),
      ...filtered,
    ];
    return snapshot;
  };

  streamer.onTick((tick) => {
    const symbol = String(tick?.id || "").trim();
    if (!symbol) return;
    const price = resolveTickPrice(tick);
    if (price === null || price === undefined || Number.isNaN(price)) return;
    const timeSeconds = toUnixSeconds(
      tick?.time ?? tick?.regularMarketTime ?? Date.now(),
    );
    const normalized = normalizeSymbol(symbol);
    if (liveSymbols.size > 0 && !liveSymbols.has(normalized)) return;

    LIVE_INTERVALS.forEach((interval) => {
      const intervalSeconds = intervalToSeconds(interval);
      if (!intervalSeconds) return;
      const bucketTime =
        Math.floor(timeSeconds / intervalSeconds) * intervalSeconds;
      const key = `${normalized}|${interval}`;
      const last = liveCandleState.get(key);
      if (last && last.time === bucketTime && last.value === price) return;
      const point = { time: bucketTime, value: price };
      liveCandleState.set(key, point);
      updateLiveSeriesStore(symbol, interval, point);
      emitLiveChartUpdate(symbol, interval, point);
    });
  });

  const updateLiveCandle = (symbol, price, timeValue) => {
    const normalized = normalizeSymbol(symbol);
    if (liveSymbols.size > 0 && !liveSymbols.has(normalized)) return;
    if (price === null || price === undefined || Number.isNaN(price)) return;
    const timeSeconds = toUnixSeconds(timeValue ?? Date.now());

    LIVE_INTERVALS.forEach((interval) => {
      const intervalSeconds = intervalToSeconds(interval);
      if (!intervalSeconds) return;
      const bucketTime =
        Math.floor(timeSeconds / intervalSeconds) * intervalSeconds;
      const key = `${normalized}|${interval}`;
      const last = liveCandleState.get(key);
      if (last && last.time === bucketTime && last.value === price) return;
      const point = { time: bucketTime, value: price };
      liveCandleState.set(key, point);
      updateLiveSeriesStore(symbol, interval, point);
      emitLiveChartUpdate(symbol, interval, point);
    });
  };

  const ensureInterval = () => {
    if (intervalId || !hasAnySubscriptions()) return;
    intervalId = setInterval(async () => {
      if (isTicking) return;
      if (!hasAnySubscriptions()) return;
      isTicking = true;
      try {
        const entries = [...clients.entries()];
        const indexSubscribers = entries.filter(([, state]) => state.indices);
        const symbolSet = new Set();
        entries.forEach(([, state]) => {
          state.symbols.forEach((symbol) => symbolSet.add(symbol));
        });

        let indicesPayload = null;
        if (indexSubscribers.length > 0) {
          const [sensex, nifty] = await Promise.all([
            yahooFinance.quote("^BSESN"),
            yahooFinance.quote("^NSEI"),
          ]);
          const sensexState = sensex?.marketState ?? null;
          const niftyState = nifty?.marketState ?? null;
          indicesPayload = {
            nifty: {
              name: "Nifty 50",
              price: nifty?.regularMarketPrice ?? null,
              change: nifty?.regularMarketChange ?? null,
              changePercent: nifty?.regularMarketChangePercent ?? null,
              time: nifty?.regularMarketTime ?? null,
              marketState: niftyState,
            },
            sensex: {
              name: "BSE Sensex",
              price: sensex?.regularMarketPrice ?? null,
              change: sensex?.regularMarketChange ?? null,
              changePercent: sensex?.regularMarketChangePercent ?? null,
              time: sensex?.regularMarketTime ?? null,
              marketState: sensexState,
            },
            isMarketOpen: sensexState === "REGULAR" || niftyState === "REGULAR",
            source: "Yahoo Finance",
            disclaimer: "Delayed market data. For educational purposes only.",
          };

          updateLiveCandle(
            "^NSEI",
            nifty?.regularMarketPrice ?? null,
            nifty?.regularMarketTime ?? null,
          );
          updateLiveCandle(
            "^BSESN",
            sensex?.regularMarketPrice ?? null,
            sensex?.regularMarketTime ?? null,
          );
        }

        let quotesPayload = null;
        if (symbolSet.size > 0) {
          const symbols = [...symbolSet];
          const results = await Promise.all(
            symbols.map(async (symbol) => {
              try {
                const quote = await yahooFinance.quote(symbol);
                return [symbol, quote];
              } catch (error) {
                return [symbol, { error: error?.message || "Failed" }];
              }
            }),
          );
          quotesPayload = {
            data: Object.fromEntries(results),
            source: "Yahoo Finance",
          };
        }

        entries.forEach(([ws, state]) => {
          if (ws.readyState !== OPEN_STATE) return;
          if (indicesPayload && state.indices) {
            ws.send(JSON.stringify({ type: "indices", data: indicesPayload }));
          }
          if (quotesPayload && state.symbols.size > 0) {
            const data = {};
            state.symbols.forEach((symbol) => {
              if (quotesPayload.data?.[symbol] !== undefined) {
                data[symbol] = quotesPayload.data[symbol];
              }
            });
            ws.send(
              JSON.stringify({
                type: "quotes",
                data: {
                  data,
                  source: quotesPayload.source,
                },
              }),
            );
          }
        });
      } catch (error) {
        console.error("Market socket tick failed:", error?.message || error);
      } finally {
        isTicking = false;
      }
    }, TICK_INTERVAL_MS);
  };

  const ensureChartInterval = () => {
    if (chartIntervalId || !hasAnyNonLiveChartSubscriptions()) return;
    chartIntervalId = setInterval(async () => {
      if (isChartTicking) return;
      if (!hasAnyNonLiveChartSubscriptions()) return;
      isChartTicking = true;
      try {
        const entries = [...clients.entries()];
        const chartRequests = new Map();
        entries.forEach(([, state]) => {
          if (state.charts.size === 0) return;
          state.charts.forEach((chart) => {
            const { symbol, range, interval } = chart;
            if (isLiveChart(range, interval)) return;
            const key = `${symbol}|${range}|${interval}`;
            chartRequests.set(key, { symbol, range, interval });
          });
        });

        const chartResults = await Promise.all(
          [...chartRequests.entries()].map(async ([key, payload]) => {
            const result = await getChartData(
              payload.symbol,
              payload.range,
              payload.interval,
            );
            return [key, result];
          }),
        );
        const chartMap = new Map(chartResults);

        entries.forEach(([ws, state]) => {
          if (ws.readyState !== OPEN_STATE) return;
          if (state.charts.size === 0) return;
          state.charts.forEach((chart) => {
            const { key: subscriptionKey, symbol, range, interval } = chart;
            if (isLiveChart(range, interval)) return;
            const chartKey = `${symbol}|${range}|${interval}`;
            const result = chartMap.get(chartKey);
            if (!result) return;
            ws.send(
              JSON.stringify({
                type: "chart_update",
                key: subscriptionKey,
                symbol,
                range,
                interval,
                data: result?.data || [],
                meta: result?.meta || null,
              }),
            );
          });
        });
      } catch (error) {
        console.error("Chart socket tick failed:", error?.message || error);
      } finally {
        isChartTicking = false;
      }
    }, CHART_INTERVAL_MS);
  };

  const stopIntervalIfIdle = () => {
    if (!intervalId) return;
    if (hasAnySubscriptions()) return;
    clearInterval(intervalId);
    intervalId = null;
  };

  const stopChartIntervalIfIdle = () => {
    if (!chartIntervalId) return;
    if (hasAnyNonLiveChartSubscriptions()) return;
    clearInterval(chartIntervalId);
    chartIntervalId = null;
  };

  const sendChartSnapshot = (ws, chart) => {
    if (!chart) return;
    const { key: subscriptionKey, symbol, range, interval } = chart;
    getChartData(symbol, range, interval)
      .then((result) => {
        if (ws.readyState !== OPEN_STATE) return;
        ws.send(
          JSON.stringify({
            type: "chart_update",
            key: subscriptionKey,
            symbol,
            range,
            interval,
            data: result?.data || [],
            meta: {
              ...(result?.meta || null),
              mode: "snapshot",
              source: "yahoo_chart",
            },
          }),
        );

        if (isLiveChart(range, interval)) {
          const liveSnapshot = buildLiveSnapshot(symbol, interval);
          if (liveSnapshot.length > 0) {
            ws.send(
              JSON.stringify({
                type: "chart_update",
                key: subscriptionKey,
                symbol,
                range,
                interval,
                data: liveSnapshot,
                meta: {
                  mode: "update",
                  source: "live_cache",
                },
              }),
            );
          }
        }
      })
      .catch((error) => {
        if (ws.readyState !== OPEN_STATE) return;
        ws.send(
          JSON.stringify({
            type: "chart_update",
            key: subscriptionKey,
            symbol,
            range,
            interval,
            error: error?.message || "Failed to load chart",
          }),
        );
      });
  };

  wss.on("connection", (ws) => {
    const state = createClientState();
    clients.set(ws, state);

    ws.on("message", (raw) => {
      let message;
      try {
        message = JSON.parse(raw.toString());
      } catch {
        return;
      }

      switch (message?.type) {
        case "subscribe_indices":
          state.indices = true;
          ensureInterval();
          break;
        case "unsubscribe_indices":
          state.indices = false;
          stopIntervalIfIdle();
          break;
        case "subscribe_quotes": {
          const symbols = sanitizeSymbols(message?.symbols || []);
          state.symbols = new Set(symbols);
          if (state.symbols.size > 0) ensureInterval();
          else stopIntervalIfIdle();
          break;
        }
        case "unsubscribe_quotes":
          state.symbols.clear();
          stopIntervalIfIdle();
          break;
        case "subscribe_chart": {
          const subscriptionKey = String(message?.key || "").trim();
          const symbol = String(message?.symbol || "").trim();
          const range = String(message?.range || "1mo").trim();
          const interval = String(message?.interval || "5m").trim();
          if (!subscriptionKey || !symbol) return;
          const nextChart = { key: subscriptionKey, symbol, range, interval };
          state.charts.set(subscriptionKey, nextChart);
          rebuildStreamerSubscriptions();
          ensureChartInterval();
          sendChartSnapshot(ws, nextChart);
          break;
        }
        case "unsubscribe_chart": {
          const subscriptionKey = String(message?.key || "").trim();
          if (subscriptionKey) {
            state.charts.delete(subscriptionKey);
          } else {
            state.charts.clear();
          }
          rebuildStreamerSubscriptions();
          stopChartIntervalIfIdle();
          break;
        }
        case "chart_request": {
          const symbol = String(message?.symbol || "").trim();
          const range = String(message?.range || "1mo").trim();
          const interval = String(message?.interval || "5m").trim();
          const requestId = String(message?.requestId || "");
          if (!symbol || !requestId) return;
          getChartData(symbol, range, interval)
            .then((result) => {
              if (ws.readyState !== OPEN_STATE) return;
              ws.send(
                JSON.stringify({
                  type: "chart",
                  requestId,
                  data: result?.data || [],
                  meta: result?.meta || null,
                }),
              );
            })
            .catch((error) => {
              if (ws.readyState !== OPEN_STATE) return;
              ws.send(
                JSON.stringify({
                  type: "chart",
                  requestId,
                  error: error?.message || "Failed to load chart",
                }),
              );
            });
          break;
        }
        default:
          break;
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
      stopIntervalIfIdle();
      stopChartIntervalIfIdle();
      rebuildStreamerSubscriptions();
    });
  });

  return wss;
};

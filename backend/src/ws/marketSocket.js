import { WebSocketServer } from "ws";
import YahooFinance from "yahoo-finance2";
import { getChartData } from "../services/yahoo.services.js";

const OPEN_STATE = 1;
const TICK_INTERVAL_MS = 1000;

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

const createClientState = () => ({
  indices: false,
  symbols: new Set(),
});

const sanitizeSymbols = (symbols) =>
  [...new Set(symbols.map((symbol) => String(symbol || "").trim()))].filter(
    Boolean,
  );

export const startMarketSocket = (server) => {
  const wss = new WebSocketServer({ server, path: "/ws/market" });
  const clients = new Map();
  let intervalId = null;
  let isTicking = false;

  const hasAnySubscriptions = () => {
    for (const state of clients.values()) {
      if (state.indices || state.symbols.size > 0) return true;
    }
    return false;
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

  const stopIntervalIfIdle = () => {
    if (!intervalId) return;
    if (hasAnySubscriptions()) return;
    clearInterval(intervalId);
    intervalId = null;
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
    });
  });

  return wss;
};

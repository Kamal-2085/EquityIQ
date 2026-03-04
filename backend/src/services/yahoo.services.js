import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey", "ripHistorical"],
});

const rangeToMs = (range) => {
  switch (range) {
    case "1d":
      return 1 * 24 * 60 * 60 * 1000;
    case "5d":
      return 5 * 24 * 60 * 60 * 1000;
    case "1mo":
      return 30 * 24 * 60 * 60 * 1000;
    case "3mo":
      return 90 * 24 * 60 * 60 * 1000;
    case "6mo":
      return 180 * 24 * 60 * 60 * 1000;
    case "1y":
      return 365 * 24 * 60 * 60 * 1000;
    case "5y":
      return 5 * 365 * 24 * 60 * 60 * 1000;
    case "max":
      return 20 * 365 * 24 * 60 * 60 * 1000;
    default:
      return 30 * 24 * 60 * 60 * 1000;
  }
};

export const getChartData = async (symbol, range = "1mo", interval = "5m") => {
  const period2 = new Date();
  const period1 = new Date(Date.now() - rangeToMs(range));
  const normalizedSymbol = String(symbol || "")
    .trim()
    .toUpperCase();
  const baseSymbol = normalizedSymbol.replace(/\.(NS|BO)$/i, "");
  const candidates = [normalizedSymbol];
  if (baseSymbol && baseSymbol !== normalizedSymbol) {
    candidates.push(baseSymbol);
  }
  if (!/\.(NS|BO)$/i.test(normalizedSymbol)) {
    candidates.push(`${normalizedSymbol}.NS`, `${normalizedSymbol}.BO`);
  }

  const historicalIntervals = new Set(["1d", "1wk", "1mo"]);
  const isIntraday = !historicalIntervals.has(interval);
  const intradayFallbacks = {
    "1m": "5m",
    "5m": "15m",
    "15m": "30m",
    "30m": "1h",
  };
  const fallbackInterval = isIntraday ? intradayFallbacks[interval] : null;
  const intervalsToTry = fallbackInterval
    ? [interval, fallbackInterval]
    : [interval];
  const safeHistoricalInterval = historicalIntervals.has(interval)
    ? interval
    : "1d";

  const fetchChart = async (
    symbolValue,
    intervalValue,
    period1Value = period1,
  ) => {
    try {
      return await yahooFinance.chart(symbolValue, {
        period1: period1Value,
        period2,
        interval: intervalValue,
      });
    } catch {
      return null;
    }
  };

  const fetchHistorical = async (
    symbolValue,
    intervalValue,
    rangeValue = range,
  ) => {
    try {
      const fallbackPeriod1 = new Date(Date.now() - rangeToMs(rangeValue));
      return await yahooFinance.historical(symbolValue, {
        period1: fallbackPeriod1,
        period2,
        interval: intervalValue,
      });
    } catch {
      return null;
    }
  };

  const mapHistorical = (historical) =>
    historical
      .map((point) => ({
        time: point?.date
          ? Math.floor(new Date(point.date).getTime() / 1000)
          : null,
        value: point?.close ?? null,
      }))
      .filter((point) => point.time && point.value !== null);

  const mapChart = (timestamps, closes) =>
    timestamps
      .map((time, i) => ({
        time,
        value: closes[i],
      }))
      .filter((point) => point.value !== null && point.value !== undefined);

  const toUtcDateKey = (unixTime) => {
    const date = new Date(unixTime * 1000);
    return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
  };

  const trimToLatestSession = (data) => {
    if (!Array.isArray(data) || data.length === 0) return [];
    const last = data[data.length - 1];
    if (!last?.time) return data;
    const lastKey = toUtcDateKey(last.time);
    const filtered = data.filter(
      (point) => point?.time && toUtcDateKey(point.time) === lastKey,
    );
    return filtered.length > 0 ? filtered : data;
  };

  const fetchChartData = async (period1Value) => {
    let result = null;
    let timestamps = [];
    let usedInterval = interval;

    for (const candidate of candidates) {
      for (const intervalValue of intervalsToTry) {
        result = await fetchChart(candidate, intervalValue, period1Value);
        timestamps = result?.timestamp || [];
        if (timestamps.length > 0) {
          usedInterval = intervalValue;
          break;
        }
      }
      if (timestamps.length > 0) break;
    }

    if (timestamps.length === 0) return null;

    const quotes = result?.indicators?.quote?.[0];
    const closes = quotes?.close || [];
    return {
      data: mapChart(timestamps, closes),
      interval: result?.meta?.interval || usedInterval,
    };
  };

  if (historicalIntervals.has(interval)) {
    for (const candidate of candidates) {
      const historical = await fetchHistorical(
        candidate,
        safeHistoricalInterval,
      );
      if (Array.isArray(historical) && historical.length > 0) {
        return {
          data: mapHistorical(historical),
          meta: {
            intradayFallback: false,
            interval: safeHistoricalInterval,
            range,
          },
        };
      }
    }
  }

  const chartResult = await fetchChartData(period1);
  if (chartResult?.data?.length > 0) {
    let data = chartResult.data;
    let intervalUsed = chartResult.interval;

    if (isIntraday && range === "1d" && data.length < 2) {
      const extendedPeriod1 = new Date(Date.now() - rangeToMs("5d"));
      const extendedResult = await fetchChartData(extendedPeriod1);
      if (extendedResult?.data?.length > 0) {
        const trimmed = trimToLatestSession(extendedResult.data);
        const resolved = trimmed.length > 1 ? trimmed : extendedResult.data;
        if (resolved.length > data.length) {
          data = resolved;
          intervalUsed = extendedResult.interval;
          return {
            data,
            meta: {
              intradayFallback: false,
              interval: intervalUsed,
              range,
              rangeFallback: "5d",
            },
          };
        }
      }
    }

    return {
      data,
      meta: {
        intradayFallback: false,
        interval: intervalUsed,
        range,
      },
    };
  }

  if (isIntraday) {
    const fallbackRange = range;
    for (const candidate of candidates) {
      const historical = await fetchHistorical(candidate, "1d", fallbackRange);
      if (Array.isArray(historical) && historical.length > 0) {
        return {
          data: mapHistorical(historical),
          meta: {
            intradayFallback: true,
            interval: "1d",
            range: fallbackRange,
          },
        };
      }
    }
  }

  if (!isIntraday) {
    for (const candidate of candidates) {
      const historical = await fetchHistorical(
        candidate,
        safeHistoricalInterval,
      );
      if (Array.isArray(historical) && historical.length > 0) {
        return {
          data: mapHistorical(historical),
          meta: {
            intradayFallback: false,
            interval: safeHistoricalInterval,
            range,
          },
        };
      }
    }
  }

  return {
    data: [],
    meta: {
      intradayFallback: false,
      interval,
      range,
    },
  };
};

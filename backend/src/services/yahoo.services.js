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

  const fetchChart = async (symbolValue, intervalValue) => {
    try {
      return await yahooFinance.chart(symbolValue, {
        period1,
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

  let result = null;
  let timestamps = [];

  for (const candidate of candidates) {
    for (const intervalValue of intervalsToTry) {
      result = await fetchChart(candidate, intervalValue);
      timestamps = result?.timestamp || [];
      if (timestamps.length > 0) break;
    }
    if (timestamps.length > 0) break;
  }

  if (timestamps.length > 0) {
    const quotes = result?.indicators?.quote?.[0];
    const closes = quotes?.close || [];
    return {
      data: mapChart(timestamps, closes),
      meta: {
        intradayFallback: false,
        interval: result?.meta?.interval || interval,
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

  if (!isIntraday && timestamps.length === 0) {
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

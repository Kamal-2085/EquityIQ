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

  const intervalsToTry = interval === "1d" ? ["1d"] : [interval, "1d"];
  const historicalIntervals = new Set(["1d", "1wk", "1mo"]);
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

  const fetchHistorical = async (symbolValue, intervalValue) => {
    try {
      return await yahooFinance.historical(symbolValue, {
        period1,
        period2,
        interval: intervalValue,
      });
    } catch {
      return null;
    }
  };

  for (const candidate of candidates) {
    const historical = await fetchHistorical(candidate, safeHistoricalInterval);
    if (Array.isArray(historical) && historical.length > 0) {
      return historical
        .map((point) => ({
          time: point?.date
            ? Math.floor(new Date(point.date).getTime() / 1000)
            : null,
          value: point?.close ?? null,
        }))
        .filter((point) => point.time && point.value !== null);
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

  const quotes = result?.indicators?.quote?.[0];
  const closes = quotes?.close || [];

  return timestamps
    .map((time, i) => ({
      time,
      value: closes[i],
    }))
    .filter((point) => point.value !== null && point.value !== undefined);
};

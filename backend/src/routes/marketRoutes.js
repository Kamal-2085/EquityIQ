import express from "express";
import YahooFinance from "yahoo-finance2";
import Stock from "../models/Stock.model.js";
import { getChartData } from "../services/yahoo.services.js";
const router = express.Router();
const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});
router.get("/chart/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const range = req.query.range || "1mo";
    const interval = req.query.interval || "5m";

    if (!symbol) {
      return res.status(400).json({ message: "symbol is required" });
    }

    const result = await getChartData(symbol, range, interval);

    return res.json({
      symbol,
      range,
      interval,
      data: result?.data || [],
      meta: result?.meta || null,
      source: "Yahoo Finance",
      disclaimer: "Delayed market data. For educational purposes only.",
    });
  } catch (error) {
    console.error("Chart fetch failed:", error?.message || error);
    return res.status(500).json({ message: "Failed to fetch chart data" });
  }
});
router.get("/indices", async (req, res) => {
  try {
    const [sensex, nifty] = await Promise.all([
      yahooFinance.quote("^BSESN"),
      yahooFinance.quote("^NSEI"),
    ]);

    const sensexState = sensex?.marketState ?? null;
    const niftyState = nifty?.marketState ?? null;

    return res.json({
      sensex: {
        name: "BSE Sensex",
        price: sensex?.regularMarketPrice ?? null,
        change: sensex?.regularMarketChange ?? null,
        changePercent: sensex?.regularMarketChangePercent ?? null,
        time: sensex?.regularMarketTime ?? null,
        marketState: sensexState,
      },
      nifty: {
        name: "Nifty 50",
        price: nifty?.regularMarketPrice ?? null,
        change: nifty?.regularMarketChange ?? null,
        changePercent: nifty?.regularMarketChangePercent ?? null,
        time: nifty?.regularMarketTime ?? null,
        marketState: niftyState,
      },
      isMarketOpen: sensexState === "REGULAR" || niftyState === "REGULAR",
      source: "Yahoo Finance",
      disclaimer: "Delayed market data. For educational purposes only.",
    });
  } catch (error) {
    console.error("Yahoo Finance fetch failed:", error?.message || error);
    return res.status(500).json({ message: "Failed to fetch market data" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = String(req.query.query || "").trim();
    if (!query) {
      return res.status(400).json({ message: "query is required" });
    }

    const results = await yahooFinance.search(query, {
      quotesCount: 5,
      newsCount: 0,
      enableFuzzyQuery: true,
    });

    const quotes = results?.quotes || [];
    const term = query.toLowerCase();
    const isIndiaListing = (quote) => {
      const symbol = String(quote?.symbol || "").toUpperCase();
      const exchange = String(
        quote?.exchange || quote?.exchDisp || "",
      ).toUpperCase();
      return (
        symbol.endsWith(".NS") ||
        symbol.endsWith(".BO") ||
        exchange.includes("NSI") ||
        exchange.includes("NSE") ||
        exchange.includes("BSE")
      );
    };
    const nameMatchesTerm = (quote) => {
      const name = String(quote?.shortname || quote?.longname || "")
        .toLowerCase()
        .trim();
      return name && name.includes(term);
    };
    const symbolMatchesTerm = (quote) => {
      const symbol = String(quote?.symbol || "").toLowerCase();
      return symbol && symbol.includes(term);
    };

    const prioritized = quotes.filter((quote) => quote?.symbol);
    const indiaQuotes = prioritized.filter(isIndiaListing);
    const nameMatches = indiaQuotes.filter(nameMatchesTerm);
    const symbolMatches = indiaQuotes.filter(symbolMatchesTerm);
    const normalizeName = (value) =>
      String(value || "")
        .toLowerCase()
        .replace(
          /\b(limited|ltd|ltd\.|limited\.|ltd\s+co|co\.?|inc|corp|corporation)\b/g,
          " ",
        )
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
    const normalizeBase = (symbol) =>
      String(symbol || "")
        .replace(/\.NS$/i, "")
        .replace(/\.BO$/i, "");

    const orderedCandidates = [
      ...nameMatches,
      ...symbolMatches,
      ...indiaQuotes,
      ...prioritized,
    ];
    const seenKeys = new Set();
    const uniqueCandidates = [];
    orderedCandidates.forEach((quote) => {
      const symbol = quote?.symbol;
      if (!symbol) return;
      const nameKey = normalizeName(quote.shortname || quote.longname);
      const baseKey = normalizeBase(symbol).toLowerCase();
      const dedupeKey = nameKey || baseKey;
      if (!dedupeKey || seenKeys.has(dedupeKey)) return;
      seenKeys.add(dedupeKey);
      uniqueCandidates.push(quote);
    });
    const matches = uniqueCandidates.slice(0, 5);

    if (matches.length === 0) {
      return res.json({ results: [] });
    }

    const byBase = (quote, base, suffix) =>
      quote?.symbol &&
      normalizeBase(quote.symbol) === base &&
      quote.symbol.toUpperCase().endsWith(suffix);
    const byName = (quote, suffix) =>
      quote?.symbol && quote.symbol.toUpperCase().endsWith(suffix);

    const safeQuote = async (symbol) => {
      try {
        const quote = await yahooFinance.quote(symbol);
        if (
          quote?.regularMarketPrice === null ||
          quote?.regularMarketPrice === undefined
        ) {
          return null;
        }
        return symbol;
      } catch (error) {
        return null;
      }
    };

    const resultsPayload = await Promise.all(
      matches.map(async (match) => {
        const baseSymbol = normalizeBase(match.symbol);
        const matchName = String(match.shortname || match.longname || "")
          .toLowerCase()
          .trim();
        const nameExactMatches = matchName
          ? quotes.filter((quote) => {
              const quoteName = String(quote.shortname || quote.longname || "")
                .toLowerCase()
                .trim();
              return quoteName && quoteName === matchName;
            })
          : [];
        const nseMatch =
          nameExactMatches.find((quote) => byName(quote, ".NS")) ||
          quotes.find((quote) => byBase(quote, baseSymbol, ".NS"));
        const bseMatch =
          nameExactMatches.find((quote) => byName(quote, ".BO")) ||
          quotes.find((quote) => byBase(quote, baseSymbol, ".BO"));
        let nseSymbol =
          nseMatch?.symbol ||
          (match.symbol.toUpperCase().endsWith(".NS") ? match.symbol : null);
        let bseSymbol =
          bseMatch?.symbol ||
          (match.symbol.toUpperCase().endsWith(".BO") ? match.symbol : null);

        if (!nseSymbol || !bseSymbol) {
          const candidateNse = `${baseSymbol}.NS`;
          const candidateBse = `${baseSymbol}.BO`;
          const [resolvedNse, resolvedBse] = await Promise.all([
            nseSymbol ? Promise.resolve(nseSymbol) : safeQuote(candidateNse),
            bseSymbol ? Promise.resolve(bseSymbol) : safeQuote(candidateBse),
          ]);
          nseSymbol = resolvedNse;
          bseSymbol = resolvedBse;
        }

        return {
          symbol: match.symbol,
          nseSymbol: nseSymbol || null,
          bseSymbol: bseSymbol || null,
          name: match.shortname || match.longname || match.symbol,
          exchange: match.exchange || match.exchDisp || null,
        };
      }),
    );

    return res.json({
      results: resultsPayload,
      source: "Yahoo Finance",
    });
  } catch (error) {
    console.error("Yahoo Finance search failed:", error?.message || error);
    return res.status(500).json({ message: "Failed to search market data" });
  }
});

router.get("/quotes", async (req, res) => {
  try {
    const rawSymbols = req.query.symbols;
    if (!rawSymbols) {
      return res.status(400).json({ message: "symbols query is required" });
    }

    const symbols = String(rawSymbols)
      .split(",")
      .map((symbol) => symbol.trim())
      .filter(Boolean);

    if (symbols.length === 0) {
      return res.status(400).json({ message: "No valid symbols provided" });
    }

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

    return res.json({
      data: Object.fromEntries(results),
      source: "Yahoo Finance",
    });
  } catch (error) {
    console.error("Yahoo Finance quote failed:", error?.message || error);
    return res.status(500).json({ message: "Failed to fetch quotes" });
  }
});

router.get("/nifty50", async (req, res) => {
  try {
    const stocks = await Stock.find({ isNifty50: true, isActive: true })
      .select("symbol name exchange")
      .sort({ name: 1 });

    const results = stocks.map((stock) => ({
      name: stock.name,
      nse: `${stock.symbol}.NS`,
      bse: `${stock.symbol}.BO`,
      exchange: stock.exchange,
    }));

    return res.json({
      results,
      source: "Database",
    });
  } catch (error) {
    console.error(
      "Yahoo Finance NIFTY 50 fetch failed:",
      error?.message || error,
    );
    return res.status(500).json({ message: "Failed to fetch NIFTY 50 list" });
  }
});

router.get("/stocks/:symbol", async (req, res) => {
  try {
    const rawSymbol = String(req.params.symbol || "").trim();
    if (!rawSymbol) {
      return res.status(400).json({ message: "symbol is required" });
    }
    const baseSymbol = rawSymbol.replace(/\.NS$|\.BO$/i, "").toUpperCase();
    const stock = await Stock.findOne({
      symbol: baseSymbol,
      isActive: true,
    }).select("symbol name exchange domain isNifty50");

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    return res.json({
      symbol: stock.symbol,
      name: stock.name,
      exchange: stock.exchange,
      domain: stock.domain || null,
      isNifty50: Boolean(stock.isNifty50),
    });
  } catch (error) {
    console.error("Stock fetch failed:", error?.message || error);
    return res.status(500).json({ message: "Failed to fetch stock" });
  }
});

export default router;

import React, { useEffect, useRef, useState } from "react";

const Message = ({ m }) => (
  <div
    className={`mb-3 max-w-[85%] ${
      m.role === "user" ? "ml-auto text-right" : ""
    }`}
  >
    <div
      className={`inline-block rounded-lg px-3 py-2 text-sm shadow-sm ${
        m.role === "user"
          ? "bg-green-600 text-white"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      {m.text}
    </div>
  </div>
);

const SCORE_LABELS = {
  Graph: "Graph Analysis",
  Profile: "Company Profile",
  PriceMarket: "Price & Market",
  Valuation: "Valuation",
  News: "News Sentiment",
};

const getRecommendationTone = (recommendation) => {
  const value = String(recommendation || "").toUpperCase();
  if (value.includes("STRONG BUY")) return "bg-green-600";
  if (value.includes("BUY")) return "bg-green-500";
  if (value.includes("HOLD")) return "bg-yellow-500";
  if (value.includes("SELL")) return "bg-orange-500";
  return "bg-gray-400";
};

const buildExplanation = ({ finalScore, scores, recommendation }) => {
  const entries = Object.entries(scores || {}).filter(
    ([, value]) => typeof value === "number" && !Number.isNaN(value),
  );
  if (entries.length === 0) {
    return "EquityAI could not compute all signals yet. Please try again.";
  }
  entries.sort((a, b) => b[1] - a[1]);
  const [topKey, topValue] = entries[0];
  const [bottomKey, bottomValue] = entries[entries.length - 1];
  const topLabel = SCORE_LABELS[topKey] || topKey;
  const bottomLabel = SCORE_LABELS[bottomKey] || bottomKey;
  let tone = "balanced";
  if (typeof finalScore === "number") {
    if (finalScore >= 7.5) tone = "positive";
    else if (finalScore < 5) tone = "cautious";
  }
  const rec = recommendation || "HOLD / MAY BUY";
  return `${topLabel} looks strongest (${topValue.toFixed(
    2,
  )}) while ${bottomLabel} is softer (${bottomValue.toFixed(
    2,
  )}). Overall signals are ${tone}, so the system recommends ${rec}.`;
};

// Confidence indicator removed per design decision. UI no longer shows confidence.

const AnalysisResult = ({ payload, companyName, symbol, formatScore }) => {
  const name = companyName || symbol || "Company";
  const scores = payload?.scores || {};
  const errors = payload?.errors || {};
  const scoreEntries = Object.entries(scores);
  const recommendation = payload?.recommendation || "N/A";
  const explanation = buildExplanation({
    finalScore: payload?.finalScore,
    scores,
    recommendation,
  });
  const disclaimer =
    "This analysis is generated using EquityAI's machine learning models that evaluate technical trends, company fundamentals, market data, valuation metrics, and recent news sentiment. The result is an AI-based opinion and should not be considered financial advice.";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-800 shadow-sm">
      <div className="text-xs font-semibold text-gray-500">
        EquityAI Analysis — {name}
      </div>
      <div className="mt-4 space-y-2">
        <div className="text-sm font-semibold text-gray-900">
          Final Score: {formatScore(payload?.finalScore)} / 10
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          Recommendation:
          <span
            className={`inline-flex h-2.5 w-2.5 rounded-full ${getRecommendationTone(
              recommendation,
            )}`}
          />
          <span>{recommendation}</span>
        </div>
      </div>

      <div className="my-4 h-px w-full bg-gray-200" />

      <div className="text-sm font-semibold text-gray-900">
        Analyzer Breakdown
      </div>
      <div className="mt-2 space-y-1 text-sm text-gray-700">
        {scoreEntries.length === 0 ? (
          <div>No analyzer scores available.</div>
        ) : (
          scoreEntries.map(([key, value]) => {
            const isDefault = Object.prototype.hasOwnProperty.call(errors, key);
            return (
              <div key={key} className="flex items-center justify-between">
                <span>{SCORE_LABELS[key] || key}</span>
                <span className="flex items-center gap-2">
                  {isDefault ? (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                      Default
                    </span>
                  ) : null}
                  <span className="font-semibold">{formatScore(value)}</span>
                </span>
              </div>
            );
          })
        )}
        {Object.keys(errors).length > 0 ? (
          <div className="text-xs text-orange-600">
            Used defaults for: {Object.keys(errors).join(", ")}
          </div>
        ) : null}
      </div>

      <div className="my-4 h-px w-full bg-gray-200" />

      <div className="text-sm font-semibold text-gray-900">AI Explanation</div>
      <p className="mt-2 text-sm text-gray-700">{explanation}</p>

      <div className="my-4 h-px w-full bg-gray-200" />

      <p className="text-xs text-gray-500">{disclaimer}</p>
    </div>
  );
};

const EquityAIChat = ({
  companyName,
  symbol,
  companyProfile,
  priceData,
  fundamentals,
  newsItems,
  chartData,
  useOneYearHistory,
  onClose,
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: `EquityAI ready to analyze ${companyName || "Company"}.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [error, setError] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const formatScore = (value) =>
    typeof value === "number" && !Number.isNaN(value) ? value.toFixed(2) : "--";

  const normalizeChartData = (series) => {
    const raw = Array.isArray(series) ? series : [];
    return raw
      .map((point) => ({
        time: point?.time ?? null,
        close: point?.value ?? point?.close ?? null,
        volume: point?.volume ?? null,
      }))
      .filter((point) => typeof point.close === "number");
  };

  const loadHistoricalData = async () => {
    if (!symbol) {
      throw new Error("Missing stock symbol for analysis.");
    }

    const params = new URLSearchParams({
      range: "1y",
      interval: "1d",
    });
    const response = await fetch(
      `/api/market/chart/${encodeURIComponent(symbol)}?${params.toString()}`,
    );

    if (!response.ok) {
      throw new Error("Failed to load 1-year historical data.");
    }

    const payload = await response.json();
    const raw = Array.isArray(payload?.data) ? payload.data : [];
    const normalized = raw
      .map((point) => ({
        time: point?.time ?? null,
        close: point?.value ?? point?.close ?? null,
        volume: point?.volume ?? null,
      }))
      .filter((point) => typeof point.close === "number");

    if (normalized.length === 0) {
      throw new Error("Historical data is empty for this symbol.");
    }

    return normalized;
  };

  const normalizeNewsItems = (items) => {
    const list = Array.isArray(items) ? items : [];

    // sanitize helper: strip HTML, collapse whitespace, truncate
    const sanitize = (s, max = 1000) => {
      if (s === null || s === undefined) return "";
      const str = String(s)
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();
      return str.length > max ? str.slice(0, max) : str;
    };

    return list.slice(0, 5).map((item) => {
      const titleRaw = item.title || item.headline || "";
      const summaryRaw = item.snippet || item.summary || "";
      const contentRaw =
        item.content || item.snippet || item.summary || item.title || "";
      return {
        title: sanitize(titleRaw, 200),
        summary: sanitize(summaryRaw, 400),
        content: sanitize(contentRaw, 1000),
        publishedAt: item.publishedAt || item.publishedAtText || null,
        source: item.publisher || item.source || "Unknown",
        url: item.link || item.url || null,
      };
    });
  };

  const fetchNewsForCompany = async (company) => {
    if (!company) return null;
    try {
      const resp = await fetch(
        `/api/market/news/${encodeURIComponent(company)}`,
      );
      if (!resp.ok) return null;
      const data = await resp.json();
      const results = Array.isArray(data?.results) ? data.results : [];
      return normalizeNewsItems(results);
    } catch (e) {
      return null;
    }
  };

  const handleSend = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setError("");
    setMessages([]);
    setAnalysisResult(null);

    try {
      const normalizedChart = normalizeChartData(chartData);
      const historical = useOneYearHistory
        ? await loadHistoricalData()
        : normalizedChart.length > 0
        ? normalizedChart
        : await loadHistoricalData();
      // use displayed news when available; fallback to fetch (non-fatal)
      let news = null;
      if (Array.isArray(newsItems) && newsItems.length > 0) {
        news = normalizeNewsItems(newsItems);
      } else {
        try {
          const companyForNews = (companyName || symbol || "").trim();
          if (companyForNews) news = await fetchNewsForCompany(companyForNews);
        } catch (e) {
          news = null;
        }
      }

      const response = await fetch("/api/market/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol: symbol || "",
          companyName: companyName || "",
          historical,
          companyProfile: companyProfile || null,
          priceData: priceData || null,
          fundamentals: fundamentals || null,
          news: news || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed. Try again in a moment.");
      }

      const payload = await response.json();
      setIsAnalyzing(false);
      setHasAnalyzed(true);
      setAnalysisResult(payload);
    } catch (err) {
      setIsAnalyzing(false);
      setHasAnalyzed(false);
      setAnalysisResult(null);
      const message =
        err?.message || "Unable to run EquityAI analysis right now.";
      setError(message);
      setMessages([
        {
          id: Date.now(),
          role: "ai",
          text: `EquityAI error: ${message}`,
        },
      ]);
    }
  };

  return (
    <aside className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col flex-1">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src="/img3.png"
            alt="EquityAI"
            className="h-9 w-9 rounded-full border border-gray-200 object-contain bg-white"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">EquityAI</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onClose && onClose()}
            className="text-xs text-gray-500 hover:text-gray-700"
            type="button"
          >
            Back
          </button>
        </div>
      </div>

      <div ref={listRef} className="flex-1 overflow-auto px-6 py-4">
        {isAnalyzing ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin" />
            <div className="mt-3 text-sm text-gray-600">
              Analyzing the stock
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {analysisResult ? (
              <AnalysisResult
                payload={analysisResult}
                companyName={companyName}
                symbol={symbol}
                formatScore={formatScore}
              />
            ) : (
              messages.map((m) => <Message key={m.id} m={m} />)
            )}
            {error ? <div className="text-xs text-red-500">{error}</div> : null}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 px-6 py-6">
        <div className="flex items-center justify-center">
          {!isAnalyzing ? (
            <button
              onClick={handleSend}
              type="button"
              className="rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-800"
            >
              {hasAnalyzed ? "ReAnalyze it!!" : "Analyze now!!"}
            </button>
          ) : (
            <div className="h-9" />
          )}
        </div>
      </div>
    </aside>
  );
};

export default EquityAIChat;

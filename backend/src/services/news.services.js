import axios from "axios";

// 24 hours TTL for news cache
const NEWS_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
// in-memory cache: key -> { data, expiresAt }
const newsCache = new Map();
// dedupe concurrent requests: key -> Promise
const pendingNewsRequests = new Map();

export const fetchCompanyNews = async (companyName) => {
  if (!companyName) return [];
  const key = String(companyName || "")
    .trim()
    .toLowerCase();

  if (!process.env.SERPAPI_KEY) {
    return [];
  }

  const now = Date.now();
  const cached = newsCache.get(key);
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  // If a fetch is already in progress for this key, return that promise
  if (pendingNewsRequests.has(key)) return pendingNewsRequests.get(key);

  const promise = (async () => {
    try {
      const response = await axios.get("https://serpapi.com/search.json", {
        params: {
          engine: "google_news",
          q: companyName,
          gl: "in",
          hl: "en",
          api_key: process.env.SERPAPI_KEY,
        },
      });

      const news = response.data?.news_results || [];

      const normalized = news
        .slice(0, 5) // top 5 only
        .map((item) => {
          const parsed = item?.date ? Date.parse(item.date) : NaN;
          const publishedAt = Number.isFinite(parsed)
            ? Math.floor(parsed / 1000)
            : null;
          return {
            title: item.title,
            link: item.link,
            publisher: item.source?.name || "Unknown",
            publishedAt,
            publishedAtText: item.date || "",
            snippet: item.snippet || "",
            thumbnail: item.thumbnail || null,
          };
        });

      // store in cache
      newsCache.set(key, {
        data: normalized,
        expiresAt: Date.now() + NEWS_CACHE_TTL_MS,
      });

      return normalized;
    } catch (err) {
      // on error, if we have any cached data return it (even if expired), otherwise return empty
      if (cached && cached.data) return cached.data;
      return [];
    } finally {
      pendingNewsRequests.delete(key);
    }
  })();

  pendingNewsRequests.set(key, promise);
  return promise;
};

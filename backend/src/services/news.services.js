import axios from "axios";

export const fetchCompanyNews = async (companyName) => {
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

  return news
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
};

import os
import json
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import numpy as np

try:
    nltk.download("vader_lexicon", quiet=True)
except Exception:
    pass

# ---------------------------------
# Load news from backend-provided JSON
# ---------------------------------

news_path = os.getenv("NEWS_PATH")
articles = []
if news_path and os.path.exists(news_path):
    try:
        with open(news_path, "r", encoding="utf-8") as f:
            raw = json.load(f) or []
    except Exception:
        raw = []

    # handle common wrapper shapes
    if isinstance(raw, dict):
        if isinstance(raw.get("news"), list):
            articles = raw.get("news")
        elif isinstance(raw.get("articles"), list):
            articles = raw.get("articles")
        elif isinstance(raw.get("items"), list):
            articles = raw.get("items")
        else:
            # try to find the first list value
            found = None
            for v in raw.values():
                if isinstance(v, list):
                    found = v
                    break
            articles = found or []
    elif isinstance(raw, list):
        articles = raw
    else:
        articles = []
else:
    # no news provided
    articles = []

# limit articles to a reasonable size
MAX_ARTICLES = 20
articles = articles[:MAX_ARTICLES]

news_score = 5.5
final_score = news_score
sentiments = []
texts_used = []

try:
    sia = SentimentIntensityAnalyzer()
    for art in articles:
        text = ""
        if isinstance(art, dict):
            text = (
                art.get("content")
                or art.get("summary")
                or art.get("description")
                or art.get("title")
                or art.get("headline")
                or ""
            )
        else:
            text = str(art)

        text = text.strip()
        if not text:
            continue

        # truncate to avoid huge inputs
        if len(text) > 5000:
            text = text[:5000]

        texts_used.append(text)
        s = sia.polarity_scores(text)
        sentiments.append(s.get("compound", 0.0))

    if len(sentiments) == 0:
        avg_sentiment = 0.0
    else:
        avg_sentiment = float(np.mean(sentiments))

    # Convert [-1,1] → [1,10]
    news_score = (avg_sentiment + 1) * 4.5 + 1
    news_score = max(1.0, min(10.0, news_score))
    news_score = round(news_score, 2)
    final_score = news_score
except Exception as e:
    print("News Analyzer Warning:", str(e))

print(f"News articles processed: {len(texts_used)}")
for t in texts_used[:5]:
    short = t if len(t) < 200 else t[:200] + "..."
    print("-", short)

print("\nNews Analyzer Score (1-10):", news_score)
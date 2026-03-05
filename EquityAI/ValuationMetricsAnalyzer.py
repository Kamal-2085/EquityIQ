import os
import json
import re
import numpy as np
from sklearn.ensemble import RandomForestRegressor

# -----------------------------------
# Load valuation metrics from backend-provided fundamentals file
# -----------------------------------

fund_path = os.getenv("FUNDAMENTALS_PATH")
if not fund_path or not os.path.exists(fund_path):
    raise FileNotFoundError("FUNDAMENTALS_PATH is required for ValuationMetricsAnalyzer")

with open(fund_path, "r", encoding="utf-8") as f:
    raw = json.load(f) or {}

# If the backend wrote a wrapper object like { fundamentals: { ... } }, unwrap it
if isinstance(raw, dict) and isinstance(raw.get("fundamentals"), dict):
    fundamentals = raw.get("fundamentals")
else:
    fundamentals = raw


def _to_float(x, default=0.0):
    if x is None:
        return float(default)
    if isinstance(x, (int, float)):
        try:
            return float(x)
        except Exception:
            return float(default)
    if isinstance(x, str):
        s = x.strip()
        # remove currency symbols, commas, and other non-numeric characters
        s_clean = re.sub(r"[^0-9eE\-\.]+", "", s)
        if s_clean == "":
            return float(default)
        try:
            return float(s_clean)
        except Exception:
            try:
                return float(s.replace(",", ""))
            except Exception:
                return float(default)
    return float(default)


# Accept multiple possible key names commonly used by different sources
market_cap = _to_float(
    fundamentals.get("marketCap")
    or fundamentals.get("market_cap")
    or fundamentals.get("marketCapitalization"),
    0,
)
pe_ratio = _to_float(
    fundamentals.get("trailingPE")
    or fundamentals.get("peRatio")
    or fundamentals.get("pe_ratio")
    or fundamentals.get("pe"),
    0,
)
eps = _to_float(
    fundamentals.get("trailingEps")
    or fundamentals.get("eps")
    or fundamentals.get("epsTTM"),
    0,
)
book_value = _to_float(
    fundamentals.get("bookValue") or fundamentals.get("book_value"), 0
)
dividend_yield = _to_float(
    fundamentals.get("dividendYield")
    or fundamentals.get("dividend_yield")
    or fundamentals.get("dividendYieldPercent"),
    0,
)
beta = _to_float(fundamentals.get("beta"), 1)

# -----------------------------------
# Feature Vector
# -----------------------------------

features = np.array([
    market_cap,
    pe_ratio,
    eps,
    book_value,
    dividend_yield,
    beta,
]).reshape(1, -1)

# -----------------------------------
# Dummy training data
# (In production, replace with a real, persisted model)
# -----------------------------------

X_train = np.random.rand(200, 6)
Y_train = np.random.uniform(1, 10, 200)

# -----------------------------------
# Train Model
# -----------------------------------

model = RandomForestRegressor(n_estimators=300, random_state=42)
model.fit(X_train, Y_train)

# -----------------------------------
# Predict Valuation Score
# -----------------------------------

score = float(model.predict(features)[0])
score = max(1.0, min(10.0, score))
score = round(score, 2)

# Provide aliases expected by FinalRecommendation
valuation_score = score

print("Valuation Metrics Score (1-10):", score)
import os
import json
import numpy as np
from sklearn.ensemble import RandomForestRegressor

# -----------------------------------
# Load price & market data provided by backend
# -----------------------------------

price_path = os.getenv("PRICE_MARKET_PATH")
if not price_path or not os.path.exists(price_path):
    raise FileNotFoundError("PRICE_MARKET_PATH is required for PriceAndMarketDataAnalyzer")

with open(price_path, "r", encoding="utf-8") as f:
    price = json.load(f) or {}

fund_path = os.getenv("FUNDAMENTALS_PATH")
fundamentals = {}
if fund_path and os.path.exists(fund_path):
    try:
        with open(fund_path, "r", encoding="utf-8") as f:
            fundamentals = json.load(f) or {}
    except Exception:
        fundamentals = {}

# -----------------------------------
# Extract Price Data
# -----------------------------------

open_price = price.get("open")
close_price = price.get("close") or price.get("previousClose")
high_price = price.get("dayHigh") or price.get("high")
low_price = price.get("dayLow") or price.get("low")

# -----------------------------------
# Extract Market Metrics
# -----------------------------------

market_cap = fundamentals.get("marketCap", 0)
pe_ratio = fundamentals.get("trailingPE", 0)
pb_ratio = fundamentals.get("priceToBook", fundamentals.get("bookValue", 0))
dividend_yield = fundamentals.get("dividendYield", 0)
beta = fundamentals.get("beta", 1)

# Fallback to zeros if any essential price numbers are missing
open_price = open_price if isinstance(open_price, (int, float)) else 0.0
close_price = close_price if isinstance(close_price, (int, float)) else 0.0
high_price = high_price if isinstance(high_price, (int, float)) else close_price
low_price = low_price if isinstance(low_price, (int, float)) else close_price

# -----------------------------------
# Create Feature Vector
# -----------------------------------

features = np.array([
    open_price,
    close_price,
    high_price,
    low_price,
    market_cap,
    pe_ratio,
    pb_ratio,
    dividend_yield,
    beta,
]).reshape(1, -1)

# -----------------------------------
# Dummy Training Data
# (In real system you train on many stocks)
# -----------------------------------

X_train = np.random.rand(100,9)

y_train = np.random.uniform(1,10,100)

# -----------------------------------
# Train Model
# -----------------------------------

model = RandomForestRegressor(n_estimators=200)

model.fit(X_train,y_train)

# -----------------------------------
# Predict Market Score
# -----------------------------------

score = model.predict(features)[0]

score = max(1, min(10, score))

print("Price & Market Data Score (1-10):", round(score,2))
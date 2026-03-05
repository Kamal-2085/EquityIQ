import json
import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

trend_score = 5.0
up_prob = 0.5
graph_score = trend_score
score = trend_score

def _fallback_from_close(close_series):
    if close_series is None or len(close_series) < 2:
        return 0.5
    first = float(close_series.iloc[0])
    last = float(close_series.iloc[-1])
    denom = abs(first) if abs(first) > 1e-9 else 1.0
    change = (last - first) / denom
    # squashed to [0,1]
    return float(0.5 + np.tanh(change * 3.0) / 2.0)

try:
    # -----------------------------
    # Load stock data from backend-provided history
    # -----------------------------
    historical_path = os.getenv("HISTORICAL_PATH")
    if not historical_path or not os.path.exists(historical_path):
        raise FileNotFoundError("HISTORICAL_PATH is required for GraphAnalyzer")

    with open(historical_path, "r", encoding="utf-8") as file:
        raw = json.load(file)

    data = pd.DataFrame(raw)
    if "time" in data.columns:
        data = data.sort_values("time")

    if "Close" not in data.columns:
        if "close" in data.columns:
            data["Close"] = data["close"]
        elif "value" in data.columns:
            data["Close"] = data["value"]
        else:
            raise ValueError("Historical data must include close prices")

    if "Volume" not in data.columns:
        if "volume" in data.columns:
            data["Volume"] = data["volume"]
        else:
            data["Volume"] = 0

    data = data[["Close", "Volume"]].copy()
    data = data.dropna(subset=["Close"])

    if len(data) < 30:
        raise ValueError("Not enough historical data for indicators")

    # -----------------------------
    # Feature Engineering
    # -----------------------------

    # Moving averages
    data['MA5'] = data['Close'].rolling(5).mean()
    data['MA20'] = data['Close'].rolling(20).mean()

    # Daily return
    data['Return'] = data['Close'].pct_change()

    # Momentum
    data['Momentum'] = data['Close'] - data['Close'].shift(5)

    # Volatility
    data['Volatility'] = data['Return'].rolling(10).std()

    # -----------------------------
    # RSI
    # -----------------------------
    delta = data['Close'].diff()

    gain = delta.clip(lower=0).rolling(14).mean()
    loss = -delta.clip(upper=0).rolling(14).mean()

    rs = gain / loss
    data['RSI'] = 100 - (100 / (1 + rs))

    # -----------------------------
    # MACD
    # -----------------------------
    ema12 = data['Close'].ewm(span=12, adjust=False).mean()
    ema26 = data['Close'].ewm(span=26, adjust=False).mean()

    data['MACD'] = ema12 - ema26
    data['MACD_signal'] = data['MACD'].ewm(span=9, adjust=False).mean()

    # -----------------------------
    # Target variable
    # -----------------------------
    data['Target'] = (data['Close'].shift(-1) > data['Close']).astype(int)

    data = data.dropna()

    # -----------------------------
    # Features and labels
    # -----------------------------
    X = data[['MA5','MA20','Return','Momentum','Volatility','RSI','MACD','MACD_signal']]
    y = data['Target']

    if len(X) < 10:
        raise ValueError("Not enough feature rows for model training")

    # -----------------------------
    # Train/Test Split
    # -----------------------------
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, shuffle=False
    )

    # -----------------------------
    # Train Model
    # -----------------------------
    model = RandomForestClassifier(n_estimators=200)
    model.fit(X_train, y_train)

    # -----------------------------
    # Evaluate Model
    # -----------------------------
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)

    print("Model Accuracy:", round(accuracy * 100, 2), "%")

    # -----------------------------
    # Predict latest trend
    # -----------------------------
    latest_data = X.iloc[-1:]

    prediction = model.predict(latest_data)
    # get probability array robustly
    proba = model.predict_proba(latest_data)[0]
    up_prob = None
    try:
        classes = list(model.classes_)
        # prefer numeric label 1, then string '1'
        if 1 in classes:
            up_prob = float(proba[classes.index(1)])
        elif '1' in classes:
            up_prob = float(proba[classes.index('1')])
        elif len(classes) == 1:
            # single-class training: if the lone class indicates 'up' then prob=1 else 0
            up_prob = 1.0 if classes[0] in (1, '1', True) else 0.0
        else:
            # fallback: take last column as 'up' probability
            up_prob = float(proba[-1])
    except Exception:
        try:
            up_prob = float(proba[-1])
        except Exception:
            up_prob = 0.5

    # convert probability → 1–10 scale
    trend_score = round(up_prob * 9 + 1, 2)
except Exception as e:
    try:
        if 'data' in locals() and 'Close' in data.columns:
            up_prob = _fallback_from_close(data['Close'].dropna())
        else:
            up_prob = 0.5
        trend_score = round(up_prob * 9 + 1, 2)
    except Exception:
        up_prob = 0.5
        trend_score = 5.0
    print("Graph Analyzer Warning:", str(e))

graph_score = float(trend_score)
score = float(trend_score)

# -----------------------------
# Output
# -----------------------------
print("Probability of Upward Trend:", round(up_prob, 2))
print("Graph Analyzer Score (1-10):", round(trend_score, 2))
# EquityAI

Python analyzers used by EquityIQ to score a company from backend-provided JSON inputs.

Included files

- CompanyProfileAnalyzer.py
- GraphAnalyzer.py
- PriceAndMarketDataAnalyzer.py
- ValuationMetricsAnalyzer.py
- NewsAnalyzer.py
- FinalRecommendation.py

Dependencies

- Python 3.9+
- numpy, pandas, scikit-learn, nltk

Quick start

1. Create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
pip install numpy pandas scikit-learn nltk
```

Run a single analyzer

```powershell
$env:HISTORICAL_PATH="C:\path\to\historical.json"
python GraphAnalyzer.py
```

Run the full pipeline

```powershell
$env:HISTORICAL_PATH="C:\path\to\historical.json"
$env:COMPANY_PROFILE_PATH="C:\path\to\company_profile.json"
$env:PRICE_MARKET_PATH="C:\path\to\price_market.json"
$env:FUNDAMENTALS_PATH="C:\path\to\fundamentals.json"
$env:NEWS_PATH="C:\path\to\news.json"
$env:EQUITYIQ_OUTPUT="json"
python FinalRecommendation.py
```

Inputs

- HISTORICAL_PATH: array of objects with close and volume fields (time optional)
- COMPANY_PROFILE_PATH: company profile object
- PRICE_MARKET_PATH: current price and market metrics
- FUNDAMENTALS_PATH: valuation metrics
- NEWS_PATH: list of news items (title/summary/content)

License: See the `LICENSE` file.

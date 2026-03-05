import os
import json
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

nltk.download("vader_lexicon", quiet=True)

# -------------------------------------
# Sector Scores
# -------------------------------------

sector_scores = {

"Technology": 9.5,
"Healthcare": 9.0,
"Financial Services": 9.2,
"Industrials": 8.6,
"Communication Services": 8.8,
"Consumer Cyclical": 8.5,
"Consumer Defensive": 8.9,
"Energy": 7.9,
"Basic Materials": 8.0,
"Utilities": 8.2

}

# -------------------------------------
# Industry Scores
# -------------------------------------

industry_scores = {

"Information Technology Services": 9.3,
"Building Materials": 8.1,
"Agricultural Inputs": 7.6,
"Luxury Goods": 8.4,
"Steel": 7.7,
"Auto Manufacturers": 8.8,
"Packaged Foods": 8.5,
"Drug Manufacturers - Specialty & Generic": 8.9,
"Banks - Regional": 9.1,
"Credit Services": 9.0,
"Insurance - Life": 8.7,
"Oil & Gas Refining & Marketing": 7.7,
"Utilities - Regulated Electric": 8.2,
"Oil & Gas Integrated": 7.9,
"Engineering & Construction": 8.5,
"Tobacco": 8.0,
"Household & Personal Products": 8.9,
"Asset Management": 9.0,
"Thermal Coal": 7.2,
"Telecom Services": 8.5,
"Financial Conglomerates": 8.8,
"Specialty Chemicals": 9.0,
"Medical Care Facilities": 8.4,
"Marine Shipping": 7.8

}

# -------------------------------------
# Load Company Info (from backend-provided JSON)
# -------------------------------------

company_profile_path = os.getenv("COMPANY_PROFILE_PATH")
info = {}
if company_profile_path and os.path.exists(company_profile_path):
    try:
        with open(company_profile_path, "r", encoding="utf-8") as f:
            info = json.load(f) or {}
    except Exception:
        info = {}
else:
    # require profile to be provided by backend
    raise FileNotFoundError("COMPANY_PROFILE_PATH is required for CompanyProfileAnalyzer")

# normalize fields
industry = info.get("industry") or info.get("industryName") or "Unknown"
sector = info.get("sector") or info.get("sectorName") or "Unknown"
employees = info.get("fullTimeEmployees") or info.get("employees") or 0
description = (
    info.get("longBusinessSummary")
    or info.get("description")
    or info.get("about")
    or ""
)

print("Industry:", industry)
print("Sector:", sector)
print("Employees:", employees)

# -------------------------------------
# Industry / Sector Score
# -------------------------------------

if industry in industry_scores:
    base_score = industry_scores[industry]

elif sector in sector_scores:
    base_score = sector_scores[sector]

else:
    base_score = 6.5

# -------------------------------------
# Company Size Score
# -------------------------------------

if employees == 0:
    employee_score = 6
elif employees > 200000:
    employee_score = 9
elif employees > 100000:
    employee_score = 8
elif employees > 50000:
    employee_score = 7
elif employees > 10000:
    employee_score = 6
elif employees > 1000:
    employee_score = 5
else:
    employee_score = 4

# -------------------------------------
# Description Sentiment Score
# -------------------------------------

sia = SentimentIntensityAnalyzer()

if description.strip() == "":
    text_score = 5
else:
    sentiment = sia.polarity_scores(description)
    text_score = (sentiment["compound"] + 1) * 5

# -------------------------------------
# Final Score
# -------------------------------------

final_score = (
    0.4 * base_score +
    0.3 * employee_score +
    0.3 * text_score
)

final_score = round(final_score,2)

# -------------------------------------
# Output
# -------------------------------------

print("Company Profile Score (1-10):", final_score)
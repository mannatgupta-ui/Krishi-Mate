import os
import requests
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("DATA_GOV_IN_API_KEY")
# Default resource ID for Agmarknet Daily Market Prices
# Note: This ID should be verified from data.gov.in
RESOURCE_ID = os.getenv("MARKET_RESOURCE_ID", "9ef2718d-35fe-45c0-a00d-8470018c01c8")
BASE_URL = "https://api.data.gov.in/resource/"

def fetch_market_rates(commodity: Optional[str] = None, state: Optional[str] = None, district: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Fetch market rates from data.gov.in API.
    """
    if not API_KEY:
        print("⚠️ WARNING: DATA_GOV_IN_API_KEY not found. Market rates will be unavailable.")
        return []

    params = {
        "api-key": API_KEY,
        "format": "json",
        "offset": 0,
        "limit": 50
    }

    # Data.gov.in filters use format: filters[field]=value
    filters = {}
    if commodity:
        filters["commodity"] = commodity
    if state:
        filters["state"] = state
    if district:
        filters["district"] = district

    for key, value in filters.items():
        params[f"filters[{key}]"] = value

    url = f"{BASE_URL}{RESOURCE_ID}"
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        # Structure of data.gov.in response usually has a 'records' field
        records = data.get("records", [])
        return records
    except Exception as e:
        print(f"❌ Error fetching market rates: {e}")
        return []

if __name__ == "__main__":
    # Test call
    rates = fetch_market_rates(commodity="Potato")
    print(rates)

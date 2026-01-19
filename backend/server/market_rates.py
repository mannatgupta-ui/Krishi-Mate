import os
import requests
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# Explicitly load .env from the same directory as this file
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(env_path)

API_KEY = os.getenv("DATA_GOV_IN_API_KEY")

if API_KEY:
    print(f"✅ Market Rates: API Key loaded successfully (Length: {len(API_KEY)})")
else:
    print(f"❌ Market Rates: API Key NOT loaded from {env_path}")
# Default resource ID for Agmarknet Daily Market Prices
# Note: This ID should be verified from data.gov.in
RESOURCE_ID = os.getenv("MARKET_RESOURCE_ID", "9ef84268-d588-465a-a308-a864a43d0070")
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
    
    print(f"🔍 Market API Request: {url}")
    print(f"🔍 Parameters: {params}")

    try:
        response = requests.get(url, params=params)
        print(f"📡 Response Status: {response.status_code}")
        
        response.raise_for_status()
        data = response.json()
        
        # Structure of data.gov.in response usually has a 'records' field
        records = data.get("records", [])
        print(f"✅ Records Found: {len(records)}")
        
        if len(records) == 0:
             print(f"⚠️ Raw Response Content: {data}")

        return records
    except Exception as e:
        print(f"❌ Error fetching market rates: {e}")
        if 'response' in locals():
            print(f"❌ Failed Response Body: {response.text}")
        return []

if __name__ == "__main__":
    # Test call
    print("Testing fetch_market_rates...")
    rates = fetch_market_rates(commodity="Potato", state="Madhya Pradesh")
    print(f"Result: {rates}")

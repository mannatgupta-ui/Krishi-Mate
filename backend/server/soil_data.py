"""
Soil Health data mapping for major Indian states and districts.
Data aggregated and synthesized based on Soil Health Card (SHC) portal reports and 
India Soil Health Card scraping methodologies (Google Research).

Parameters:
- pH: Soil Reaction
- N: Nitrogen (kg/ha)
- P: Phosphorus (kg/ha)
- K: Potassium (kg/ha)
"""

SOIL_HEALTH_DATA = {
    "ANDHRA PRADESH": {
        "ANANTAPUR": {"ph": 8.1, "N": 150, "P": 25, "K": 350},
        "CHITTOOR": {"ph": 7.2, "N": 180, "P": 30, "K": 280},
        "EAST GODAVARI": {"ph": 6.8, "N": 220, "P": 45, "K": 240},
        "GUNTUR": {"ph": 7.9, "N": 200, "P": 60, "K": 400},
        "KADAPA": {"ph": 7.8, "N": 160, "P": 28, "K": 310},
        "KRISHNA": {"ph": 7.4, "N": 210, "P": 55, "K": 380},
        "KURNOOL": {"ph": 8.0, "N": 155, "P": 27, "K": 360},
        "NELLORE": {"ph": 7.3, "N": 190, "P": 40, "K": 270},
        "PRAKASAM": {"ph": 7.9, "N": 170, "P": 35, "K": 330},
        "SREERAMULU NELLORE": {"ph": 7.3, "N": 190, "P": 40, "K": 270},
        "SRIKAKULAM": {"ph": 6.4, "N": 230, "P": 42, "K": 220},
        "VISAKHAPATNAM": {"ph": 6.2, "N": 240, "P": 38, "K": 210},
        "VIZIANAGARAM": {"ph": 6.5, "N": 225, "P": 41, "K": 230},
        "WEST GODAVARI": {"ph": 6.9, "N": 220, "P": 50, "K": 250}
    },
    "BIHAR": {
        "ARARIA": {"ph": 6.2, "N": 210, "P": 35, "K": 240},
        "AURANGABAD": {"ph": 7.2, "N": 190, "P": 40, "K": 280},
        "BEGUSARAI": {"ph": 7.6, "N": 200, "P": 55, "K": 310},
        "BHAGALPUR": {"ph": 7.4, "N": 205, "P": 48, "K": 290},
        "BHOJPUR": {"ph": 7.5, "N": 215, "P": 50, "K": 300},
        "GAYA": {"ph": 7.1, "N": 185, "P": 42, "K": 270},
        "MUZAFFARPUR": {"ph": 7.8, "N": 195, "P": 52, "K": 320},
        "PATNA": {"ph": 7.7, "N": 200, "P": 58, "K": 330},
        "PURNEA": {"ph": 6.1, "N": 215, "P": 32, "K": 235},
        "SARAN": {"ph": 8.0, "N": 170, "P": 38, "K": 290}
    },
    "GUJARAT": {
        "AHMEDABAD": {"ph": 8.1, "N": 160, "P": 35, "K": 380},
        "AMRELI": {"ph": 7.9, "N": 150, "P": 32, "K": 350},
        "BANASKANTHA": {"ph": 8.2, "N": 140, "P": 28, "K": 400},
        "BHAVNAGAR": {"ph": 8.0, "N": 155, "P": 34, "K": 360},
        "JAMNAGAR": {"ph": 8.1, "N": 145, "P": 30, "K": 370},
        "JUNAGADH": {"ph": 8.0, "N": 165, "P": 36, "K": 350},
        "KACHCHH": {"ph": 8.3, "N": 130, "P": 25, "K": 420},
        "RAJKOT": {"ph": 8.0, "N": 150, "P": 33, "K": 360},
        "SURAT": {"ph": 7.6, "N": 180, "P": 45, "K": 300},
        "VADODARA": {"ph": 7.8, "N": 175, "P": 40, "K": 320}
    },
    "HARYANA": {
        "AMBALA": {"ph": 7.5, "N": 210, "P": 45, "K": 280},
        "BHIWANI": {"ph": 8.3, "N": 150, "P": 30, "K": 350},
        "HISAR": {"ph": 8.5, "N": 140, "P": 28, "K": 380},
        "KARNAL": {"ph": 8.0, "N": 230, "P": 65, "K": 320},
        "KURUKSHETRA": {"ph": 7.9, "N": 220, "P": 60, "K": 310},
        "ROHTAK": {"ph": 8.2, "N": 180, "P": 40, "K": 340},
        "SIRSA": {"ph": 8.6, "N": 135, "P": 25, "K": 400}
    },
    "KARNATAKA": {
        "BAGALKOT": {"ph": 8.2, "N": 150, "P": 28, "K": 380},
        "BELGAUM": {"ph": 7.5, "N": 190, "P": 45, "K": 310},
        "BELLARY": {"ph": 8.3, "N": 140, "P": 25, "K": 400},
        "BIJAPUR": {"ph": 8.4, "N": 135, "P": 22, "K": 420},
        "CHIKMAGALUR": {"ph": 5.8, "N": 250, "P": 50, "K": 200},
        "DAKSHINA KANNADA": {"ph": 5.4, "N": 260, "P": 42, "K": 180},
        "DHARWAD": {"ph": 7.7, "N": 180, "P": 35, "K": 330},
        "GULBARGA": {"ph": 8.1, "N": 145, "P": 26, "K": 390},
        "MYSORE": {"ph": 6.9, "N": 220, "P": 48, "K": 250},
        "RAICHUR": {"ph": 8.5, "N": 130, "P": 20, "K": 430}
    },
    "MAHARASHTRA": {
        "AHMEDNAGAR": {"ph": 8.2, "N": 145, "P": 22, "K": 400},
        "AKOLA": {"ph": 8.1, "N": 155, "P": 25, "K": 380},
        "AMRAVATI": {"ph": 8.0, "N": 160, "P": 28, "K": 370},
        "AURANGABAD": {"ph": 8.1, "N": 150, "P": 24, "K": 390},
        "BEED": {"ph": 8.2, "N": 140, "P": 20, "K": 410},
        "JALGAON": {"ph": 8.0, "N": 165, "P": 30, "K": 360},
        "KOLHAPUR": {"ph": 7.4, "N": 210, "P": 50, "K": 280},
        "LATUR": {"ph": 8.1, "N": 150, "P": 22, "K": 400},
        "NAGPUR": {"ph": 7.5, "N": 180, "P": 45, "K": 320},
        "NASHIK": {"ph": 7.9, "N": 170, "P": 38, "K": 340},
        "PUNE": {"ph": 7.8, "N": 190, "P": 42, "K": 310},
        "RATNAGIRI": {"ph": 5.8, "N": 240, "P": 35, "K": 200},
        "SOLAPUR": {"ph": 8.3, "N": 135, "P": 18, "K": 420},
        "WARDHA": {"ph": 7.9, "N": 175, "P": 35, "K": 350}
    },
    "PUNJAB": {
        "AMRITSAR": {"ph": 8.2, "N": 230, "P": 68, "K": 310},
        "BATHINDA": {"ph": 8.5, "N": 160, "P": 35, "K": 380},
        "FEROZEPUR": {"ph": 8.4, "N": 170, "P": 40, "K": 360},
        "HOSHIARPUR": {"ph": 7.6, "N": 240, "P": 55, "K": 280},
        "JALANDHAR": {"ph": 8.1, "N": 250, "P": 75, "K": 300},
        "LUDHIANA": {"ph": 8.1, "N": 260, "P": 80, "K": 290},
        "PATIALA": {"ph": 8.2, "N": 245, "P": 72, "K": 305}
    },
    "RAJASTHAN": {
        "AJMER": {"ph": 8.2, "N": 130, "P": 22, "K": 380},
        "ALWAR": {"ph": 8.1, "N": 145, "P": 26, "K": 360},
        "BARMER": {"ph": 8.5, "N": 100, "P": 12, "K": 420},
        "BIKANER": {"ph": 8.6, "N": 105, "P": 14, "K": 430},
        "GANGANAGAR": {"ph": 8.5, "N": 150, "P": 30, "K": 390},
        "JAIPUR": {"ph": 8.2, "N": 135, "P": 24, "K": 370},
        "JAISALMER": {"ph": 8.7, "N": 90, "P": 10, "K": 450},
        "JODHPUR": {"ph": 8.5, "N": 110, "P": 16, "K": 410},
        "KOTA": {"ph": 7.9, "N": 160, "P": 35, "K": 350},
        "UDAIPUR": {"ph": 7.8, "N": 155, "P": 32, "K": 340}
    },
    "TAMIL NADU": {
        "COIMBATORE": {"ph": 8.1, "N": 180, "P": 40, "K": 360},
        "CUDDALORE": {"ph": 7.4, "N": 210, "P": 45, "K": 290},
        "ERODE": {"ph": 8.2, "N": 175, "P": 38, "K": 370},
        "MADURAI": {"ph": 7.8, "N": 195, "P": 42, "K": 330},
        "NILGIRIS": {"ph": 4.8, "N": 280, "P": 60, "K": 180},
        "THANJAVUR": {"ph": 7.3, "N": 230, "P": 55, "K": 250},
        "TIRUCHIRAPPALLI": {"ph": 7.9, "N": 200, "P": 48, "K": 320},
        "VIRUDHUNAGAR": {"ph": 8.1, "N": 165, "P": 32, "K": 380}
    },
    "UTTAR PRADESH": {
        "AGRA": {"ph": 8.2, "N": 160, "P": 30, "K": 380},
        "ALIGARH": {"ph": 8.3, "N": 155, "P": 28, "K": 390},
        "ALLAHABAD": {"ph": 7.8, "N": 200, "P": 45, "K": 330},
        "AZAMGARH": {"ph": 7.8, "N": 210, "P": 48, "K": 320},
        "BAREILLY": {"ph": 7.6, "N": 220, "P": 50, "K": 300},
        "GORAKHPUR": {"ph": 7.9, "N": 215, "P": 52, "K": 310},
        "KANPUR NAGAR": {"ph": 8.1, "N": 185, "P": 42, "K": 350},
        "LUCKNOW": {"ph": 8.0, "N": 195, "P": 45, "K": 340},
        "MEERUT": {"ph": 8.1, "N": 240, "P": 70, "K": 300},
        "VARANASI": {"ph": 7.8, "N": 210, "P": 55, "K": 310}
    },
    "WEST BENGAL": {
        "BANKURA": {"ph": 6.2, "N": 210, "P": 38, "K": 240},
        "BIRBHUM": {"ph": 6.1, "N": 220, "P": 42, "K": 230},
        "COOCH BEHAR": {"ph": 5.5, "N": 240, "P": 35, "K": 190},
        "DARJEELING": {"ph": 4.8, "N": 270, "P": 50, "K": 160},
        "HOOGHLY": {"ph": 6.8, "N": 235, "P": 60, "K": 260},
        "MALDA": {"ph": 6.5, "N": 225, "P": 45, "K": 245},
        "MEDINIPUR WEST": {"ph": 5.8, "N": 230, "P": 36, "K": 210},
        "MURSHIDABAD": {"ph": 7.4, "N": 215, "P": 55, "K": 290}
    },
    "TELANGANA": {
        "ADILABAD": {"ph": 7.8, "N": 170, "P": 32, "K": 340},
        "HYDERABAD": {"ph": 7.5, "N": 160, "P": 28, "K": 320},
        "KARIMNAGAR": {"ph": 7.9, "N": 185, "P": 38, "K": 350},
        "KHAMMAM": {"ph": 7.4, "N": 190, "P": 42, "K": 310},
        "MAHABUBNAGAR": {"ph": 8.0, "N": 150, "P": 25, "K": 380},
        "NALGONDA": {"ph": 8.1, "N": 155, "P": 27, "K": 390},
        "WARANGAL": {"ph": 7.9, "N": 175, "P": 35, "K": 360}
    }
}

def get_district_soil_health(state: str, district: str) -> dict:
    """
    Returns soil parameters (ph, N, P, K) for a given state and district.
    Falls back to state average or national defaults if data is missing.
    """
    state_upper = state.strip().upper()
    district_upper = district.strip().upper()

    default_data = {"ph": 7.0, "N": 180, "P": 40, "K": 300}

    # Step 1: Check for exact state and district match
    if state_upper in SOIL_HEALTH_DATA:
        state_info = SOIL_HEALTH_DATA[state_upper]
        if district_upper in state_info:
            return state_info[district_upper]
        
        # Step 2: Fallback to state average if district not found
        avg_data = {
            "ph": round(sum(d["ph"] for d in state_info.values()) / len(state_info), 1),
            "N": int(sum(d["N"] for d in state_info.values()) / len(state_info)),
            "P": int(sum(d["P"] for d in state_info.values()) / len(state_info)),
            "K": int(sum(d["K"] for d in state_info.values()) / len(state_info))
        }
        return avg_data
    
    # Step 3: Global fallback
    return default_data

# For backward compatibility
def get_district_soil_ph(state, district):
    return get_district_soil_health(state, district)["ph"]

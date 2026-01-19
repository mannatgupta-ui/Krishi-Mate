from typing import Optional, Dict, List, Any
import pandas as pd
from crop_recommendation import predict_crop_recommendation

def get_crop_recommendations(district: str, state: Optional[str] = None) -> Dict[str, List[Dict[str, Any]]]:
    """
    Uses the trained ML model to recommend the most suitable crops.
    """
    try:
        res = predict_crop_recommendation(state or "", district)
        if "error" in res:
            return {"favorable": [], "unfavorable": []}

        favorable_crops = []
        for rec in res["top_recommendations"]:
            favorable_crops.append({
                "name": f"{rec['symbol']} {rec['crop']}",
                "reason": f"High suitability ({rec['confidence']}%) based on current conditions",
                "favorability": "Excellent" if rec['confidence'] > 60 else "Good"
            })

        # Hardcoded unfavorable for now
        unfavorable_crops = [
            {"name": "❄️ Saffron", "reason": "Requires cold, dry climate not present here", "favorability": "Challenging"}
        ]

        return {"favorable": favorable_crops, "unfavorable": unfavorable_crops}

    except Exception as e:
        print(f"Error in ML crop recommendations: {e}")
        return {"favorable": [], "unfavorable": []}

import logging
import json
import random
from typing import Dict, Any, List
from chatbot2 import query_openrouter

logger = logging.getLogger(__name__)

def get_general_insights(location: str, count: int = 5) -> List[Dict[str, Any]]:
    """
    Generates structured farming insights using the LLM.
    """
    try:
        system_prompt = f"""You are an expert agricultural consultant.
        Your task is to generate {count} detailed, actionable farming insights for a farmer in {location}.
        
        CRITICAL: Return the result as a VALID JSON ARRAY of objects. 
        Do not include markdown formatting (like ```json). Just the raw JSON array.
        
        Each object must have exactly these fields:
        - "type": one of "tip", "success", or "warning"
        - "title": A short, catchy headline (max 5 words).
        - "description": A SUPER DETAILED explanation (2-3 sentences). Explain the 'why' and 'how'.
        - "priority": one of "high", "medium", or "low".
        
        Make the insights diverse (soil health, water management, pest control, market trends).
        """
        
        user_prompt = f"Generate {count} unique farming insights for {location} now."
        
        messages = [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}]
        response = query_openrouter(messages)
        content = response["choices"][0]["message"]["content"]
        
        # Parse JSON
        cleaned_content = content.strip()
        if cleaned_content.startswith("```json"):
            cleaned_content = cleaned_content[7:]
        if cleaned_content.endswith("```"):
            cleaned_content = cleaned_content[:-3]
            
        insights = json.loads(cleaned_content.strip())
        
        # Ensure we have the correct number of items (sometimes LLM might generate fewer/more)
        return insights[:count]

    except Exception as e:
        logger.error(f"Error generating general insights: {e}")
        # Fallback dummy data if AI fails
        return [
            {
                "type": "tip",
                "title": "Soil Moisture Conservation",
                "description": "Consider using organic mulch to retain soil moisture mainly during the dry spells. This helps in reducing water dependency and improving yield stability.",
                "priority": "medium"
            },
            {
                "type": "warning",
                "title": "Pest Surveillance",
                "description": "Regularly monitor your fields for early signs of aphids or stem borers. Early detection can prevent significant crop damage and reduce chemical usage.",
                "priority": "high"
            }
        ]

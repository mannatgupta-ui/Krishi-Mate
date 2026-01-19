# chatbot2.py
import os
from dotenv import load_dotenv
import requests
import time
from vector_db import query_db

# Load environment variables from .env file
load_dotenv()

API_URL = "https://openrouter.ai/api/v1/chat/completions"
# Securely get the API key from the environment
API_KEY = os.getenv("OPENROUTER_API_KEY")

# Check if the key was loaded
if not API_KEY:
    print("WARNING: OpenRouter API key not found. Chatbot functionality will be disabled.")

# Note: In a production server, memory should be managed per-user (e.g., in a database or cache).
# A simple global list like this is not suitable for concurrent users.
memory = []

def query_openrouter(messages, model="deepseek/deepseek-chat-v3-0324:free"):
    """Sends a request to the OpenRouter API and returns the response."""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": messages,
        "max_tokens": 500,
        "temperature": 0.7,
    }
    
    retries = 3
    for i in range(retries):
        try:
            response = requests.post(API_URL, headers=headers, json=payload)
            response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
            return response.json()
        except requests.exceptions.RequestException as e:
            if response.status_code == 429:
                wait_time = 2 ** i  
                print(f"Rate limit hit. Waiting {wait_time} sec before retry...")
                time.sleep(wait_time)
                continue
            else:
                print(f"An error occurred: {e}")
                if hasattr(e, 'response') and e.response is not None:
                    print(f"Status Code: {e.response.status_code}")
                    print(f"Response Text: {e.response.text}")
                raise
    raise Exception("❌ Failed after multiple retries.")

def get_bot_response(user_query: str, location: str, state: str = "") -> str:
    """
    Gets a response from the farming assistant RAG pipeline.
    """
    global memory

    # 1. Fetch Farmer Context automatically
    from soil_data import get_district_soil_health
    from crop_recommendation import get_district_rainfall, predict_crop_recommendation
    from weather import fetch_weather

    try:
        soil_stats = get_district_soil_health(state, location)
        rainfall = get_district_rainfall(state, location)
        _, weather = fetch_weather(location)
        recommendations = predict_crop_recommendation(state, location)
        
        farmer_context = f"""
        Farmer Context:
        - Location: {location}, {state}
        - Soil Health: pH {soil_stats['ph']}, Nitrogen {soil_stats['N']}, Phosphorus {soil_stats['P']}, Potassium {soil_stats['K']}
        - Annual Rainfall: {rainfall} mm
        - Current Weather: {weather['temperature']}°C, {weather['humidity']}% humidity
        - Top Recommended Crops: {', '.join([r['crop'] for r in recommendations.get('top_recommendations', [])])}
        """
    except Exception as e:
        print(f"Error fetching contextual data: {e}")
        farmer_context = f"Location: {location}, {state}"

    # 2. Retrieve context from the vector database
    docs, metadata = query_db(user_query, location=location, n_results=2)
    kb_context = "\n".join(docs)
    
    # 3. Construct the prompts
    system_prompt = f"""You are a helpful farming assistant named Krishi-Mate AI.
    Provide accurate, practical advice based on the knowledge base and the specific farmer context provided.
    
    {farmer_context}
    
    Always respond in the SAME language as the user's question. Be concise but thorough."""

    user_prompt = f"""Question: {user_query}

    Knowledge Base:
    {kb_context}

    Please provide a detailed, helpful answer:"""

    # 4. Build the message history
    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(memory) 
    messages.append({"role": "user", "content": user_prompt})

    # 4. Query the LLM
    try:
        response = query_openrouter(messages)
        assistant_reply = response["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Error querying LLM: {e}")
        assistant_reply = "I'm sorry, I encountered an error trying to generate a response. Please try again."

    # 5. Update and manage memory
    memory.append({"role": "user", "content": user_prompt}) # Storing the full prompt for better context
    memory.append({"role": "assistant", "content": assistant_reply})
    if len(memory) > 10:  # Keep memory to the last 5 conversation turns (10 messages)
        memory = memory[-10:]
        
    # 6. Return the final response
    return assistant_reply
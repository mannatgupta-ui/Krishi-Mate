# chatbot2.py (Upgraded with Model Fallback)
import os
from dotenv import load_dotenv
import requests
import time
from vector_db import query_db

load_dotenv()

API_URL = "https://openrouter.ai/api/v1/chat/completions"
API_KEY = os.getenv("OPENROUTER_API_KEY")

if not API_KEY:
    raise ValueError("OpenRouter API key not found. Make sure it's set in your .env file.")

# The global memory for the chatbot's conversation history
memory = []

def query_openrouter(messages):
    """
    Sends a request to the OpenRouter API with a fallback mechanism.
    It will try a list of models in order until one returns a valid response.
    """
    
    # --- THIS IS THE NEW FALLBACK LOGIC ---
    # We define a list of models to try, with Mistral as primary and Deepseek as fallback.
    models_to_try = [
        "deepseek/deepseek-chat",
        "mistralai/mistral-7b-instruct:free"
    ]
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    
    for model in models_to_try:
        print(f"Attempting to use model: {model}")
        payload = {
            "model": model,
            "messages": messages,
            "max_tokens": 1500,
            "temperature": 0.7,
        }
        
        try:
            response = requests.post(API_URL, headers=headers, json=payload)
            response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
            
            response_json = response.json()
            
            # Check if the response has valid, non-empty content
            if response_json and response_json.get("choices") and response_json["choices"][0].get("message", {}).get("content", "").strip():
                print(f"Success with model: {model}")
                return response_json # Return the first successful response
            else:
                print(f"Model '{model}' returned an empty response. Trying next model...")

        except requests.exceptions.RequestException as e:
            print(f"Error with model '{model}': {e}. Trying next model...")
            # If the status is 429 (Rate Limited), we can add a small delay
            if response.status_code == 429:
                time.sleep(1)
            continue # Go to the next model in the list
            
    # If the loop finishes without a successful response from any model
    raise Exception("All AI models failed to provide a valid response.")


def get_bot_response(user_query: str, location: str) -> str:
    """
    Gets a response from the farming assistant RAG pipeline.
    This function does not need to change, as it will use the upgraded query_openrouter.
    """
    global memory

    docs, metadata = query_db(user_query, location=location, n_results=2)
    context = "\n".join(docs)
    
    system_prompt = """You are a helpful farming assistant...""" # (Your prompt here)
    user_prompt = f"""Question: {user_query}\nLocation: {location}\nKnowledge Base:\n{context}\nPlease provide a detailed, helpful answer:"""

    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(memory) 
    messages.append({"role": "user", "content": user_prompt})

    try:
        # This now calls our new, resilient function
        response = query_openrouter(messages)
        assistant_reply = response["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Error querying LLM with fallback: {e}")
        assistant_reply = "I'm sorry, I'm currently unable to generate a response. Please try again shortly."

    memory.append({"role": "user", "content": user_prompt})
    memory.append({"role": "assistant", "content": assistant_reply})
    if len(memory) > 10:
        memory = memory[-10:]
        
    return assistant_reply
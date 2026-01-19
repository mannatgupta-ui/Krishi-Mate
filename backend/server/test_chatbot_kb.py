import sys
import os

# Add server directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from chatbot2 import get_bot_response

def test_kb():
    # Test specific info from the new KB
    questions = [
        "What are the symptoms and control for Rice Blast?",
        "Tell me about drip irrigation efficiency and benefits.",
        "What should I do for Sugarcane Red Rot?"
    ]
    
    location = "Ludhiana" # Sample location
    
    for q in questions:
        print(f"User: {q}")
        try:
            reply = get_bot_response(q, location)
            # Safe print for Windows terminal
            print(f"AI: {reply.encode('ascii', 'ignore').decode('ascii')}\n")
        except Exception as e:
            print(f"Error: {e}")
        print("-" * 50)

if __name__ == "__main__":
    test_kb()

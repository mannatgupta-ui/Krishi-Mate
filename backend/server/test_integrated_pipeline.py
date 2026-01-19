import sys
import os

# Add the server directory to the path so we can import modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from crop_recommendation import predict_crop_recommendation
    
    print("🚀 Starting Integration Test...")
    
    # Test case 1: Major city with data
    print("\n--- Test Case 1: Pune, Maharashtra ---")
    res1 = predict_crop_recommendation("Maharashtra", "Pune", 90, 42, 43)
    print(res1)
    
    # Test case 2: Fallback case (unknown district)
    print("\n--- Test Case 2: Unknown District (Fallback) ---")
    res2 = predict_crop_recommendation("Uttar Pradesh", "RandomCityXYZ", 100, 50, 50)
    print(res2)
    
    print("\n✅ Verification script completed.")
    
except Exception as e:
    print(f"\n❌ Integration Test Failed: {e}")
    import traceback
    traceback.print_exc()

import requests
import pandas as pd
import json

# Load test data for Engine 2
test_df = pd.read_csv('data/test_FD001.txt', sep=' ', header=None)
test_df.drop(test_df.columns[[26, 27]], axis=1, inplace=True)
test_df.columns = ['engine_id', 'cycle', 'op_setting_1', 'op_setting_2', 'op_setting_3'] + \
                  [f'sensor_{i}' for i in range(1, 22)]

# Get Engine 2 data
engine_2_data = test_df[test_df['engine_id'] == 2]
print(f"Engine 2 has {len(engine_2_data)} total cycles")

# Simulate what the dashboard does at the LAST cycle
# If there are 49 cycles (indices 0-48), at the last step:
# currentIndex would be 48 (the last index)
# After my fix: slice(max(0, 48+1-50), 48+1) = slice(0, 49) = all 49 cycles

currentIndex = len(engine_2_data) - 1  # This would be 48
print(f"At final cycle, currentIndex = {currentIndex}")

# This is what the dashboard sends after my fix
sequence = engine_2_data.iloc[max(0, currentIndex + 1 - 50):currentIndex + 1]
print(f"Sending {len(sequence)} cycles (indices {max(0, currentIndex + 1 - 50)} to {currentIndex})")

# Convert to list of dicts
sequence_data = sequence.to_dict(orient='records')

# Make API call
try:
    response = requests.post(
        'http://127.0.0.1:5000/api/predict',
        json={'data': sequence_data},
        headers={'Content-Type': 'application/json'}
    )
    
    result = response.json()
    print("\nAPI Response:")
    print(json.dumps(result, indent=2))
    print(f"\nPredicted RUL: {result.get('rul', 'N/A')}")
    print(f"Expected RUL: 118.4")
    
except Exception as e:
    print(f"Error: {e}")

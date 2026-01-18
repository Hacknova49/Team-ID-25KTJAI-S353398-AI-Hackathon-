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
print(f"Engine 2 has {len(engine_2_data)} cycles")

# Get the last 50 cycles (or all if less than 50)
last_cycles = engine_2_data.tail(50)
print(f"Sending {len(last_cycles)} cycles to API")

# Convert to list of dicts
sequence = last_cycles.to_dict(orient='records')

# Make API call
try:
    response = requests.post(
        'http://127.0.0.1:5000/api/predict',
        json={'data': sequence},
        headers={'Content-Type': 'application/json'}
    )
    
    result = response.json()
    print("\nAPI Response:")
    print(json.dumps(result, indent=2))
    print(f"\nPredicted RUL: {result.get('rul', 'N/A')}")
    
except Exception as e:
    print(f"Error: {e}")

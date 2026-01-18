import pandas as pd
import numpy as np
import joblib

# Load test data
test_df = pd.read_csv('data/test_FD001.txt', sep=' ', header=None)
test_df.drop(test_df.columns[[26, 27]], axis=1, inplace=True)
test_df.columns = ['engine_id', 'cycle', 'op_setting_1', 'op_setting_2', 'op_setting_3'] + \
                  [f'sensor_{i}' for i in range(1, 22)]

# Get Engine 2 data
engine_2 = test_df[test_df['engine_id'] == 2]

feature_cols = [
    "sensor_2", "sensor_3", "sensor_4", "sensor_7",
    "sensor_11", "sensor_12", "sensor_15",
    "sensor_17", "sensor_20", "sensor_21"
]

print("Engine 2 - First row sensor values (BEFORE scaling):")
print(engine_2[feature_cols].iloc[0])

# Load scaler
scaler = joblib.load('model/scaler.joblib')

# Scale the data
scaled_data = scaler.transform(engine_2[feature_cols])

print("\nEngine 2 - First row sensor values (AFTER scaling):")
print(scaled_data[0])

print("\nAre the original values already in 0-1 range?")
print(f"sensor_2 range: {engine_2['sensor_2'].min():.4f} to {engine_2['sensor_2'].max():.4f}")
print(f"sensor_7 range: {engine_2['sensor_7'].min():.4f} to {engine_2['sensor_7'].max():.4f}")

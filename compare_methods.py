import numpy as np
import pandas as pd
from tensorflow import keras
import joblib

# Load model and scaler
model = keras.models.load_model('model/rul_model.keras')
scaler = joblib.load('model/scaler.joblib')

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

SEQ_LEN = 50

print("=== METHOD 1: Notebook's approach (scale BEFORE creating sequence) ===")
# Scale the entire dataframe first
test_df_scaled = test_df.copy()
test_df_scaled[feature_cols] = scaler.transform(test_df[feature_cols])

# Get Engine 2 from scaled data
engine_2_scaled = test_df_scaled[test_df_scaled['engine_id'] == 2]

# Create sequence with padding
feats_scaled = engine_2_scaled[feature_cols].values
if len(feats_scaled) < SEQ_LEN:
    pad = np.zeros((SEQ_LEN - len(feats_scaled), len(feature_cols)))
    sequence_method1 = np.vstack([pad, feats_scaled])
else:
    sequence_method1 = feats_scaled[-SEQ_LEN:]

# Predict
model_input1 = sequence_method1.reshape(1, SEQ_LEN, len(feature_cols))
pred1 = model.predict(model_input1, verbose=0)[0][0]
print(f"Prediction: {pred1:.2f}")

print("\n=== METHOD 2: API's approach (scale AFTER extracting sequence) ===")
# Get raw Engine 2 data
feats_raw = engine_2[feature_cols].values

# Pad if needed
if len(feats_raw) < SEQ_LEN:
    pad = np.zeros((SEQ_LEN - len(feats_raw), len(feature_cols)))
    raw_sequence = np.vstack([pad, feats_raw])
else:
    raw_sequence = feats_raw[-SEQ_LEN:]

# Scale the sequence
scaled_sequence = scaler.transform(raw_sequence)

# Predict
model_input2 = scaled_sequence.reshape(1, SEQ_LEN, len(feature_cols))
pred2 = model.predict(model_input2, verbose=0)[0][0]
print(f"Prediction: {pred2:.2f}")

print(f"\nDifference: {abs(pred1 - pred2):.2f}")

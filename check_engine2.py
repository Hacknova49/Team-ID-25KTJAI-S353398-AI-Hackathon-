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

# Feature columns (same as notebook)
feature_cols = [
    "sensor_2", "sensor_3", "sensor_4", "sensor_7",
    "sensor_11", "sensor_12", "sensor_15",
    "sensor_17", "sensor_20", "sensor_21"
]

SEQ_LEN = 50

# Create test sequences
def create_test_sequences(df, feature_cols, seq_len):
    X = []
    for eid in sorted(df.engine_id.unique()):
        d = df[df.engine_id == eid]
        feats = d[feature_cols].values
        
        if len(feats) >= seq_len:
            X.append(feats[-seq_len:])
        else:
            pad = np.zeros((seq_len - len(feats), feats.shape[1]))
            X.append(np.vstack([pad, feats]))
    
    return np.array(X)

# Scale and predict
test_df[feature_cols] = scaler.transform(test_df[feature_cols])
X_test = create_test_sequences(test_df, feature_cols, SEQ_LEN)
y_pred = model.predict(X_test, verbose=0).flatten()

# Load true RUL values
y_true = np.loadtxt('data/RUL_FD001.txt')
y_true = np.minimum(y_true, 125)

# Print Engine 2 (index 1) prediction
print(f"Engine 2 Prediction: {y_pred[1]:.2f}")
print(f"Engine 2 True RUL: {y_true[1]:.2f}")
print(f"Engine 2 Error: {y_pred[1] - y_true[1]:.2f}")

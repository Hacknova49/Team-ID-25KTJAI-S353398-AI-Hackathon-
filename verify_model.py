import joblib
from tensorflow.keras.models import load_model
import numpy as np
import os
import pandas as pd

def verify():
    print("Verifying assets...")
    
    # 1. Load Assets
    model_path = r"d:\Predict\model\rul_model.keras"
    scaler_path = r"d:\Predict\model\scaler.joblib"
    
    if not os.path.exists(model_path):
        print("Model file missing!")
        return
    if not os.path.exists(scaler_path):
        print("Scaler file missing!")
        return
        
    try:
        model = load_model(model_path)
        print("Model loaded successfully.")
        
        scaler = joblib.load(scaler_path)
        print("Scaler loaded successfully.")
        
        # 2. Mock Data (50 cycles, 10 features)
        # We simulate raw data (random but in range)
        # Features: ["sensor_2", "sensor_3", "sensor_4", "sensor_7", "sensor_11", "sensor_12", "sensor_15", "sensor_17", "sensor_20", "sensor_21"]
        # Ranges approx: 642, 1590, 1400, 553, 47, 521, 8.4, 393, 38, 23
        
        raw_data = np.random.rand(50, 10) * 100 + 500 # Just dummy values
        
        # 3. Transform
        scaled_data = scaler.transform(raw_data)
        print(f"Scaled data shape: {scaled_data.shape}")
        
        # 4. Predict
        input_data = scaled_data.reshape(1, 50, 10)
        pred = model.predict(input_data, verbose=0)
        
        print(f"Prediction raw: {pred}")
        print("Verification SUCCESS!")
        
    except Exception as e:
        print(f"Verification FAILED: {e}")

if __name__ == "__main__":
    verify()

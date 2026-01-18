from flask import Flask, jsonify, request
from flask_cors import CORS
from tensorflow.keras.models import load_model
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Config
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "rul_model.keras")
SCALER_PATH = os.path.join(BASE_DIR, "model", "scaler.joblib")
DATA_PATH_ROOT = os.path.join(BASE_DIR, "test_FD001.txt")
DATA_PATH_SUB = os.path.join(BASE_DIR, "data", "test_FD001.txt")

SEQ_LEN = 50
MAX_RUL = 125

# Global Assets
model = None
scaler = None
test_df = None

def load_assets():
    global model, scaler, test_df
    
    # 1. Load Model
    if os.path.exists(MODEL_PATH):
        print(f"Loading model from {MODEL_PATH}...")
        model = load_model(MODEL_PATH, compile=False)
    else:
        print(f"ERROR: Model not found at {MODEL_PATH}")

    # 2. Load Scaler
    if os.path.exists(SCALER_PATH):
        print(f"Loading scaler from {SCALER_PATH}...")
        scaler = joblib.load(SCALER_PATH)
    else:
        print(f"ERROR: Scaler not found at {SCALER_PATH}")

    # 3. Load Data
    data_path = DATA_PATH_ROOT if os.path.exists(DATA_PATH_ROOT) else DATA_PATH_SUB
    if os.path.exists(data_path):
        print(f"Loading test data from {data_path}...")
        column_names = (
            ["engine_id", "cycle", "op_setting_1", "op_setting_2", "op_setting_3"]
            + [f"sensor_{i}" for i in range(1, 22)]
        )
        test_df = pd.read_csv(data_path, sep=r"\s+", header=None, names=column_names, engine="python")
        print(f"Test data loaded: {test_df.shape}")
    else:
        print("ERROR: Test data not found!")

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "status": "online",
        "message": "Predictive Maintenance API is running",
        "endpoints": ["/api/engines", "/api/engine/<id>", "/api/predict"]
    })

@app.route('/api/engines', methods=['GET'])
def get_engines():
    if test_df is None: return jsonify([]), 500
    engines = sorted(test_df['engine_id'].unique().tolist())
    return jsonify(engines)

@app.route('/api/engine/<int:engine_id>', methods=['GET'])
def get_engine_data(engine_id):
    if test_df is None: return jsonify({"error": "Data not loaded"}), 500
    
    engine_data = test_df[test_df['engine_id'] == engine_id]
    if engine_data.empty:
        return jsonify({"error": "Engine not found"}), 404
    
    # Return as list of records
    return jsonify(engine_data.to_dict(orient='records'))

@app.route('/api/predict', methods=['POST'])
def predict_rul():
    try:
        content = request.json
        # Expecting 'data' to be a list of dicts or list of lists
        # Let's assume input is list of records (dicts) matching the DataFrame structure
        # OR list of lists with specific feature columns.
        
        # To be safe and consistent with the notebook, let's extract the FEATURES from the input
        # Input: { "data": [ { "sensor_2": 641.82, ... }, ... ] }
        
        input_data = content.get('data')
        if not input_data:
            return jsonify({"error": "No data provided"}), 400
            
        df = pd.DataFrame(input_data)
        
        # Features needed for model
        feature_cols = [
            "sensor_2", "sensor_3", "sensor_4", "sensor_7",
            "sensor_11", "sensor_12", "sensor_15",
            "sensor_17", "sensor_20", "sensor_21"
        ]
        
        # CRITICAL: Scale BEFORE padding to match notebook logic
        # Extract features and scale them first
        feats = df[feature_cols].values
        scaled_feats = scaler.transform(feats)
        
        # Then apply padding if needed
        if len(scaled_feats) < SEQ_LEN:
             # Zero padding to match notebook's create_test_sequences
             num_missing = SEQ_LEN - len(scaled_feats)
             pad = np.zeros((num_missing, len(feature_cols)))
             model_input_sequence = np.vstack([pad, scaled_feats])
        else:
             # Take last 50
             model_input_sequence = scaled_feats[-SEQ_LEN:]
        
        # Reshape for LSTM (1, 50, 10)
        model_input = model_input_sequence.reshape(1, SEQ_LEN, len(feature_cols))
        
        # Predict
        pred_val = model.predict(model_input, verbose=0)[0][0]
        
        # Clip and Calculate Health
        rul = np.clip(pred_val, 0, MAX_RUL)
        health = (rul / MAX_RUL) * 100
        health = np.clip(health, 0, 100)
        
        status = "GREEN"
        if health <= 30: status = "RED"
        elif health <= 60: status = "YELLOW"
        
        return jsonify({
            "rul": float(rul),
            "health_score": float(health),
            "status": status
        })

    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    load_assets()
    print("Starting Flask Server on port 5000...")
    app.run(debug=True, port=5000)

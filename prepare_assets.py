import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import joblib
import os
import shutil

def prepare():
    # 1. Define Paths
    if os.path.exists("train_FD001.txt"):
        data_path = "train_FD001.txt"
    elif os.path.exists("data/train_FD001.txt"):
        data_path = "data/train_FD001.txt"
    else:
        print("Error: train_FD001.txt not found in root or data/")
        return

    save_dir = r"d:\Predict\model"
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)
        print(f"Created directory: {save_dir}")

    # 2. Load Data for Scaler Fitting
    print(f"Loading data from {data_path}...")
    column_names = (
        ["engine_id", "cycle", "op_setting_1", "op_setting_2", "op_setting_3"]
        + [f"sensor_{i}" for i in range(1, 22)]
    )
    train_df = pd.read_csv(data_path, sep=r"\s+", header=None, names=column_names, engine="python")
    train_df.dropna(inplace=True)

    feature_cols = [
        "sensor_2", "sensor_3", "sensor_4", "sensor_7",
        "sensor_11", "sensor_12", "sensor_15",
        "sensor_17", "sensor_20", "sensor_21"
    ]

    # 3. Fit and Save Scaler
    print("Fitting MinMaxScaler...")
    scaler = MinMaxScaler()
    scaler.fit(train_df[feature_cols])

    scaler_path = os.path.join(save_dir, "scaler.joblib")
    joblib.dump(scaler, scaler_path)
    print(f"Scaler saved to {scaler_path}")

    # 4. Save/Copy Model
    # Try to find the model from the notebook path first
    src_model_notebook = r"D:\24158128\fd001_final_model.keras"
    # Also check local dir just in case
    src_model_local = r"fd001_lstm_final.keras"
    
    final_src = None
    if os.path.exists(src_model_notebook):
        final_src = src_model_notebook
        print(f"Found model at {final_src}")
    elif os.path.exists(src_model_local):
        final_src = src_model_local
        print(f"Found model locally at {final_src}")
    
    if final_src:
        dst_model = os.path.join(save_dir, "rul_model.keras")
        shutil.copy(final_src, dst_model)
        print(f"Model copied to {dst_model}")
    else:
        print("Error: Could not find trained model file!")

if __name__ == "__main__":
    prepare()

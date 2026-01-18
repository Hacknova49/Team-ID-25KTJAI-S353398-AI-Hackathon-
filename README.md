<img width="1872" height="1059" alt="Screenshot 2026-01-18 115034" src="https://github.com/user-attachments/assets/e4f8993f-1b9e-4cc6-ba0b-fdf1c953b55d" />

# Aircraft Engine Predictive Maintenance System

A machine learning-based predictive maintenance system for aircraft engines using LSTM neural networks. This project predicts Remaining Useful Life (RUL) of turbofan engines based on sensor data from the NASA C-MAPSS dataset.

## 📊 Performance Summary

```text
===== GLOBAL PERFORMANCE =====
FD001 RMSE      : 14.656
FD001 MAE       : 10.587
Correlation (R) : 0.940
R² Score        : 0.866

===== ZONE-WISE RMSE =====
Late life (<=30) : 6.788
Mid life (30-80) : 19.200
Early life (>80) : 15.347

===== BIAS CHECK =====
Over-prediction % : 64.0
Under-prediction %: 36.0

===== SAMPLE ENGINE CHECK =====
Engine ID        : 5
Predicted RUL    : 92.6
True RUL         : 91.0
Absolute Error   : 1.6
```

## 🎯 Overview

This system uses deep learning to predict when aircraft engines will fail, enabling proactive maintenance scheduling. It features:

- **LSTM Neural Network** for time-series prediction
- **Interactive Dashboard** for real-time RUL monitoring
- **Flask REST API** for predictions
- **React + Vite Frontend** for visualization

## 📊 Dataset

**NASA Turbofan Engine Degradation Simulation (C-MAPSS)**
- Dataset: FD001 (100 engines)
- 21 sensor measurements per cycle
- 3 operational settings
- Training data: Run-to-failure trajectories
- Test data: Partial trajectories with true RUL values

## 🏗️ Architecture

```
├── Model Training (Jupyter Notebook)
│   └── LSTM with Masking Layer
│       ├── Input: 50 timesteps × 10 features
│       ├── LSTM Layers: 100 → 50 units
│       └── Output: RUL prediction (0-125 cycles)
│
├── Backend (Flask API)
│   ├── Model serving
│   ├── Data preprocessing
│   └── REST endpoints
│
└── Frontend (React + Vite)
    ├── Engine selection
    ├── Real-time simulation
    └── Interactive charts
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- pip and npm

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Predict
```

2. **Set up Python environment**
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
```

3. **Install frontend dependencies**
```bash
cd client
npm install
cd ..
```

### Running the Application

1. **Start the Flask API** (Terminal 1)
   ```bash
   python app.py
   ```
   *The backend will be available at `http://127.0.0.1:5000`*

2. **Start the Vite Dev Server** (Terminal 2)
   ```bash
   cd client
   npm run dev
   ```
   *The dashboard will be available at `http://localhost:5173`*

3. **Access the Dashboard**
   Open your browser and navigate to `http://localhost:5173`. You can now select different engine IDs and simulate real-time sensor data and RUL predictions.

## 📁 Project Structure

```
Predict/
├── data/                      # Dataset files
│   ├── train_FD001.txt       # Training data
│   ├── test_FD001.txt        # Test data
│   └── RUL_FD001.txt         # True RUL values
│
├── model/                     # Trained model artifacts
│   ├── rul_model.keras       # LSTM model
│   └── scaler.joblib         # MinMaxScaler
│
├── client/                    # React frontend
│   ├── src/
│   │   ├── App.jsx           # Main application
│   │   ├── components/       # React components
│   │   └── index.css         # Styles
│   └── package.json
│
├── test1.ipynb               # Model training notebook
├── app.py                    # Flask API server
├── prepare_assets.py         # Data preparation
└── verify_model.py           # Model verification
```

## 🔧 API Endpoints

### Get Available Engines
```http
GET /api/engines
```
Returns list of engine IDs (1-100)

### Get Engine Data
```http
GET /api/engine/{engine_id}
```
Returns complete sensor data for specified engine

### Predict RUL
```http
POST /api/predict
Content-Type: application/json

{
  "data": [
    {
      "sensor_2": 641.82,
      "sensor_3": 1589.70,
      ...
    }
  ]
}
```

**Response:**
```json
{
  "rul": 118.45,
  "health_score": 94.76,
  "status": "GREEN"
}
```

## 🧠 Model Details

### Features Used (10 sensors)
- sensor_2, sensor_3, sensor_4, sensor_7
- sensor_11, sensor_12, sensor_15
- sensor_17, sensor_20, sensor_21

### Model Architecture

The model is built using a Keras `Sequential` API with the following layers:

1.  **Masking Layer**: `Masking(mask_value=0.0, input_shape=(50, 10))`
    *   Ignores the padded zero-values in sequences shorter than 50 cycles, ensuring they don't affect the learning process.
2.  **Primary LSTM Layer**: `LSTM(100, return_sequences=True)`
    *   100 hidden units. Captures complex temporal patterns. `return_sequences=True` allows the next LSTM layer to process the full sequence.
3.  **Secondary LSTM Layer**: `LSTM(50)`
    *   50 hidden units. Consolidates the temporal features into a single vector representation for the final cycles.
4.  **Hidden Dense Layer**: `Dense(50, activation='relu')`
    *   A fully connected layer with 50 units and ReLU activation to learn non-linear combinations of the extracted temporal features.
5.  **Dropout Layer**: `Dropout(0.2)`
    *   Randomly sets 20% of input units to 0 during training to prevent overfitting and improve generalization.
6.  **Output Layer**: `Dense(1)`
    *   A single unit that outputs the continuous value representing the Predicted Remaining Useful Life (RUL).

### Training Details
- **Sequence Length**: 50 timesteps
- **Loss Function**: Huber Loss (delta=15.0)
- **Optimizer**: Adam (lr=1e-3)
- **Early Stopping**: Patience=6
- **RMSE**: ~14.8 cycles

### Data Preprocessing
1. **Scaling**: MinMaxScaler on sensor features
2. **Sequence Creation**: Sliding window of 50 cycles
3. **Padding**: Zero-padding for sequences < 50 cycles
4. **RUL Capping**: Maximum RUL = 125 cycles

## 📈 Dashboard Features

- **Engine Selection**: Choose from 100 test engines
- **Real-time Simulation**: Step-by-step cycle progression
- **RUL Prediction**: Remaining useful life estimation
- **Health Score**: 0-100% health indicator
- **Status Indicator**: GREEN/YELLOW/RED based on health
- **Interactive Charts**:
  - Health degradation over time
  - Sensor readings (6 key sensors)
- **Playback Controls**: Play/Pause/Reset simulation
- **Speed Control**: Adjustable simulation speed

## 🎨 Health Status Thresholds

| Health Score | Status | Color |
|-------------|--------|-------|
| > 60% | GREEN | 🟢 |
| 30-60% | YELLOW | 🟡 |
| < 30% | RED | 🔴 |

## 🔍 Key Technical Details

### Critical Implementation Notes

1. **Scaling Order**: Data must be scaled **before** padding (not after)
2. **Sequence Creation**: Include current cycle in prediction sequence
3. **Padding Strategy**: Zero-padding at the beginning of sequence
4. **Feature Consistency**: Use exact same 10 features as training

### Common Issues & Solutions

**Issue**: Dashboard predictions don't match notebook
- **Cause**: Incorrect scaling order or sequence slicing
- **Solution**: Ensure scaling before padding, include current cycle

**Issue**: Model returns low RUL for engines with < 50 cycles
- **Cause**: Padding applied after scaling
- **Solution**: Scale features first, then apply padding

## 📊 Performance Metrics

Detailed evaluation of the model performance on the FD001 test set:

| Metric | Value |
|--------|-------|
| **RMSE** | 14.656 cycles |
| **MAE** | 10.587 cycles |
| **Correlation (R)** | 0.940 |
| **R² Score** | 0.866 |
| **Max Error** | 44.2 cycles |

### Zone-wise Performance (RMSE)
* **Late Life (<=30 cycles):** 6.788
* **Mid Life (30-80 cycles):** 19.200
* **Early Life (>80 cycles):** 15.347

## 🛠️ Development

### Training a New Model

1. Open `test1.ipynb` in Jupyter
2. Run all cells to train the model
3. Model will be saved to `model/rul_model.keras`
4. Scaler will be saved to `model/scaler.joblib`

### Building for Production

```bash
cd client
npm run build
```

Build output will be in `client/dist/`

## 📝 License

This project uses the NASA C-MAPSS dataset, which is publicly available for research purposes.

## 🙏 Acknowledgments

- NASA Ames Prognostics Data Repository
- C-MAPSS (Commercial Modular Aero-Propulsion System Simulation)

## 📧 Contact

For questions or issues, please open an issue in the repository.

---

**Note**: This is a research/educational project. For production use in safety-critical systems, additional validation and certification would be required.

import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import MetricsPanel from './components/MetricsPanel';
import SensorCharts from './components/SensorCharts';

const API_URL = 'http://127.0.0.1:5000/api';

function App() {
  // State
  const [engines, setEngines] = useState([]);
  const [selectedEngine, setSelectedEngine] = useState(null);
  const [engineData, setEngineData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);

  // Metrics
  const [rul, setRul] = useState(null);
  const [health, setHealth] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ message: 'READY', type: 'ready' });

  // History for Charts
  const [healthHistory, setHealthHistory] = useState([]);
  const [sensorHistory, setSensorHistory] = useState([]);

  const timerRef = useRef(null);

  // 1. Fetch Engines on Mount
  useEffect(() => {
    fetch(`${API_URL}/engines`)
      .then(res => res.json())
      .then(data => setEngines(data))
      .catch(err => setStatusMsg({ message: 'API ERROR', type: 'error' }));
  }, []);

  // 2. Load Engine Data when Selected
  useEffect(() => {
    if (selectedEngine) {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);

      setStatusMsg({ message: 'LOADING...', type: 'loading' });
      fetch(`${API_URL}/engine/${selectedEngine}`)
        .then(res => res.json())
        .then(data => {
          setEngineData(data);
          resetSimulation();
          setStatusMsg({ message: 'READY', type: 'ready' });
        })
        .catch(err => setStatusMsg({ message: 'LOAD ERROR', type: 'error' }));
    }
  }, [selectedEngine]);

  // 3. Simulation Loop Management
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(stepSimulation, speed);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, speed, currentIndex, engineData]);

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentIndex(0);
    setRul(null);
    setHealth(null);
    setHealthHistory([]);
    setSensorHistory([]);
  };

  const stepSimulation = async () => {
    if (!engineData.length || currentIndex >= engineData.length) {
      setIsRunning(false);
      setStatusMsg({ message: 'COMPLETED', type: 'ready' });
      return;
    }

    const currentData = engineData[currentIndex];

    // Update Chart History (Keep last 50 points)
    setSensorHistory(prev => {
      const newItem = {
        cycle: currentData.cycle,
        s2: currentData.sensor_2, s3: currentData.sensor_3, s4: currentData.sensor_4,
        s7: currentData.sensor_7, s12: currentData.sensor_12, s15: currentData.sensor_15
      };
      const newHistory = [...prev, newItem];
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });

    // Prediction Logic (Always predict, let backend handle padding)
    if (currentIndex > 0) {
      setStatusMsg({ message: 'RUNNING', type: 'running' });

      // Send up to last 50 points (including current cycle)
      const sequence = engineData.slice(Math.max(0, currentIndex + 1 - 50), currentIndex + 1);

      try {
        const res = await fetch(`${API_URL}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: sequence })
        });
        const result = await res.json();

        if (result.error) throw new Error(result.error);

        setRul(result.rul);
        setHealth(result.health_score);

        setHealthHistory(prev => {
          const newH = [...prev, { cycle: currentData.cycle, value: result.health_score }];
          return newH;
        });

      } catch (e) {
        console.error(e);
      }
    } else {
      setStatusMsg({ message: 'STARTING...', type: 'loading' });
    }

    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <Sidebar
        engines={engines}
        selectedEngine={selectedEngine}
        onSelectEngine={setSelectedEngine}
        isRunning={isRunning}
        onToggle={() => setIsRunning(!isRunning)}
        onReset={resetSimulation}
        speed={speed}
        onSpeedChange={setSpeed}
        status={statusMsg}
      />

      <main className="main-content" style={{ marginLeft: '320px', padding: '20px', minHeight: '100vh', overflowY: 'auto' }}>
        <MetricsPanel
          rul={rul}
          health={health}
          cycle={engineData[currentIndex]?.cycle || 0}
        />

        <SensorCharts
          healthHistory={healthHistory}
          sensorHistory={sensorHistory}
        />
      </main>
    </div>
  );
}

export default App;

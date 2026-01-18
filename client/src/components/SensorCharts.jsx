import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Chart Defaults
ChartJS.defaults.color = '#94a3b8';
ChartJS.defaults.borderColor = 'rgba(255,255,255,0.05)';

const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: { point: { radius: 0 } },
    animation: false,
    interaction: { mode: 'index', intersect: false },
    scales: { x: { display: false } } // Hide X axis labels for cleaner look? Or keep them. Let's hide to match minimal look, or show sparse.
};

const SensorCharts = ({ healthHistory, sensorHistory }) => {

    // Health Data
    const healthData = {
        labels: healthHistory.map(h => h.cycle),
        datasets: [{
            label: 'Health %',
            data: healthHistory.map(h => h.value),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    // Sensor 1 (Vibrations: 2, 3, 4)
    // Map from history list. 
    // History item: { cycle: 1, s2: ..., s3: ..., s4: ..., s7: ..., s12: ..., s15: ... }
    const sensor1Data = {
        labels: sensorHistory.map(d => d.cycle),
        datasets: [
            { label: 'Sensor 2', data: sensorHistory.map(d => d.s2), borderColor: '#3b82f6', tension: 0.3 },
            { label: 'Sensor 3', data: sensorHistory.map(d => d.s3), borderColor: '#8b5cf6', tension: 0.3 },
            { label: 'Sensor 4', data: sensorHistory.map(d => d.s4), borderColor: '#ec4899', tension: 0.3 },
        ]
    };

    // Sensor 2 (Pressure: 7, 12, 15)
    const sensor2Data = {
        labels: sensorHistory.map(d => d.cycle),
        datasets: [
            { label: 'Sensor 7', data: sensorHistory.map(d => d.s7), borderColor: '#f59e0b', tension: 0.3 },
            { label: 'Sensor 12', data: sensorHistory.map(d => d.s12), borderColor: '#ef4444', tension: 0.3 },
            { label: 'Sensor 15', data: sensorHistory.map(d => d.s15), borderColor: '#06b6d4', tension: 0.3 },
        ]
    };

    return (
        <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
            <div className="chart-card glass-panel" style={{ padding: '20px', gridColumn: 'span 2' }}>
                <h3 className="text-sm font-bold text-muted mb-4 uppercase">Health Degradation Over Time</h3>
                <div style={{ height: '250px' }}>
                    <Line data={healthData} options={{ ...commonOptions, scales: { y: { min: 0, max: 100 } } }} />
                </div>
            </div>

            <div className="chart-card glass-panel" style={{ padding: '20px' }}>
                <h3 className="text-sm font-bold text-muted mb-4 uppercase">Vibration Sensors (2, 3, 4)</h3>
                <div style={{ height: '200px' }}>
                    <Line data={sensor1Data} options={commonOptions} />
                </div>
            </div>

            <div className="chart-card glass-panel" style={{ padding: '20px' }}>
                <h3 className="text-sm font-bold text-muted mb-4 uppercase">Pressure Sensors (7, 12, 15)</h3>
                <div style={{ height: '200px' }}>
                    <Line data={sensor2Data} options={commonOptions} />
                </div>
            </div>
        </div>
    );
};

export default SensorCharts;

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
    elements: {
        point: { radius: 0, hoverRadius: 6, backgroundColor: '#fff', borderWidth: 2 },
        line: { tension: 0.4, borderWidth: 3 }
    },
    animation: {
        duration: 800,
        easing: 'easeOutQuart'
    },
    plugins: {
        legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
                usePointStyle: true,
                padding: 20,
                color: '#94a3b8',
                font: { family: "'Outfit', sans-serif", size: 11, weight: 600 }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#0f172a',
            bodyColor: '#334155',
            titleFont: { family: "'Outfit', sans-serif", size: 14 },
            bodyFont: { family: "'Inter', sans-serif", size: 12 },
            padding: 12,
            borderColor: 'rgba(0,0,0,0.1)',
            borderWidth: 1,
            displayColors: true,
            boxPadding: 4
        }
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { family: "'JetBrains Mono', monospace", size: 10 } }
        },
        y: {
            grid: { color: 'rgba(148, 163, 184, 0.1)' },
            ticks: { color: '#94a3b8', font: { family: "'JetBrains Mono', monospace", size: 10 } }
        }
    }
};

const SensorCharts = ({ healthHistory, sensorHistory }) => {
    // Health Data with Gradient
    const healthData = {
        labels: healthHistory.map(h => h.cycle),
        datasets: [{
            label: 'System Health Stability',
            data: healthHistory.map(h => h.value),
            borderColor: 'hsl(150, 84%, 45%)',
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
                gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
                return gradient;
            },
            fill: true,
        }]
    };

    const sensor1Data = {
        labels: sensorHistory.map(d => d.cycle),
        datasets: [
            { label: 'S2 Thermal', data: sensorHistory.map(d => d.s2), borderColor: 'hsl(217, 91%, 60%)' },
            { label: 'S3 Vib', data: sensorHistory.map(d => d.s3), borderColor: 'hsl(262, 80%, 65%)' },
            { label: 'S4 Flow', data: sensorHistory.map(d => d.s4), borderColor: 'hsl(320, 80%, 60%)' },
        ]
    };

    const sensor2Data = {
        labels: sensorHistory.map(d => d.cycle),
        datasets: [
            { label: 'S7 Pressure', data: sensorHistory.map(d => d.s7), borderColor: 'hsl(45, 93%, 50%)' },
            { label: 'S12 Speed', data: sensorHistory.map(d => d.s12), borderColor: 'hsl(0, 84%, 60%)' },
            { label: 'S15 Bypass', data: sensorHistory.map(d => d.s15), borderColor: 'hsl(180, 70%, 50%)' },
        ]
    };

    return (
        <div className="charts-grid animate-entrance" style={{ marginTop: '2rem' }}>
            <div className="glass-card p-4" style={{ gridColumn: 'span 2', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>HEALTH DEGRADATION TRAJECTORY</h3>
                    <div className="status-pill status-live">
                        <div className="pulse" style={{ background: 'var(--success)' }}></div>
                        ANALYZING TRENDS
                    </div>
                </div>
                <div style={{ height: '300px' }}>
                    <Line data={healthData} options={{ ...commonOptions, scales: { ...commonOptions.scales, y: { ...commonOptions.scales.y, min: 0, max: 100 } } }} />
                </div>
            </div>

            <div className="glass-card p-4" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>INTERNAL VIBRATION ANALYSIS</h3>
                <div style={{ height: '220px' }}>
                    <Line data={sensor1Data} options={commonOptions} />
                </div>
            </div>

            <div className="glass-card p-4" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>PRESSURE & FLOW DYNAMICS</h3>
                <div style={{ height: '220px' }}>
                    <Line data={sensor2Data} options={commonOptions} />
                </div>
            </div>
        </div>
    );
};

export default SensorCharts;

import React from 'react';
import { Timer, RefreshCw } from 'lucide-react';
import HealthStatus from './HealthStatus';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const MetricsPanel = ({ rul, health, cycle }) => {
    // RUL Fix: Ensure we display '--' if rul is null/undefined
    const displayRul = (rul !== null && rul !== undefined) ? Math.round(rul) : '--';
    const displayHealth = (health !== null && health !== undefined) ? Math.round(health) : '--';
    const numericHealth = (health !== null && health !== undefined) ? health : 100;

    // Gauge Data
    const gaugeData = {
        labels: ['Health', 'Lost'],
        datasets: [{
            data: [numericHealth, 100 - numericHealth],
            backgroundColor: [
                numericHealth > 70 ? '#10b981' : numericHealth > 40 ? '#f59e0b' : '#ef4444',
                'rgba(255,255,255,0.05)'
            ],
            borderWidth: 0,
            circumference: 180,
            rotation: 270,
        }]
    };

    const gaugeOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '80%',
        plugins: { tooltip: { enabled: false }, legend: { display: false } }
    };

    return (
        <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {/* RUL Card */}
            <div className="metric-card glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="metric-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-muted)' }}>
                    <Timer size={20} />
                    <h2 className="text-sm font-bold uppercase">RUL Prediction</h2>
                </div>
                <div className="metric-value" style={{ fontSize: '48px', fontWeight: '700', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {displayRul} <span className="measure" style={{ fontSize: '16px', fontWeight: '400', WebkitTextFillColor: 'var(--text-muted)' }}>cycles</span>
                </div>
                <p className="metric-sub text-xs text-muted">Remaining Useful Life</p>
            </div>

            {/* Health Score */}
            <div className="metric-card glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="metric-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-muted)' }}>
                    <HealthStatus score={numericHealth} />
                </div>
                <div style={{ position: 'relative', width: '100%', height: '100px', display: 'flex', justifyContent: 'center' }}>
                    <Doughnut data={gaugeData} options={gaugeOptions} />
                    <div style={{ position: 'absolute', bottom: '0', fontSize: '24px', fontWeight: '700' }}>{displayHealth}%</div>
                </div>
            </div>

            {/* Cycle Counter */}
            <div className="metric-card glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="metric-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-muted)' }}>
                    <RefreshCw size={20} />
                    <h2 className="text-sm font-bold uppercase">Observed Cycle (Total Cycles Obs)</h2>
                </div>
                <div className="metric-value" style={{ fontSize: '48px', fontWeight: '700', color: 'white' }}>
                    {cycle}
                </div>
                <p className="metric-sub text-xs text-muted">Operational Cycles</p>
            </div>
        </div>
    );
};

export default MetricsPanel;

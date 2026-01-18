import React from 'react';
import { Timer, Activity, ShieldCheck, Zap } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';

// Register all necessary elements to prevent Chart.js from crashing
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

const MetricsPanel = ({ rul, health, cycle }) => {
    const safeRul = (rul !== null && rul !== undefined && !isNaN(rul)) ? Number(rul) : 0;
    const displayRul = (rul !== null && rul !== undefined) ? Math.round(rul) : '--';
    const displayHealth = (health !== null && health !== undefined) ? Math.round(health) : '--';
    const numericHealth = (health !== null && health !== undefined && !isNaN(health)) ? Number(health) : 0;
    const displayCycle = (cycle !== null && cycle !== undefined) ? cycle : 0;

    const getHealthColor = (score) => {
        if (score > 70) return 'var(--success)';
        if (score > 40) return 'var(--warning)';
        return 'var(--danger)';
    };

    const healthColor = getHealthColor(numericHealth);

    const gaugeData = {
        datasets: [{
            data: [numericHealth, Math.max(0, 100 - numericHealth)],
            backgroundColor: [healthColor, 'rgba(255,255,255,0.03)'],
            borderWidth: 0,
            circumference: 220,
            rotation: 250,
            cutout: '85%',
            borderRadius: 10
        }]
    };

    // Calculate progress width safely
    const progressWidth = Math.min(100, Math.max(0, (Number(safeRul) / 200) * 100));

    return (
        <div className="dashboard-grid animate-entrance">
            {/* RUL Card */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', color: 'var(--text-dim)' }}>
                    <div style={{ padding: '8px', background: 'rgba(59,130,246,0.1)', borderRadius: '8px', display: 'flex' }}>
                        <Timer size={20} color="var(--primary)" />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>REMAINING USEFUL LIFE</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span className="metric-value" style={{
                        color: 'var(--text-main)',
                        background: 'linear-gradient(to bottom, var(--text-main), var(--text-dim))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>{displayRul}</span>
                    <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>cycles</span>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                        <div style={{
                            width: `${progressWidth}%`,
                            height: '100%',
                            background: 'var(--primary)',
                            borderRadius: '2px',
                            boxShadow: '0 0 10px var(--primary-glow)',
                            transition: 'width 0.5s ease-in-out'
                        }} />
                    </div>
                </div>
            </div>

            {/* Health Score Card */}
            <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: 'var(--text-dim)' }}>
                    <div style={{
                        padding: '8px',
                        background: `color-mix(in srgb, ${healthColor}, transparent 85%)`,
                        borderRadius: '8px',
                        display: 'flex'
                    }}>
                        <Activity size={20} color={healthColor} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>SYSTEM HEALTH SCORE</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px', marginTop: '-10px' }}>
                    <div style={{ width: '160px', height: '160px', position: 'absolute' }}>
                        <Doughnut
                            data={gaugeData}
                            options={{
                                plugins: { tooltip: { enabled: false }, legend: { display: false } },
                                maintainAspectRatio: false,
                                animation: { duration: 500 }
                            }}
                        />
                    </div>
                    <div style={{ textAlign: 'center', zIndex: 1 }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: healthColor }}>
                            {displayHealth}<span style={{ fontSize: '1.25rem' }}>%</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>NOMINAL</div>
                    </div>
                </div>
            </div>

            {/* Current Cycle Card */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                    <div style={{ padding: '8px', background: 'rgba(168,85,247,0.1)', borderRadius: '8px', display: 'flex' }}>
                        <Zap size={20} color="var(--accent)" />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-dim)' }}>OPERATIONAL CYCLES</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                    <span className="metric-value" style={{ color: 'var(--text-main)' }}>
                        {displayCycle < 1000 ? String(displayCycle).padStart(3, '0') : displayCycle}
                    </span>
                    <ShieldCheck size={20} color="var(--success)" style={{ filter: 'drop-shadow(0 0 5px var(--success))' }} />
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div className="pulse" style={{ background: 'var(--success)', width: '6px', height: '6px' }}></div>
                    LIVE DATA STREAM
                </div>
            </div>
        </div>
    );
};

export default MetricsPanel;

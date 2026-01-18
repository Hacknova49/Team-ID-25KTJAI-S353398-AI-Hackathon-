import {
    Settings,
    Play,
    Pause,
    RotateCcw,
    Database,
    Activity,
    Cpu,
    Sun,
    Moon
} from 'lucide-react';

const Sidebar = ({
    engines,
    selectedEngine,
    onSelectEngine,
    isRunning,
    onToggle,
    onReset,
    speed,
    onSpeedChange,
    status,
    isDark,
    toggleTheme
}) => {
    return (
        <aside className="sidebar glass-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2.5rem', scrollbarWidth: 'none' }}>
                {/* Brand Section */}
                <div className="flex" style={{ alignItems: 'center', gap: '12px' }}>
                    <div className="glass-card" style={{
                        width: '45px',
                        height: '45px',
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Cpu size={24} color="white" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>AeroMaintain</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Predictive AI Engine
                        </p>
                    </div>
                </div>

                {/* Engine Selection */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-dim)', fontSize: '0.875rem', fontWeight: 600 }}>
                        <Database size={16} />
                        <span>ENGINE SELECTION</span>
                    </div>
                    <select
                        className="glass-card"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'var(--card-bg)',
                            color: 'var(--text-main)',
                            border: '1px solid var(--glass-border)',
                            outline: 'none',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                        value={selectedEngine || ''}
                        onChange={(e) => onSelectEngine(Number(e.target.value))}
                    >
                        <option value="" disabled>Select Test Unit</option>
                        {engines.map(id => (
                            <option key={id} value={id}>Engine Pack #{String(id).padStart(3, '0')}</option>
                        ))}
                    </select>
                </section>

                {/* Control Center */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-dim)', fontSize: '0.875rem', fontWeight: 600 }}>
                        <Activity size={16} />
                        <span>SIMULATION CONTROL</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                            onClick={onToggle}
                            className={`btn-premium ${isRunning ? 'btn-premium-secondary' : 'btn-premium-primary'}`}
                            disabled={!selectedEngine}
                            style={{ width: '100%' }}
                        >
                            {isRunning ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Run Simulation</>}
                        </button>

                        <button
                            onClick={onReset}
                            className="btn-premium btn-premium-secondary"
                            style={{ width: '100%' }}
                        >
                            <RotateCcw size={20} /> Reset Sequence
                        </button>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 700 }}>SPEED DELAY</span>
                            <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--primary)', fontSize: '0.875rem' }}>{speed}ms</span>
                        </div>
                        <input
                            type="range"
                            min="100"
                            max="2000"
                            step="100"
                            value={speed}
                            onChange={(e) => onSpeedChange(Number(e.target.value))}
                            style={{ height: '4px', width: '100%' }}
                        />
                    </div>
                </section>

                {/* Model Intelligence Info */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-dim)', fontSize: '0.875rem', fontWeight: 600 }}>
                        <Activity size={16} />
                        <span>MODEL INTELLIGENCE</span>
                    </div>
                    <div className="glass-card" style={{ padding: '1rem', background: 'var(--glass-highlight)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>FD001 RMSE</span>
                            <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>14.656</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>FD001 MAE</span>
                            <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>10.587</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>CORRELATION (R)</span>
                            <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>0.940</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>R² SCORE</span>
                            <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, color: 'var(--primary)' }}>0.866</span>
                        </div>
                    </div>
                </section>
            </div>

            {/* Sticky System Status Footer */}
            <footer className="glass-card" style={{ padding: '1.25rem', background: 'var(--glass-highlight)', borderTop: '1px solid var(--glass-border)', borderRadius: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="status-pill status-live">
                        <div className={`dot ${status.type === 'running' ? 'pulse' : ''}`} style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: status.type === 'error' ? 'var(--danger)' : status.type === 'ready' ? 'var(--text-muted)' : 'var(--success)'
                        }}></div>
                        <span>{status.message}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            className="theme-toggle"
                            onClick={toggleTheme}
                            style={{ background: 'var(--card-bg)', border: '1px solid var(--glass-border)' }}
                            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <Settings size={18} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
                    </div>
                </div>
            </footer>
        </aside>
    );
};

export default Sidebar;

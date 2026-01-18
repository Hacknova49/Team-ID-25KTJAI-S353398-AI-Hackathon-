import React from 'react';
import { Plane, Play, RotateCcw, Pause } from 'lucide-react';

const Sidebar = ({
    engines,
    selectedEngine,
    onSelectEngine,
    isRunning,
    onToggle,
    onReset,
    speed,
    onSpeedChange,
    status
}) => {
    return (
        <aside className="sidebar glass-panel" style={{ width: '280px', display: 'flex', flexDirection: 'column', padding: '24px', height: '100%', position: 'fixed', left: '20px', top: '20px', bottom: '20px' }}>
            <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                <Plane className="text-primary" size={32} color="#3b82f6" />
                <div>
                    <h1 style={{ fontSize: '20px', lineHeight: '1.2', fontWeight: 'bold' }}>AeroGuard<br />
                        <span className="subtitle" style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '400', textTransform: 'uppercase', letterSpacing: '1px' }}>Predictive AI</span></h1>
                </div>
            </div>

            <div className="controls" style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: '1' }}>
                <div className="control-group">
                    <label className="text-sm text-muted mb-2 block">Select Engine</label>
                    <select
                        className="glass-input"
                        value={selectedEngine || ''}
                        onChange={(e) => onSelectEngine(Number(e.target.value))}
                    >
                        <option value="" disabled>Select Engine</option>
                        {engines.map(id => (
                            <option key={id} value={id}>Engine {id}</option>
                        ))}
                    </select>
                </div>

                <div className="control-group">
                    <label className="text-sm text-muted mb-2 block">Simulation Speed</label>
                    <input
                        type="range"
                        min="100"
                        max="1000"
                        step="100"
                        value={speed}
                        onChange={(e) => onSpeedChange(Number(e.target.value))}
                    />
                    <div className="speed-label text-xs text-muted text-right mt-2">{speed}ms</div>
                </div>

                <button
                    onClick={onToggle}
                    disabled={!selectedEngine}
                    className={`btn-primary ${!selectedEngine ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isRunning ? <Pause size={20} /> : <Play size={20} />}
                    {isRunning ? 'Pause Simulation' : 'Start Simulation'}
                </button>

                <button onClick={onReset} className="btn-secondary">
                    <RotateCcw size={20} />
                    Reset
                </button>
            </div>

            <div className="status-panel" style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 className="text-xs text-muted uppercase mb-3">System Status</h3>
                <div className={`flex items-center gap-2 text-sm font-bold ${status.type === 'error' ? 'text-red' :
                        status.type === 'loading' ? 'text-primary' :
                            status.type === 'running' ? 'text-green' : 'text-muted'
                    }`}>
                    <div className="dot" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'currentColor', boxShadow: '0 0 10px currentColor' }}></div>
                    {status.message}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

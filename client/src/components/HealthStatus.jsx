import React from 'react';
import { Activity } from 'lucide-react';

const HealthStatus = ({ score }) => {
    let status = 'HEALTHY';
    let colorClass = 'text-green';
    let bgClass = 'bg-green-10';

    // Industry Standards Implementation
    if (score < 40) {
        status = 'CRITICAL';
        colorClass = 'text-red';
        bgClass = 'bg-red-10';
    } else if (score < 70) {
        status = 'WARNING';
        colorClass = 'text-yellow';
        bgClass = 'bg-yellow-10';
    }

    return (
        <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border-white-10 ${bgClass}`}>
            <Activity className={colorClass} size={20} />
            <div className="flex flex-col">
                <span className="text-xs text-muted uppercase tracking-wider">Condition</span>
                <span className={`font-bold ${colorClass}`}>{status}</span>
            </div>
        </div>
    );
};

export default HealthStatus;

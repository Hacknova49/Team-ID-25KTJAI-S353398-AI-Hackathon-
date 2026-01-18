const API_URL = 'http://127.0.0.1:5000/api';

// State
let engineList = [];
let currentEngineData = [];
let simulationInterval = null;
let currentIndex = 0;
let simulationSpeed = 500;
let isRunning = false;

// DOM Elements
const engineSelect = document.getElementById('engineSelect');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const speedRange = document.getElementById('speedRange');
const speedValue = document.getElementById('speedValue');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const rulValue = document.getElementById('rulValue');
const healthValue = document.getElementById('healthValue');
const cycleValue = document.getElementById('cycleValue');

// Charts
let healthChart, sensorChart1, sensorChart2, healthGauge;

document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    fetchEngines();
    setupEventListeners();
});

function setupEventListeners() {
    startBtn.addEventListener('click', toggleSimulation);
    resetBtn.addEventListener('click', resetSimulation);
    
    speedRange.addEventListener('input', (e) => {
        simulationSpeed = e.target.value;
        speedValue.innerText = simulationSpeed;
        if (isRunning) {
            clearInterval(simulationInterval);
            simulationInterval = setInterval(simulationStep, simulationSpeed);
        }
    });
}

async function fetchEngines() {
    try {
        const response = await fetch(`${API_URL}/engines`);
        const engines = await response.json();
        
        engineSelect.innerHTML = '<option value="" disabled selected>Select Engine</option>';
        engines.forEach(id => {
            const option = document.createElement('option');
            option.value = id;
            option.innerText = `Engine ${id}`;
            engineSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching engines:', error);
        engineSelect.innerHTML = '<option disabled>Error loading</option>';
    }
}

async function toggleSimulation() {
    const engineId = engineSelect.value;
    if (!engineId) {
        alert('Please select an engine first');
        return;
    }

    if (isRunning) {
        // Stop
        clearInterval(simulationInterval);
        isRunning = false;
        startBtn.innerHTML = '<span class="material-icons-round">play_arrow</span> Resume';
        setStatus('PAUSED', 'yellow');
    } else {
        // Start or Resume
        if (currentEngineData.length === 0) {
            await loadEngineData(engineId);
        }
        
        simulationInterval = setInterval(simulationStep, simulationSpeed);
        isRunning = true;
        startBtn.innerHTML = '<span class="material-icons-round">pause</span> Pause';
        setStatus('RUNNING', 'green');
    }
}

async function loadEngineData(id) {
    setStatus('LOADING DATA...', 'blue');
    try {
        const response = await fetch(`${API_URL}/engine/${id}`);
        currentEngineData = await response.json();
        currentIndex = 0;
        resetCharts();
    } catch (e) {
        console.error(e);
        setStatus('ERROR', 'red');
    }
}

function resetSimulation() {
    clearInterval(simulationInterval);
    isRunning = false;
    currentIndex = 0;
    currentEngineData = [];
    resetCharts();
    
    startBtn.innerHTML = '<span class="material-icons-round">play_arrow</span> Start Simulation';
    setStatus('READY', 'green');
    rulValue.innerText = '--';
    healthValue.innerText = '--%';
    cycleValue.innerText = '0';
    updateGauge(100);
}

async function simulationStep() {
    if (currentIndex >= currentEngineData.length) {
        clearInterval(simulationInterval);
        isRunning = false;
        setStatus('COMPLETED', 'blue');
        startBtn.innerHTML = '<span class="material-icons-round">replay</span> Replay';
        return;
    }

    const currentCycleData = currentEngineData[currentIndex];
    cycleValue.innerText = currentCycleData.cycle;

    // We need at least 50 cycles for prediction
    // But for UI, we show sensors immediately
    updateSensorCharts(currentCycleData);

    if (currentIndex >= 50) {
        // Prepare payload: Last 50 cycles
        const sequence = currentEngineData.slice(currentIndex - 50, currentIndex);
        
        try {
            const response = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: sequence })
            });
            
            const result = await response.json();
            updateDashboard(result, currentCycleData.cycle);
            
        } catch (e) {
            console.error('Prediction error:', e);
        }
    } else {
        setStatus(`WARMUP (${currentIndex}/50)`, 'yellow');
    }

    currentIndex++;
}

function updateDashboard(data, cycle) {
    // data = { rul, health_score, status }
    
    rulValue.innerText = Math.round(data.rul);
    healthValue.innerText = Math.round(data.health_score) + '%';
    
    updateGauge(data.health_score);
    
    // Update Health Chart
    healthChart.data.labels.push(cycle);
    healthChart.data.datasets[0].data.push(data.health_score);
    
    // Keep chart window reasonable size (e.g. 50 points)? Or show all?
    // Showing all is better for history.
    healthChart.update('none'); // 'none' for performance
    
    // Status visual
    if(data.status === 'RED') setStatus('CRITICAL', 'red');
    else if(data.status === 'YELLOW') setStatus('WARNING', 'yellow');
    else setStatus('HEALTHY', 'green');
}

function updateSensorCharts(data) {
    // Sensor Chart 1 (Vibrations: 2, 3, 4)
    sensorChart1.data.labels.push(data.cycle);
    sensorChart1.data.datasets[0].data.push(data.sensor_2);
    sensorChart1.data.datasets[1].data.push(data.sensor_3);
    sensorChart1.data.datasets[2].data.push(data.sensor_4);
    
    if(sensorChart1.data.labels.length > 50) {
        sensorChart1.data.labels.shift();
        sensorChart1.data.datasets.forEach(d => d.data.shift());
    }
    sensorChart1.update('none');

    // Sensor Chart 2 (Pressure: 7, 12, 15)
    sensorChart2.data.labels.push(data.cycle);
    sensorChart2.data.datasets[0].data.push(data.sensor_7);
    sensorChart2.data.datasets[1].data.push(data.sensor_12);
    sensorChart2.data.datasets[2].data.push(data.sensor_15);

    if(sensorChart2.data.labels.length > 50) {
        sensorChart2.data.labels.shift();
        sensorChart2.data.datasets.forEach(d => d.data.shift());
    }
    sensorChart2.update('none');
}

function setStatus(text, colorClassSuffix) {
    statusText.innerText = text;
    statusIndicator.className = `status-badge status-${colorClassSuffix}`;
}

// Chart Helpers
function initCharts() {
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.05)';

    // Health Chart
    healthChart = new Chart(document.getElementById('healthChart'), {
        type: 'line',
        data: { labels: [], datasets: [{ 
            label: 'Health %', 
            data: [], 
            borderColor: '#10b981', 
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(16, 185, 129, 0.1)'
        }]},
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { min: 0, max: 100 } },
            plugins: { legend: { display: false } },
            animation: false
        }
    });

    // Sensors
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        elements: { point: { radius: 0 } }, // Hide points for cleaner look
        animation: false,
        interaction: { mode: 'index', intersect: false },
    };

    sensorChart1 = new Chart(document.getElementById('sensorChart1'), {
        type: 'line',
        data: { labels: [], datasets: [
            { label: 'Sensor 2', data: [], borderColor: '#3b82f6', tension: 0.3 },
            { label: 'Sensor 3', data: [], borderColor: '#8b5cf6', tension: 0.3 },
            { label: 'Sensor 4', data: [], borderColor: '#ec4899', tension: 0.3 }
        ]},
        options: commonOptions
    });

    sensorChart2 = new Chart(document.getElementById('sensorChart2'), {
        type: 'line',
        data: { labels: [], datasets: [
            { label: 'Sensor 7', data: [], borderColor: '#f59e0b', tension: 0.3 },
            { label: 'Sensor 12', data: [], borderColor: '#ef4444', tension: 0.3 },
            { label: 'Sensor 15', data: [], borderColor: '#06b6d4', tension: 0.3 }
        ]},
        options: commonOptions
    });

    // Gauge
    healthGauge = new Chart(document.getElementById('healthGauge'), {
        type: 'doughnut',
        data: {
            labels: ['Health', 'Lost'],
            datasets: [{
                data: [100, 0],
                backgroundColor: ['#10b981', 'rgba(255,255,255,0.05)'],
                borderWidth: 0,
                circumference: 180,
                rotation: 270
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '80%',
            plugins: { tooltip: { enabled: false }, legend: { display: false } }
        }
    });
}

function updateGauge(value) {
    healthGauge.data.datasets[0].data = [value, 100 - value];
    
    // Color change based on value
    let color = '#10b981'; // Green
    if (value <= 30) color = '#ef4444'; // Red
    else if (value <= 60) color = '#f59e0b'; // Yellow
    
    healthGauge.data.datasets[0].backgroundColor[0] = color;
    healthGauge.update();
}

function resetCharts() {
    healthChart.data.labels = [];
    healthChart.data.datasets[0].data = [];
    healthChart.update();

    sensorChart1.data.labels = [];
    sensorChart1.data.datasets.forEach(d => d.data = []);
    sensorChart1.update();

    sensorChart2.data.labels = [];
    sensorChart2.data.datasets.forEach(d => d.data = []);
    sensorChart2.update();
    
    updateGauge(100);
}

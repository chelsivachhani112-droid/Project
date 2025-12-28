let goals = JSON.parse(localStorage.getItem('finova_goals')) || [
    {
        id: 1,
        name: "Emergency Fund",
        target: 100000,
        current: 65000,
        color: "blue",
        date: "2024-12-31"
    },
    {
        id: 2,
        name: "New Car",
        target: 500000,
        current: 120000,
        color: "green",
        date: "2025-06-30"
    },
    {
        id: 3,
        name: "Vacation Fund",
        target: 75000,
        current: 45000,
        color: "purple",
        date: "2024-08-15"
    }
];
let myChart;

function toggleDrawer(show) {
    document.getElementById('drawer-overlay').classList.toggle('active', show);
}

function handleFormSubmit(e) {
    e.preventDefault();
    const newGoal = {
        id: Date.now(),
        name: document.getElementById('g-name').value,
        target: parseFloat(document.getElementById('g-target').value),
        current: parseFloat(document.getElementById('g-current').value),
        color: document.querySelector('input[name="color"]:checked').value,
        date: document.getElementById('g-date').value
    };
    goals.push(newGoal);
    localStorage.setItem('finova_goals', JSON.stringify(goals));
    render();
    toggleDrawer(false);
}

function render() {
    const container = document.getElementById('goals-container');
    let totalTarget = 0, totalSaved = 0;

    container.innerHTML = goals.map(g => {
        const percent = Math.min((g.current / g.target) * 100, 100).toFixed(0);
        totalTarget += g.target;
        totalSaved += g.current;

        return `
            <div class="goal-card">
                <div class="card-top">
                    <div class="icon-box ${g.color}"><i data-lucide="target"></i></div>
                    <div>
                        <h3 style="margin:0; font-size:1.1rem">${g.name}</h3>
                        <span style="color:#64748b; font-size:0.8rem">By ${new Date(g.date).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="progress-labels" style="display:flex; justify-content:space-between; font-weight:700">
                    <span>₹${g.current.toLocaleString()}</span>
                    <span style="color:#64748b">₹${g.target.toLocaleString()}</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width:${percent}%; background:${g.color === 'blue' ? '#2563eb' : g.color === 'green' ? '#10b981' : '#8b5cf6'}"></div>
                </div>
                <div style="font-weight:700; color:var(--primary)">${percent}% Completed</div>
            </div>
        `;
    }).join('');

    document.getElementById('stat-total').innerText = `₹${totalTarget.toLocaleString()}`;
    document.getElementById('stat-saved').innerText = `₹${totalSaved.toLocaleString()}`;
    document.getElementById('overall-progress').innerText = `${goals.length ? ((totalSaved/totalTarget)*100).toFixed(0) : 0}%`;

    lucide.createIcons();
    initChart();
}

function initChart() {
    const ctx = document.getElementById('savingsChart').getContext('2d');
    if(myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: goals.map(g => g.name),
            datasets: [{ label: 'Current', data: goals.map(g => g.current), backgroundColor: '#2563eb', borderRadius: 6 },
                       { label: 'Target', data: goals.map(g => g.target), backgroundColor: '#f1f5f9', borderRadius: 6 }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false } }, y: { display: false } }, plugins: { legend: { display: false } } }
    });
}

render();
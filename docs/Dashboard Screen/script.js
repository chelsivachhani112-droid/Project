// 1. Central Data Store
let financialData = {
    income: 5000,
    spending: [
        { month: "Jan", amount: 2400 },
        { month: "Feb", amount: 2210 },
        { month: "Mar", amount: 2900 }
    ],
    investments: [45, 25, 15, 15] // Stocks, Bonds, Crypto, Cash
};

// 2. Initialize Charts
let lineChart, pieChart;

function initCharts() {
    const ctxLine = document.getElementById('lineChart').getContext('2d');
    lineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: financialData.spending.map(d => d.month),
            datasets: [{
                label: 'Spending ($)',
                data: financialData.spending.map(d => d.amount),
                borderColor: '#3b82f6',
                tension: 0.3
            }]
        }
    });

    const ctxPie = document.getElementById('pieChart').getContext('2d');
    pieChart = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: ['Stocks', 'Bonds', 'Crypto', 'Cash'],
            datasets: [{
                data: financialData.investments,
                backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981']
            }]
        }
    });
}

// 3. Update UI Function (This is the "brain")
function updateDashboard() {
    const income = parseFloat(document.getElementById('incomeInput').value);
    const lastExpense = financialData.spending[financialData.spending.length - 1].amount;
    
    // Calculate Net Savings
    const netSavings = income - lastExpense;
    document.getElementById('netSavingsText').innerText = `$${netSavings.toLocaleString()}`;

    // Update Charts
    lineChart.data.labels = financialData.spending.map(d => d.month);
    lineChart.data.datasets[0].data = financialData.spending.map(d => d.amount);
    lineChart.update();

    pieChart.data.datasets[0].data = financialData.investments;
    pieChart.update();
}

// 4. Custom Button Functions
function addExpense() {
    const month = document.getElementById('expMonth').value;
    const amount = parseFloat(document.getElementById('expAmount').value);

    if(month && amount) {
        financialData.spending.push({ month: month, amount: amount });
        updateDashboard();
    }
}

function updateInvestments() {
    const stocks = parseFloat(document.getElementById('stockValue').value);
    // Simple logic: adjust stocks and keep others proportional
    financialData.investments[0] = stocks;
    updateDashboard();
}

// Run on load
window.onload = () => {
    initCharts();
    updateDashboard();
};
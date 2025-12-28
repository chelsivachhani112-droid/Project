/**
 * FINOVA Core Intelligence Engine
 */

let charts = { pie: null, bar: null };

// Keyword Intelligence for Student Spending
const categorizationRules = {
    'Food & Dining': [/swiggy/i, /zomato/i, /rest/i, /starbucks/i, /mcdonald/i, /kfc/i, /eat/i],
    'Shopping': [/amazon/i, /flipkart/i, /myntra/i, /nykaa/i, /ajio/i, /retail/i, /blinkit/i],
    'Transportation': [/uber/i, /ola/i, /rapido/i, /irctc/i, /indigo/i, /petrol/i],
    'Bills & Utilities': [/jio/i, /airtel/i, /electricity/i, /bill/i, /recharge/i],
    'Subscriptions': [/netflix/i, /spotify/i, /youtube/i, /prime/i, /hotstar/i, /apple/i]
};

document.getElementById('csvFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            processData(results.data);
            document.getElementById('results-section').classList.remove('results-hidden');
            document.getElementById('results-section').classList.add('results-visible');
        }
    });
});

function processData(data) {
    let totalSpent = 0;
    const categoryTotals = {};
    const monthlyData = {};
    const merchantMap = new Map();

    data.forEach(row => {
        // Dynamic column detection
        const desc = (row.Description || row.Narration || row.Particulars || "").toString();
        const amt = Math.abs(parseFloat(row.Amount || row.Value || 0));
        const date = row.Date || "";
        const type = (row.Type || (row.Amount < 0 ? 'Debit' : 'Credit')).toLowerCase();

        if (type.includes('deb') || row.Amount < 0) {
            totalSpent += amt;

            // 1. Auto Categorization
            let category = 'Others';
            for (const [catName, patterns] of Object.entries(categorizationRules)) {
                if (patterns.some(p => p.test(desc))) {
                    category = catName;
                    break;
                }
            }
            categoryTotals[category] = (categoryTotals[category] || 0) + amt;

            // 2. Recurring Detection Logic
            const merchant = desc.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 12);
            if (!merchantMap.has(merchant)) merchantMap.set(merchant, { name: desc.substring(0, 20), count: 0, total: 0 });
            const mObj = merchantMap.get(merchant);
            mObj.count++;
            mObj.total += amt;
        }

        // 3. Trend Logic (By Date)
        const month = date.split('-')[1] || 'Jan'; 
        monthlyData[month] = (monthlyData[month] || 0) + amt;
    });

    const recurring = Array.from(merchantMap.values()).filter(m => m.count > 1);
    updateUI(totalSpent, categoryTotals, monthlyData, recurring, data.length);
}

function updateUI(total, categories, months, recurring, txCount) {
    document.getElementById('total-spent').innerText = `₹${total.toLocaleString()}`;
    document.getElementById('count-tx').innerText = txCount;
    document.getElementById('count-cat').innerText = Object.keys(categories).length;
    document.getElementById('count-rec').innerText = recurring.length;

    renderCharts(categories, months);
    renderRecurringList(recurring);
    lucide.createIcons();
}

function renderCharts(categories, months) {
    if (charts.pie) charts.pie.destroy();
    if (charts.bar) charts.bar.destroy();

    const pieCtx = document.getElementById('pieChart').getContext('2d');
    charts.pie = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#64748b'],
                hoverOffset: 4,
                borderWidth: 0
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    const barCtx = document.getElementById('barChart').getContext('2d');
    charts.bar = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(months),
            datasets: [{ label: 'Spent', data: Object.values(months), backgroundColor: '#3b82f6', borderRadius: 6 }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } } }
    });
}

function renderRecurringList(list) {
    const container = document.getElementById('recurring-list');
    container.innerHTML = list.map(item => `
        <div class="recurring-item">
            <div class="rec-info">
                <h4>${item.name}...</h4>
                <p>Found ${item.count} times • Monthly Frequency</p>
            </div>
            <div class="rec-amt">
                ₹${item.total.toLocaleString()}
                <span>Total</span>
            </div>
        </div>
    `).join('');
}

// Initial Icon Load
lucide.createIcons();
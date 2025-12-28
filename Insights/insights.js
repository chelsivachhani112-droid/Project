// This data would come from your bank statement analyzer
const transactions = [
  { date: '2025-07-01', desc: 'Swiggy', category: 'Food', amount: 450 },
  { date: '2025-07-03', desc: 'Netflix', category: 'Subscription', amount: 499 },
  { date: '2025-07-05', desc: 'Amazon', category: 'Shopping', amount: 1299 },
  { date: '2025-07-10', desc: 'Uber', category: 'Transport', amount: 320 },
  { date: '2025-07-15', desc: 'Netflix', category: 'Subscription', amount: 499 },
];

// ---------------- SUMMARY ----------------
const totalSpent = transactions.reduce((s, t) => s + t.amount, 0);
document.getElementById('totalSpent').innerText = `₹${totalSpent}`;

const categoryTotals = {};
transactions.forEach(t => {
  categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
});

const topCategory = Object.keys(categoryTotals)
  .reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b);

document.getElementById('topCategory').innerText = topCategory;

// ---------------- RECURRING DETECTION ----------------
const recurring = {};
transactions.forEach(t => {
  recurring[t.desc] = (recurring[t.desc] || 0) + 1;
});
const recurringCount = Object.values(recurring).filter(v => v > 1).length;
document.getElementById('recurringCount').innerText = recurringCount;

// ---------------- TRANSACTION TABLE ----------------
const table = document.getElementById('transactionTable');
transactions.forEach(t => {
  table.innerHTML += `
    <tr>
      <td>${t.date}</td>
      <td>${t.desc}</td>
      <td>${t.category}</td>
      <td>₹${t.amount}</td>
    </tr>`;
});

// ---------------- PIE CHART ----------------
new Chart(document.getElementById('categoryChart'), {
  type: 'pie',
  data: {
    labels: Object.keys(categoryTotals),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: ['#3b82f6','#8b5cf6','#f59e0b','#10b981']
    }]
  }
});

// ---------------- TREND CHART ----------------
const monthlyTrend = {};
transactions.forEach(t => {
  const month = t.date.slice(0,7);
  monthlyTrend[month] = (monthlyTrend[month] || 0) + t.amount;
});

new Chart(document.getElementById('trendChart'), {
  type: 'line',
  data: {
    labels: Object.keys(monthlyTrend),
    datasets: [{
      label: 'Spending',
      data: Object.values(monthlyTrend),
      borderColor: '#3b82f6',
      tension: 0.4
    }]
  }
});

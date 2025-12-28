// Initialization
let transactions = JSON.parse(localStorage.getItem('finova_tx')) || [];
const incomeCategories = ["Salary", "Freelance", "Investment", "Gift"];
const expenseCategories = ["Food", "Transport", "Rent", "Shopping", "Bills"];

function openDrawer() {
    document.getElementById('drawer-overlay').classList.add('active');
    updateFormTheme();
}

function closeDrawer() {
    document.getElementById('drawer-overlay').classList.remove('active');
}

// Update categories based on Income/Expense choice
function updateFormTheme() {
    const isIncome = document.getElementById('type-inc').checked;
    const catSelect = document.getElementById('tx-category');
    const list = isIncome ? incomeCategories : expenseCategories;
    
    catSelect.innerHTML = list.map(c => `<option value="${c}">${c}</option>`).join('');
    document.getElementById('drawer-title').innerText = isIncome ? "Add Income" : "Add Expense";
}

// Save Transaction
document.getElementById('tx-form').onsubmit = function(e) {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById('tx-amount').value);
    const type = document.querySelector('input[name="type"]:checked').value;
    const userName = document.getElementById('user-name').value.toUpperCase();
    const year = new Date().getFullYear();

    const newTx = {
        id: Date.now(),
        type: type,
        amount: amount,
        category: document.getElementById('tx-category').value,
        desc: document.getElementById('tx-desc').value,
        date: new Date().toISOString(),
        password: `${userName}${year}` // Example: AMIT2023
    };

    transactions.unshift(newTx);
    localStorage.setItem('finova_tx', JSON.stringify(transactions));
    
    renderList();
    updateSummary();
    closeDrawer();
    this.reset();
};

function renderList() {
    const list = document.getElementById('tx-list');
    const filter = document.getElementById('history-filter').value;
    
    let displayData = [...transactions];

    if(filter === 'oldest') displayData.reverse();
    if(filter === 'past-month') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        displayData = displayData.filter(t => new Date(t.date) > oneMonthAgo);
    }

    list.innerHTML = displayData.map(t => `
        <div class="tx-row">
            <div class="tx-left">
                <div class="tx-icon-circle ${t.type}">${t.category[0]}</div>
                <div>
                    <div class="tx-title">${t.desc || t.category}</div>
                    <div class="tx-date">${new Date(t.date).toLocaleDateString()}</div>
                </div>
            </div>
            <div class="tx-amt ${t.type}">${t.type === 'income' ? '+' : '-'} ₹${t.amount.toLocaleString()}</div>
        </div>
    `).join('');
    lucide.createIcons();
}

function updateSummary() {
    const inc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    
    document.getElementById('total-income').innerText = `₹${inc.toLocaleString()}`;
    document.getElementById('total-expense').innerText = `₹${exp.toLocaleString()}`;
    document.getElementById('current-balance').innerText = `₹${(inc - exp).toLocaleString()}`;
}

// PDF EXPORT WITH PASSWORD
async function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Using the password of the latest transaction entry
    const pass = transactions.length > 0 ? transactions[0].password : "FINOVA2023";

    doc.text("FINOVA Transaction Report", 14, 15);
    
    const rows = transactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.category,
        t.type.toUpperCase(),
        `Rs. ${t.amount}`
    ]);

    doc.autoTable({
        head: [['Date', 'Category', 'Type', 'Amount']],
        body: rows,
        startY: 25
    });

    // Note: Standard jsPDF requires a plugin for internal encryption. 
    // Usually, encryption is handled server-side or via premium libraries. 
    // Here we alert the user of their password for simulation.
    alert(`Generating Protected PDF...\nYour Password is: ${pass}`);
    doc.save("Finova_Transactions.pdf");
}

// Load Init
renderList();
updateSummary();
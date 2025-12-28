/**
 * FINOVA AI Coach Logic
 */

const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const suggestions = document.getElementById('suggestions-box');

// AI Response Database
const responses = {
    food: "You're spending about ₹12,000/month on food. If you reduce restaurant visits by just 25%, you'd save ₹3,000 monthly!",
    vacation: "You've saved ₹45,000 out of your ₹75,000 goal. At this rate, you'll reach it in 3 months (October 2024).",
    expense: "Your biggest expenses this month: \n1. Rent (35%)\n2. Food (22%)\n3. Shopping (18%). Shopping is 5% higher than usual.",
    save: "Your current savings rate is 32%. To hit 40%, try canceling that unused Gym membership and switching phone plans."
};

function addMessage(text, sender) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${sender}`;
    
    msgDiv.innerHTML = `
        ${sender === 'ai' ? '<div class="bot-label"><i data-lucide="brain"></i> AI Coach</div>' : ''}
        <p>${text.replace(/\n/g, '<br>')}</p>
        <span class="time">${time}</span>
    `;
    
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    lucide.createIcons();
}

function handleResponse(query) {
    const q = query.toLowerCase();
    let reply = "I'm analyzing your data... I can help with spending, goals, and savings. Could you be more specific?";

    if (q.includes('food') || q.includes('dining')) reply = responses.food;
    if (q.includes('vacation') || q.includes('goal')) reply = responses.vacation;
    if (q.includes('expense')) reply = responses.expense;
    if (q.includes('save') || q.includes('savings')) reply = responses.save;

    setTimeout(() => addMessage(reply, 'ai'), 600);
}

function processUserMessage() {
    const text = userInput.value.trim();
    if (!text) return;
    
    addMessage(text, 'user');
    userInput.value = '';
    suggestions.style.display = 'none'; // Hide suggestions after first interaction
    handleResponse(text);
}

function sendQuick(text) {
    userInput.value = text;
    processUserMessage();
}

// Event Listeners
sendBtn.onclick = processUserMessage;
userInput.onkeypress = (e) => { if (e.key === 'Enter') processUserMessage(); };

// Initialize
document.getElementById('current-time').innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
lucide.createIcons();
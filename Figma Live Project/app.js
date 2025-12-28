// Initialize Lucide icons
lucide.createIcons();

// Theme Toggle Logic
const themeBtn = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeBtn.querySelector('i');

themeBtn.addEventListener('click', () => {
    const isDark = body.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        body.removeAttribute('data-theme');
        icon.setAttribute('data-lucide', 'moon');
    } else {
        body.setAttribute('data-theme', 'dark');
        icon.setAttribute('data-lucide', 'sun');
    }
    
    // Refresh icons because we changed the attribute
    lucide.createIcons();
});

// Smooth Scroll for buttons (Placeholder)
document.querySelectorAll('button.btn-gradient').forEach(btn => {
    btn.addEventListener('click', () => {
        alert("Redirecting to Get Started flow...");
    });
});

// Register Service Worker for PWA/offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').catch(() => {
            // silent failure
        });
    });
}

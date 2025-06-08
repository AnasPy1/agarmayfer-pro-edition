// Dark mode toggle for all pages
(function() {
    const DARK_CLASS = 'dark-mode';
    const STORAGE_KEY = 'agarmay-fer-dark-mode';
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    function setDarkMode(on) {
        if (on) {
            root.classList.add(DARK_CLASS);
            localStorage.setItem(STORAGE_KEY, '1');
        } else {
            root.classList.remove(DARK_CLASS);
            localStorage.setItem(STORAGE_KEY, '0');
        }
    }
    function getSavedMode() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === '1') return true;
        if (saved === '0') return false;
        return prefersDark;
    }
    function setupButton() {
        let btn = document.getElementById('darkModeToggle');
        if (!btn) return;
        btn.addEventListener('click', function() {
            const isDark = root.classList.toggle(DARK_CLASS);
            localStorage.setItem(STORAGE_KEY, isDark ? '1' : '0');
            btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }
    // On load
    if (getSavedMode()) {
        root.classList.add(DARK_CLASS);
    }
    window.addEventListener('DOMContentLoaded', setupButton);
})();

// Authentication frontend removed

// User authentication UI logic

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    // Remove old login link if present
    const oldLogin = navLinks.querySelector('a[href*="login.html"]');
    if (oldLogin) oldLogin.parentElement.remove();

    // Create new user menu button
    const userLi = document.createElement('li');
    userLi.className = 'user-menu';
    userLi.innerHTML = `
        <button id="userMenuBtn" style="background:none; border:none; cursor:pointer; font-size:1.3rem; color:var(--secondary-color); display:flex; align-items:center;">
            <i class="fas fa-circle-user"></i>
            <span id="userMenuName" style="margin-left:0.5em;"></span>
            <i class="fas fa-chevron-down" style="margin-left:0.3em;"></i>
        </button>
        <div id="userDropdown" class="user-dropdown" style="display:none; position:absolute; right:0; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.15); border-radius:8px; min-width:180px; z-index:1000;">
        </div>
    `;
    navLinks.appendChild(userLi);

    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    const userMenuName = document.getElementById('userMenuName');

    function showDropdown(contentHtml) {
        userDropdown.innerHTML = contentHtml;
        userDropdown.style.display = 'block';
    }
    function hideDropdown() {
        userDropdown.style.display = 'none';
    }

    function renderMenu() {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user) {
            userMenuName.textContent = user.name.split(' ')[0];
            showDropdown(`
                <a href="profile.html" style="display:block;padding:12px 16px;text-decoration:none;color:#222;">Profil</a>
                <a href="#" id="ordersLink" style="display:block;padding:12px 16px;text-decoration:none;color:#222;">Commandes</a>
                <a href="#" id="logoutBtn" style="display:block;padding:12px 16px;text-decoration:none;color:#c00;">Déconnexion</a>
            `);
            document.getElementById('logoutBtn').onclick = function() {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.reload();
            };
            document.getElementById('ordersLink').onclick = function() {
                alert('Historique des commandes à venir !');
            };
        } else {
            userMenuName.textContent = '';
            showDropdown(`
                <a href="pages/login.html" style="display:block;padding:12px 16px;text-decoration:none;color:#222;">Se connecter</a>
                <a href="pages/register.html" style="display:block;padding:12px 16px;text-decoration:none;color:#222;">Créer un compte</a>
            `);
        }
    }

    userMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (userDropdown.style.display === 'block') {
            hideDropdown();
        } else {
            renderMenu();
        }
    });
    document.addEventListener('click', function(e) {
        if (!userDropdown.contains(e.target) && e.target !== userMenuBtn) {
            hideDropdown();
        }
    });

    // If user is logged in, show their name
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
        userMenuName.textContent = user.name.split(' ')[0];
    }
});

// Basic authentication placeholder - authentication system removed
// This file is maintained for compatibility but auth features are disabled

window.authManager = {
    // Dummy methods to prevent errors in existing code
    isAuthenticated: () => false,
    isAdmin: () => false,
    requireAuth: () => true,
    requireAdmin: () => true,
    showMessage: (message, type) => {
        console.log(`${type}: ${message}`);
    },
    getTranslation: (key, fallback) => {
        const lang = localStorage.getItem('language') || 'fr';
        return (window.translations && window.translations[lang] && window.translations[lang][key]) || fallback;
    }
};

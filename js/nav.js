// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.createElement('button');
    burgerMenu.className = 'burger-menu';
    burgerMenu.setAttribute('aria-label', 'Toggle menu');
    burgerMenu.innerHTML = '<i class="fas fa-bars"></i>';

    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');

    // Insert burger menu after logo
    const logo = navbar.querySelector('.logo');
    logo.parentNode.insertBefore(burgerMenu, logo.nextSibling);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    header.appendChild(overlay);

    // Toggle menu
    function toggleMenu() {
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }

    burgerMenu.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 991 && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });
});

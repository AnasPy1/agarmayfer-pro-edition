// ENHANCED MOBILE NAVIGATION - BULLETPROOF VERSION
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Initializing mobile navigation...');
    
    // Get navigation elements with fallback
    const mobileMenuToggle = document.getElementById('mobileMenuToggle') || document.querySelector('.mobile-menu-toggle');
    const navLinks = document.getElementById('navLinks') || document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    const body = document.body;

    // Error checking and debugging
    if (!mobileMenuToggle) {
        console.error('❌ Mobile menu toggle not found! Looking for #mobileMenuToggle or .mobile-menu-toggle');
        return;
    }

    if (!navLinks) {
        console.error('❌ Navigation links not found! Looking for #navLinks or .nav-links');
        return;
    }

    console.log('✅ Mobile navigation elements found successfully');
    console.log('📱 Toggle element:', mobileMenuToggle);
    console.log('📋 Nav links element:', navLinks);

    // Add debug attribute for CSS
    mobileMenuToggle.setAttribute('data-debug', 'true');

    // Create overlay for mobile menu with error handling
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
        console.log('✅ Created navigation overlay');
    }

    // Initialize mobile menu state
    let isMenuOpen = false;

    // Main toggle function with enhanced error handling
    function toggleMobileMenu(forceClose = false) {
        try {
            console.log('🔄 Toggling mobile menu, current state:', isMenuOpen);
            
            if (isMenuOpen || forceClose) {
                // Close menu
                navLinks.classList.remove('mobile-active');
                mobileMenuToggle.classList.remove('active');
                overlay.classList.remove('active');
                body.classList.remove('menu-open');
                isMenuOpen = false;
                console.log('✅ Menu closed');
            } else {
                // Open menu
                navLinks.classList.add('mobile-active');
                mobileMenuToggle.classList.add('active');
                overlay.classList.add('active');
                body.classList.add('menu-open');
                isMenuOpen = true;
                console.log('✅ Menu opened');
            }
            
            // Force display update
            navLinks.style.display = 'flex';
            
        } catch (error) {
            console.error('❌ Error toggling mobile menu:', error);
        }
    }

    // Enhanced click handler for mobile menu toggle
    mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🖱️ Mobile menu toggle clicked');
        toggleMobileMenu();
    });

    // Touch event support for better mobile responsiveness
    mobileMenuToggle.addEventListener('touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('👆 Mobile menu toggle touched');
        toggleMobileMenu();
    });

    // Close menu when clicking overlay
    overlay.addEventListener('click', function() {
        console.log('🖱️ Overlay clicked - closing menu');
        toggleMobileMenu(true);
    });

    // Ensure overlay is behind the menu
    overlay.style.zIndex = '9998';
    navLinks.style.zIndex = '9999';

    // Close menu when clicking navigation links (inside #navLinks only)
    const navLinksElements = navLinks.querySelectorAll('a');
    navLinksElements.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            // Only prevent default if it's a hash link
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
            }
            if (isMenuOpen) {
                setTimeout(() => {
                    toggleMobileMenu(true);
                }, 150);
            }
        });
    });

    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            console.log('⌨️ Escape key pressed - closing menu');
            toggleMobileMenu(true);
        }
        
        // Tab navigation handling
        if (e.key === 'Tab' && isMenuOpen) {
            const focusableElements = navLinks.querySelectorAll('a, select, button');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });

    // Handle window resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768 && isMenuOpen) {
                console.log('🖥️ Screen resized to desktop - closing mobile menu');
                toggleMobileMenu(true);
            }
        }, 250);
    });

    // Enhanced navbar scroll effects
    let lastScrollTop = 0;
    let scrollTimeout;
    
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (navbar) {
                if (scrollTop > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
            
            lastScrollTop = scrollTop;
        }, 10);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                console.log('🔗 Smooth scrolling to:', targetId);
            }
        });
    });

    // Accessibility improvements
    mobileMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.setAttribute('role', 'button');
    
    navLinks.setAttribute('aria-hidden', 'true');
    
    // Update aria attributes when menu toggles
    const originalToggle = toggleMobileMenu;
    toggleMobileMenu = function(forceClose = false) {
        originalToggle(forceClose);
        
        mobileMenuToggle.setAttribute('aria-expanded', isMenuOpen ? 'true' : 'false');
        navLinks.setAttribute('aria-hidden', isMenuOpen ? 'false' : 'true');
    };

    // Focus management
    mobileMenuToggle.addEventListener('click', function() {
        if (isMenuOpen) {
            // Focus first navigation link when menu opens
            setTimeout(() => {
                const firstLink = navLinks.querySelector('a');
                if (firstLink) firstLink.focus();
            }, 100);
        }
    });

    // Check if elements are properly styled (debugging)
    setTimeout(() => {
        const toggleStyle = window.getComputedStyle(mobileMenuToggle);
        const navStyle = window.getComputedStyle(navLinks);
        
        console.log('🔍 Mobile Menu Toggle Styles:');
        console.log('  - Display:', toggleStyle.display);
        console.log('  - Visibility:', toggleStyle.visibility);
        console.log('  - Z-index:', toggleStyle.zIndex);
        
        console.log('🔍 Navigation Links Styles:');
        console.log('  - Position:', navStyle.position);
        console.log('  - Right:', navStyle.right);
        console.log('  - Z-index:', navStyle.zIndex);
        
        // Force show hamburger menu on mobile
        if (window.innerWidth <= 768) {
            mobileMenuToggle.style.display = 'flex !important';
            console.log('📱 Forced hamburger menu visibility on mobile');
        }
    }, 500);

    // Success message
    console.log('🎉 Mobile navigation initialized successfully!');
    console.log('📱 Ready for mobile interaction');
    
    // Global function for external access
    window.toggleMobileMenu = toggleMobileMenu;
    
    // Expose debugging functions
    window.debugNav = {
        toggle: mobileMenuToggle,
        links: navLinks,
        overlay: overlay,
        isOpen: () => isMenuOpen,
        forceOpen: () => toggleMobileMenu(false),
        forceClose: () => toggleMobileMenu(true)
    };
});

// Additional safety net - force initialization if DOM is already loaded
if (document.readyState === 'loading') {
    console.log('⏳ Waiting for DOM to load...');
} else {
    console.log('✅ DOM already loaded, navigation should be ready');
}

// API endpoints
const API_BASE_URL = 'http://192.168.1.2:400/api';

// Function to fetch products from the backend
async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Function to fetch featured products
async function fetchFeaturedProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products/featured`);
        if (!response.ok) {
            throw new Error('Failed to fetch featured products');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return [];
    }
}

// Function to create product cards
function createProductCard(product) {
    // Use _id for MongoDB compatibility
    const productId = product._id || product.id;
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <button onclick="addToCart('${productId}')" class="add-to-cart">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Function to load featured products
async function loadFeaturedProducts() {
    const productsContainer = document.getElementById('featured-products');
    if (productsContainer) {
        const products = await fetchFeaturedProducts();
        productsContainer.innerHTML = products
            .map(product => createProductCard(product))
            .join('');
    }
}

// Shopping cart functionality
async function addToCart(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product details');
        }
        const product = await response.json();
        
        // Use the enhanced cart system
        if (window.enhancedCart) {
            window.enhancedCart.addToCart(product);
        } else if (window.cartFunctions) {
            window.cartFunctions.addToCart(product);
        } else {
            // Fallback if cart systems are not loaded
            console.error('Cart system not available');
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
        if (window.enhancedCart) {
            // Enhanced cart will handle this automatically
        } else if (window.cartFunctions && window.cartFunctions.showNotification) {
            window.cartFunctions.showNotification('Failed to add product to cart', 'error');
        }
    }
}

// Translation functionality
let currentLanguage = localStorage.getItem('language') || 'fr';

function initializeLanguage() {
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
    document.documentElement.setAttribute('dir', currentLanguage === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLanguage);
    translatePage();
}

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    translatePage();
    window.dispatchEvent(new Event('languageChanged'));
}

function translatePage() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });

    // Update dynamic content
    updateProductTranslations();
}

function updateProductTranslations() {
    const featuredProductsContainer = document.getElementById('featured-products');
    if (featuredProductsContainer) {
        // Clear and reload products with translated content
        featuredProductsContainer.innerHTML = '';
        loadFeaturedProducts();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
    initializeLanguage();

    // Cart link is always available
    const cartLink = document.querySelector('a[href*="cart.html"]');
    if (cartLink) {
        cartLink.style.display = '';
    }
});

// Scroll to Top functionality
document.addEventListener('DOMContentLoaded', function() {
    const scrollBtn = document.getElementById('scrollToTop');
    
    if (scrollBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        // Smooth scroll to top
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Mobile Navigation - Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuToggle && navLinks) {
        // Toggle mobile menu
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-active');
            mobileMenuToggle.classList.toggle('active');
        });

        // Close menu when clicking on menu items
        const menuLinks = document.querySelectorAll('.nav-links a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-active');
                mobileMenuToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navLinks.classList.remove('mobile-active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
});

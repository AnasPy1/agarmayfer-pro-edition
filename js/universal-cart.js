/**
 * Universal Cart System - Agarmay Fer
 * Fully functional cart system that works across all pages
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        STORAGE_KEY: 'agarmay_cart',
        NOTIFICATION_DURATION: 3000,
        AUTO_SAVE: true,
        CURRENCY: '$',
        TAX_RATE: 0.08,
        FREE_SHIPPING_THRESHOLD: 500,
        SHIPPING_COST: 25
    };

    // Cart state
    let cart = [];
    let isInitialized = false;

    // Sample products for testing
    const SAMPLE_PRODUCTS = [
        {
            id: 'steel-beam-001',
            name: 'H-Beam 200x200mm',
            description: 'High-strength structural H-beam, ideal for heavy construction',
    
            category: 'structural',
            image: 'https://images.unsplash.com/photo-1562259924-9c4d3d25dcbb?w=400&h=300&fit=crop',
            inStock: true,
            weight: '50kg'
        },
        {
            id: 'steel-beam-002',
            name: 'Steel I-Beam IPE 240',
            description: 'Standard IPE 240 I-beam for structural applications',
    
            category: 'structural',
            image: 'https://images.unsplash.com/photo-1558618047-3c8c76d2407a?w=400&h=300&fit=crop',
            inStock: true,
            weight: '30kg'
        },
        {
            id: 'rebar-001',
            name: 'Reinforcement Steel Bar Bundle',
            description: 'Grade 60 reinforcement steel bars, 16mm diameter',
    
            category: 'reinforcement',
            image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
            inStock: true,
            weight: '25kg'
        },
        {
            id: 'channel-001',
            name: 'Steel Channel 100x50mm',
            description: 'Hot-rolled steel channel for structural applications',
    
            category: 'structural',
            image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&h=300&fit=crop',
            inStock: true,
            weight: '15kg'
        },
        {
            id: 'pipe-001',
            name: 'Steel Pipe 100mm Diameter',
            description: 'Heavy duty steel pipe for construction and plumbing',
    
            category: 'pipes',
            image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400&h=300&fit=crop',
            inStock: true,
            weight: '20kg'
        },
        {
            id: 'sheet-001',
            name: 'Steel Sheet 4x8 ft',
            description: 'High-quality steel sheet for industrial applications',
    
            category: 'sheets',
            image: 'https://images.unsplash.com/photo-1534294668821-28a3054f4256?w=400&h=300&fit=crop',
            inStock: true,
            weight: '40kg'
        }
    ];

    // Initialize cart system
    function initializeCart() {
        if (isInitialized) return;
        
        loadCartFromStorage();
        ensureCartUI();
        bindEvents();
        updateCartDisplay();
        isInitialized = true;
        
        console.log('🛒 Universal Cart System initialized');
    }

    // Load cart from localStorage
    function loadCartFromStorage() {
        try {
            const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
            cart = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            cart = [];
        }
    }

    // Save cart to localStorage
    function saveCartToStorage() {
        if (!CONFIG.AUTO_SAVE) return;
        
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(cart));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    }

    // Ensure cart UI elements exist
    function ensureCartUI() {
        ensureCartIcon();
        ensureCartSidebar();
    }

    // Ensure cart icon in navigation
    function ensureCartIcon() {
        if (document.getElementById('cartIcon')) return;
        
        const navLinks = document.querySelector('.nav-links, .navbar ul');
        if (!navLinks) return;
        
        const cartIconLi = document.createElement('li');
        cartIconLi.innerHTML = `
            <div class="cart-icon" id="cartIcon">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-count" id="cartCount">0</span>
            </div>
        `;
        
        // Insert before language selector or at the end
        const langSelector = navLinks.querySelector('.language-selector');
        if (langSelector) {
            navLinks.insertBefore(cartIconLi, langSelector);
        } else {
            navLinks.appendChild(cartIconLi);
        }
    }

    // Ensure cart sidebar exists
    function ensureCartSidebar() {
        if (document.getElementById('cartSidebar')) return;
        
        const cartSidebar = document.createElement('div');
        cartSidebar.className = 'cart-sidebar';
        cartSidebar.id = 'cartSidebar';
        cartSidebar.innerHTML = `
            <div class="cart-header">
                <h2>Shopping Cart</h2>
                <button class="close-cart" id="closeCart">&times;</button>
            </div>
            <div class="cart-items" id="cartItems"></div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span>Total:</span>
                    <span id="cartTotal">${CONFIG.CURRENCY}0.00</span>
                </div>
                <button class="checkout-btn" id="checkoutBtn">Checkout</button>
            </div>
        `;
        document.body.appendChild(cartSidebar);
    }

    // Bind events
    function bindEvents() {
        // Cart icon click
        const cartIcon = document.getElementById('cartIcon');
        if (cartIcon) {
            cartIcon.addEventListener('click', toggleCartSidebar);
        }

        // Close cart button
        const closeCart = document.getElementById('closeCart');
        if (closeCart) {
            closeCart.addEventListener('click', toggleCartSidebar);
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', proceedToCheckout);
        }

        // Close cart when clicking outside
        document.addEventListener('click', handleOutsideClick);

        // Handle page unload
        window.addEventListener('beforeunload', saveCartToStorage);
    }

    // Handle clicks outside cart
    function handleOutsideClick(event) {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartIcon = document.getElementById('cartIcon');
        
        if (cartSidebar && cartSidebar.classList.contains('active')) {
            if (!cartSidebar.contains(event.target) && !cartIcon?.contains(event.target)) {
                toggleCartSidebar();
            }
        }
    }

    // Toggle cart sidebar
    function toggleCartSidebar() {
        const cartSidebar = document.getElementById('cartSidebar');
        if (!cartSidebar) return;
        
        cartSidebar.classList.toggle('active');
        
        if (cartSidebar.classList.contains('active')) {
            updateCartDisplay();
        }
    }

    // Update cart display
    function updateCartDisplay() {
        updateCartCount();
        updateCartItems();
        updateCartTotal();
    }

    // Update cart count badge
    function updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (!cartCount) return;
        
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }

    // Update cart items list
    function updateCartItems() {
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="${getProductsPagePath()}" class="continue-shopping-btn">Continue Shopping</a>
                </div>
            `;
            return;
        }
        
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
    
                    <div class="cart-item-quantity">
                        <button onclick="UniversalCart.updateQuantity('${item.id}', ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button onclick="UniversalCart.updateQuantity('${item.id}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button onclick="UniversalCart.removeFromCart('${item.id}')" class="remove-item" title="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    // Update cart total
    function updateCartTotal() {
        const cartTotal = document.getElementById('cartTotal');
        if (!cartTotal) return;
        
        const total = calculateCartTotal();
        cartTotal.textContent = `${CONFIG.CURRENCY}${total.toFixed(2)}`;
    }

    // Calculate cart total
    function calculateCartTotal() {
        return 0; // Price removed - cart total is no longer calculated
    }

    // Get products page path based on current location
    function getProductsPagePath() {
        const path = window.location.pathname;
        if (path.includes('/pages/')) {
            return 'products.html';
        }
        return 'pages/products.html';
    }

    // Add product to cart
    function addToCart(product) {
        // Handle both product object and product ID
        if (typeof product === 'string') {
            product = getProductById(product);
            if (!product) {
                showNotification('Product not found', 'error');
                return false;
            }
        }

        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1,
                dateAdded: new Date().toISOString()
            });
        }
        
        saveCartToStorage();
        updateCartDisplay();
        showNotification(`${product.name} added to cart!`, 'success');
        
        // Auto-open cart for a moment
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar && !cartSidebar.classList.contains('active')) {
            toggleCartSidebar();
            setTimeout(() => {
                if (cartSidebar.classList.contains('active')) {
                    // Don't auto-close if user is interacting
                }
            }, 2000);
        }
        
        return true;
    }

    // Update item quantity
    function updateQuantity(productId, newQuantity) {
        newQuantity = parseInt(newQuantity);
        
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            saveCartToStorage();
            updateCartDisplay();
            showNotification('Cart updated!', 'success');
        }
    }

    // Remove item from cart
    function removeFromCart(productId) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            const item = cart[itemIndex];
            cart.splice(itemIndex, 1);
            saveCartToStorage();
            updateCartDisplay();
            showNotification(`${item.name} removed from cart!`, 'info');
        }
    }

    // Clear entire cart
    function clearCart() {
        cart = [];
        saveCartToStorage();
        updateCartDisplay();
        showNotification('Cart cleared!', 'info');
    }

    // Get product by ID (including sample products)
    function getProductById(productId) {
        // First check if window.products exists (from products.js)
        if (window.products && Array.isArray(window.products)) {
            const product = window.products.find(p => (p.id || p._id) === productId);
            if (product) return product;
        }
        
        // Fallback to sample products
        return SAMPLE_PRODUCTS.find(p => p.id === productId);
    }

    // Show notification
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.cart-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, CONFIG.NOTIFICATION_DURATION);
    }

    // Get notification icon
    function getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    // Proceed to checkout
    function proceedToCheckout() {
        if (cart.length === 0) {
            showNotification('Your cart is empty', 'error');
            return;
        }
        
        // Redirect to checkout page
        window.location.href = getCheckoutPagePath();
    }



    // Get cart page path
    function getCartPagePath() {
        const path = window.location.pathname;
        if (path.includes('/pages/')) {
            return 'cart.html';
        }
        return 'pages/cart.html';
    }

    // Get checkout page path
    function getCheckoutPagePath() {
        const path = window.location.pathname;
        if (path.includes('/pages/')) {
            return 'checkout.html';
        }
        return 'pages/checkout.html';
    }

    // Calculate cart summary
    function getCartSummary() {
        return {
            subtotal: 0,
            shipping: 0,
            tax: 0,
            total: 0,
            itemCount: cart.reduce((total, item) => total + item.quantity, 0)
        };
    }

    // Public API
    window.UniversalCart = {
        // Core functions
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        
        // Display functions
        toggleCartSidebar,
        updateCartDisplay,
        
        // Utility functions
        getCart: () => [...cart],
        getCartSummary,
        getCartTotal: calculateCartTotal,
        getCartItemsCount: () => cart.reduce((total, item) => total + item.quantity, 0),
        
        // Sample data
        getSampleProducts: () => [...SAMPLE_PRODUCTS],
        
        // Admin functions
        loadSampleProducts: () => {
            window.products = [...SAMPLE_PRODUCTS];
            console.log('📦 Sample products loaded');
        }
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCart);
    } else {
        initializeCart();
    }

    // Also initialize on window load (for dynamic content)
    window.addEventListener('load', () => {
        if (!isInitialized) {
            initializeCart();
        }
    });

    console.log('🛒 Universal Cart System loaded');

})(); 
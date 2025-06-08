// Enhanced Cart System - Universal Implementation
// This script automatically detects and enhances any page with cart functionality

(function() {
    'use strict';

    // Cart state
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Initialize cart system on any page
    function initializeUniversalCart() {
        addCartIconToNavigation();
        addCartSidebar();
        bindCartEvents();
        updateCartCount();
        
        // Auto-update cart every 2 seconds for cross-tab sync
        setInterval(syncCartAcrossTabs, 2000);
    }

    // Add cart icon to navigation if it doesn't exist
    function addCartIconToNavigation() {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && !document.getElementById('cartIcon')) {
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
    }

    // Add cart sidebar to page if it doesn't exist
    function addCartSidebar() {
        if (!document.getElementById('cartSidebar')) {
            const cartSidebar = document.createElement('div');
            cartSidebar.className = 'cart-sidebar';
            cartSidebar.id = 'cartSidebar';
            cartSidebar.innerHTML = `
                <div class="cart-header">
                    <h2>Shopping Cart</h2>
                    <button class="close-cart" id="closeCart">&times;</button>
                </div>
                <div class="cart-items" id="cartItems">
                    <!-- Cart items will be loaded dynamically -->
                    <div class="empty-cart" style="display: none;">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                        <a href="pages/products.html" class="continue-shopping-btn">Continue Shopping</a>
                    </div>
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <span>Total:</span>
                        <span id="cartTotal">$0.00</span>
                    </div>
                    <button class="checkout-btn" id="checkoutBtn" style="display: none;">Checkout</button>
                </div>
            `;
            document.body.appendChild(cartSidebar);
        }
    }

    // Bind cart events
    function bindCartEvents() {
        const cartIcon = document.getElementById('cartIcon');
        const closeCart = document.getElementById('closeCart');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (cartIcon) {
            cartIcon.removeEventListener('click', toggleCart);
            cartIcon.addEventListener('click', toggleCart);
        }

        if (closeCart) {
            closeCart.removeEventListener('click', toggleCart);
            closeCart.addEventListener('click', toggleCart);
        }

        if (checkoutBtn) {
            checkoutBtn.removeEventListener('click', proceedToCheckout);
            checkoutBtn.addEventListener('click', proceedToCheckout);
        }

        // Close cart when clicking outside
        document.removeEventListener('click', handleOutsideClick);
        document.addEventListener('click', handleOutsideClick);
    }

    // Handle clicks outside cart
    function handleOutsideClick(event) {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartIcon = document.getElementById('cartIcon');
        
        if (cartSidebar && cartSidebar.classList.contains('active')) {
            if (!cartSidebar.contains(event.target) && !cartIcon.contains(event.target)) {
                toggleCart();
            }
        }
    }

    // Toggle cart sidebar
    function toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar) {
            cartSidebar.classList.toggle('active');
            if (cartSidebar.classList.contains('active')) {
                updateCartDisplay();
            }
        }
    }

    // Update cart count
    function updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    // Update cart display
    function updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (!cartItems) return;

        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="${getCurrentPath()}products.html" class="continue-shopping-btn">Continue Shopping</a>
                </div>
            `;
            
            if (cartTotal) cartTotal.textContent = '$0.00';
            if (checkoutBtn) checkoutBtn.style.display = 'none';
            return;
        }

        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-quantity">
                        <button onclick="enhancedCart.updateQuantity('${item.id}', ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <span>${item.quantity}</span>
                        <button onclick="enhancedCart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button onclick="enhancedCart.removeFromCart('${item.id}')" class="remove-item" title="Remove item">&times;</button>
            `;
            
            cartItems.appendChild(cartItem);
        });

        if (cartTotal) cartTotal.textContent = 'Contact for Quote';
        if (checkoutBtn) checkoutBtn.style.display = 'block';
    }

    // Get current path for relative links
    function getCurrentPath() {
        const path = window.location.pathname;
        if (path.includes('/pages/')) {
            return '';
        }
        return 'pages/';
    }

    // Add to cart
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        saveCart();
        updateCartCount();
        updateCartDisplay();
        showNotification('Product added to cart!', 'success');
        
        if (!document.getElementById('cartSidebar').classList.contains('active')) {
            toggleCart();
        }
    }

    // Update quantity
    function updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            saveCart();
            updateCartCount();
            updateCartDisplay();
            showNotification('Cart updated!', 'success');
        }
    }

    // Remove from cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartCount();
        updateCartDisplay();
        showNotification('Item removed from cart!', 'info');
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Sync cart across tabs
    function syncCartAcrossTabs() {
        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        if (JSON.stringify(currentCart) !== JSON.stringify(cart)) {
            cart = currentCart;
            updateCartCount();
            updateCartDisplay();
        }
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.cart-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Proceed to checkout
    function proceedToCheckout() {
        if (cart.length === 0) {
            showNotification('Your cart is empty', 'error');
            return;
        }
        
        window.location.href = getCurrentPath() + 'cart.html';
    }

    // Public API
    window.enhancedCart = {
        addToCart,
        updateQuantity,
        removeFromCart,
        toggleCart,
        getCartTotal: () => 0, // Price removed - contact for quote
        getCartItemsCount: () => cart.reduce((total, item) => total + item.quantity, 0)
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeUniversalCart);
    } else {
        initializeUniversalCart();
    }

    // Re-initialize if page is dynamically loaded
    window.addEventListener('load', initializeUniversalCart);

})(); 
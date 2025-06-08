// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const cartIcon = document.getElementById('cartIcon');
const cartCount = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const closeCart = document.getElementById('closeCart');
const checkoutBtn = document.getElementById('checkoutBtn');

// Initialize cart
function initializeCart() {
    updateCartCount();
    updateCartDisplay();
    
    // Event listeners
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCart);
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', toggleCart);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', function(event) {
        if (cartSidebar && cartSidebar.classList.contains('active')) {
            if (!cartSidebar.contains(event.target) && !cartIcon.contains(event.target)) {
                toggleCart();
            }
        }
    });
}

// Toggle cart sidebar
function toggleCart() {
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
        
        // Update display when opening cart
        if (cartSidebar.classList.contains('active')) {
            updateCartDisplay();
        }
    }
}

// Update cart count
function updateCartCount() {
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Show/hide cart count badge
        if (totalItems > 0) {
            cartCount.style.display = 'block';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

// Update cart display
function updateCartDisplay() {
    if (!cartItems) return;
    
    const emptyCart = cartItems.querySelector('.empty-cart');
    
    if (cart.length === 0) {
        // Show empty cart message
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="pages/products.html" class="continue-shopping-btn">Continue Shopping</a>
            </div>
        `;
        
        if (cartTotal) {
            cartTotal.textContent = '$0.00';
        }
        
        if (checkoutBtn) {
            checkoutBtn.style.display = 'none';
        }
        return;
    }
    
    // Clear items container
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
                    <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button onclick="removeFromCart('${item.id}')" class="remove-item" title="Remove item">&times;</button>
        `;
        
        cartItems.appendChild(cartItem);
    });

    if (cartTotal) {
        cartTotal.textContent = 'Contact for Quote';
    }

    // Show checkout button when cart has items
    if (checkoutBtn) {
        checkoutBtn.style.display = 'block';
    }
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
    
    // Show notification
    showNotification('Product added to cart!', 'success');
    
    // Auto-open cart briefly to show the item was added
    if (!cartSidebar.classList.contains('active')) {
        toggleCart();
        setTimeout(() => {
            if (cartSidebar.classList.contains('active')) {
                // Don't auto-close if user is still interacting with cart
            }
        }, 2000);
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

// Clear cart
function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showNotification('Cart cleared!', 'info');
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
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
    }, 3000);
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    // Redirect to cart page or checkout process
    window.location.href = 'pages/cart.html';
}

// Get cart total
function getCartTotal() {
    return 0; // Price removed - contact for quote
}

// Get cart items count
function getCartItemsCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Export functions for use in other scripts
window.cartFunctions = {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    toggleCart
};

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCart); 
// Products Management System - Agarmay Fer
// Updated to work with MongoDB stock structure

let products = [];
let currentPage = 1;
const productsPerPage = 12;
let filteredProducts = [];

// Sample products for immediate functionality
const SAMPLE_PRODUCTS = [
    {
        id: 'steel-beam-001',
        name: 'H-Beam 200x200mm',
        description: 'High-strength structural H-beam, ideal for heavy construction',

        category: 'structural',
        image: 'https://images.unsplash.com/photo-1562259924-9c4d3d25dcbb?w=400&h=300&fit=crop',
        stock: 50,
        weight: '50kg'
    },
    {
        id: 'steel-beam-002',
        name: 'Steel I-Beam IPE 240',
        description: 'Standard IPE 240 I-beam for structural applications',

        category: 'structural',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76d2407a?w=400&h=300&fit=crop',
        stock: 30,
        weight: '30kg'
    },
    {
        id: 'rebar-001',
        name: 'Reinforcement Steel Bar Bundle',
        description: 'Grade 60 reinforcement steel bars, 16mm diameter',

        category: 'reinforcement',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
        stock: 100,
        weight: '25kg'
    },
    {
        id: 'channel-001',
        name: 'Steel Channel 100x50mm',
        description: 'Hot-rolled steel channel for structural applications',

        category: 'structural',
        image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&h=300&fit=crop',
        stock: 75,
        weight: '15kg'
    },
    {
        id: 'pipe-001',
        name: 'Steel Pipe 100mm Diameter',
        description: 'Heavy duty steel pipe for construction and plumbing',

        category: 'pipes',
        image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400&h=300&fit=crop',
        stock: 60,
        weight: '20kg'
    },
    {
        id: 'sheet-001',
        name: 'Steel Sheet 4x8 ft',
        description: 'High-quality steel sheet for industrial applications',

        category: 'sheets',
        image: 'https://images.unsplash.com/photo-1534294668821-28a3054f4256?w=400&h=300&fit=crop',
        stock: 25,
        weight: '40kg'
    },
    {
        id: 'angle-001',
        name: 'Steel Angle 50x50x5mm',
        description: 'Hot-rolled steel angle for structural connections',
        category: 'structural',
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
        stock: 120,
        weight: '12kg'
    },
    {
        id: 'plate-001',
        name: 'Steel Plate 10mm Thick',
        description: 'Heavy duty steel plate for industrial applications',
        category: 'sheets',
        image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop',
        stock: 35,
        weight: '35kg'
    },
    {
        id: 'tube-001',
        name: 'Square Steel Tube 50x50mm',
        description: 'Hollow structural steel tube for construction',
        category: 'pipes',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        stock: 80,
        weight: '18kg'
    },
    {
        id: 'wire-001',
        name: 'Steel Wire Mesh 2x2m',
        description: 'Galvanized steel wire mesh for reinforcement',

        category: 'reinforcement',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76d2407a?w=400&h=300&fit=crop',
        stock: 200,
        weight: '8kg'
    },
    {
        id: 'bolt-001',
        name: 'Steel Bolt Set M16x100',
        description: 'High-strength steel bolts with nuts and washers',

        category: 'hardware',
        image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400&h=300&fit=crop',
        stock: 500,
        weight: '2kg'
    },
    {
        id: 'rod-001',
        name: 'Threaded Steel Rod M20',
        description: 'Galvanized threaded steel rod for construction',

        category: 'hardware',
        image: 'https://images.unsplash.com/photo-1562259924-9c4d3d25dcbb?w=400&h=300&fit=crop',
        stock: 150,
        weight: '5kg'
    }
];

// Helper function to check if product is in stock
function isInStock(product) {
    // Handle both database structure (stock) and sample structure (inStock)
    if (typeof product.stock === 'number') {
        return product.stock > 0;
    }
    if (typeof product.inStock === 'boolean') {
        return product.inStock;
    }
    return false;
}

// Helper function to get stock display text
function getStockText(product) {
    if (typeof product.stock === 'number') {
        if (product.stock === 0) return 'Out of Stock';
        if (product.stock <= 10) return `Only ${product.stock} left`;
        return `${product.stock} in stock`;
    }
    if (typeof product.inStock === 'boolean') {
        return product.inStock ? 'In Stock' : 'Out of Stock';
    }
    return 'Stock Unknown';
}

// Fetch products from backend or use sample products
async function fetchProducts() {
    try {
        // Try to fetch from API first
        const apiUrl = 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/products`);
        
        if (!response.ok) {
            throw new Error('API not available');
        }
        
        const fetchedProducts = await response.json();
        
        // Normalize products from database to ensure consistency
        products = fetchedProducts.map(product => ({
            ...product,
            // Ensure we have an ID field (MongoDB uses _id)
            id: product._id || product.id,
            // Ensure we have required fields with defaults
            name: product.name || 'Unknown Product',
            category: product.category || 'uncategorized',
            description: product.description || 'No description available',
            image: product.image || 'https://via.placeholder.com/400x300?text=No+Image',
            stock: typeof product.stock === 'number' ? product.stock : 0
        }));
        
        console.log('📦 Products loaded from API:', products.length, 'products');
        console.log('📦 Sample product:', products[0]);
    } catch (error) {
        console.log('📦 API not available, using sample products');
        console.log('Error:', error.message);
        // Use sample products as fallback with stock field
        products = SAMPLE_PRODUCTS.map(product => ({
            ...product,
            stock: product.inStock ? 50 : 0 // Convert inStock to numeric stock
        }));
    }
    
    // Make products available globally
    window.products = products;
    
    filteredProducts = [...products];
    displayProducts();
    updatePagination();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    fetchProducts();
});

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', handleSearch);
    
    // Filter handlers
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) categoryFilter.addEventListener('change', handleFilters);

    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) sortFilter.addEventListener('change', handleSort);
    
    // Pagination handlers
    const prevPage = document.getElementById('prevPage');
    if (prevPage) prevPage.addEventListener('click', () => changePage(-1));
    const nextPage = document.getElementById('nextPage');
    if (nextPage) nextPage.addEventListener('click', () => changePage(1));
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    filterProducts();
}

function handleFilters() {
    filterProducts();
}

function handleSort() {
    const sortValue = document.getElementById('sortFilter').value;
    sortProducts(sortValue);
    displayProducts();
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const category = document.getElementById('categoryFilter')?.value || '';
    
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || product.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    currentPage = 1;
    displayProducts();
    updatePagination();
}



function sortProducts(sortValue) {
    switch(sortValue) {
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            filteredProducts.sort((a, b) => a.id.localeCompare(b.id));
    }
}

// Product translations
const productTranslations = {
    "productNames": {
        "H-Beam 200x200mm": {
            "fr": "Poutre en H 200x200mm",
            "ar": "عارضة H 200x200 مم"
        },
        "Steel I-Beam IPE 240": {
            "fr": "Poutre en I IPE 240",
            "ar": "عارضة I فولاذية IPE 240"
        },
        "Reinforcement Steel Bar Bundle": {
            "fr": "Lot de Barres d'Armature en Acier",
            "ar": "حزمة قضبان حديد التسليح"
        },
        "Steel Channel 100x50mm": {
            "fr": "Profilé en U 100x50mm",
            "ar": "قناة فولاذية 100x50 مم"
        }
    },
    "productDescriptions": {
        "High-strength structural H-beam, ideal for heavy construction": {
            "fr": "Poutre en H structurelle haute résistance, idéale pour la construction lourde",
            "ar": "عارضة H هيكلية عالية القوة، مثالية للبناء الثقيل"
        },
        "Standard IPE 240 I-beam for structural applications": {
            "fr": "Poutre en I IPE 240 standard pour applications structurelles",
            "ar": "عارضة I قياسية IPE 240 للتطبيقات الهيكلية"
        },
        "Grade 60 reinforcement steel bars, 16mm diameter": {
            "fr": "Barres d'armature en acier Grade 60, diamètre 16mm",
            "ar": "قضبان حديد تسليح درجة 60، قطر 16 مم"
        },
        "Hot-rolled steel channel for structural applications": {
            "fr": "Profilé en U en acier laminé à chaud pour applications structurelles",
            "ar": "قناة فولاذية مدرفلة على الساخن للتطبيقات الهيكلية"
        }
    }
};

// Function to get translated product text
function getProductTranslation(text, type) {
    if (typeof productTranslations === 'undefined') {
        return text;
    }
    
    const currentLang = localStorage.getItem('language') || 'en';
    if (currentLang === 'en') return text;
    
    const translations = type === 'name' ? 
        productTranslations.productNames[text] : 
        productTranslations.productDescriptions[text];
    
    return translations && translations[currentLang] ? translations[currentLang] : text;
}

// Display products with enhanced cart integration
function displayProducts() {
    const productsGrid = document.getElementById('products-grid');
    
    if (!productsGrid) {
        console.error('Products grid element not found');
        return;
    }
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);
    
    productsGrid.innerHTML = currentProducts.map(product => {
        const inStock = isInStock(product);
        const stockText = getStockText(product);
        
        return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${!inStock ? '<div class="out-of-stock-badge">Out of Stock</div>' : ''}
            </div>
            <div class="product-info">
                <h3>${getProductTranslation(product.name, 'name')}</h3>
                <p class="product-description">${getProductTranslation(product.description, 'description')}</p>
                <div class="product-details">
                    <span class="product-category">${product.category}</span>
                    ${product.weight ? `<span class="product-weight">${product.weight}</span>` : ''}
                </div>
                <div class="product-stock">
                    <span class="stock-indicator ${inStock ? 'in-stock' : 'out-of-stock'}">
                        <i class="fas ${inStock ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        ${stockText}
                    </span>
                </div>

                <button 
                    onclick="addProductToCart('${product.id}')" 
                    class="add-to-cart-btn ${!inStock ? 'disabled' : ''}"
                    ${!inStock ? 'disabled' : ''}
                >
                    <i class="fas fa-shopping-cart"></i>
                    ${inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
        `;
    }).join('');
}

function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const pageNumbers = document.getElementById('pageNumbers');
    
    if (pageNumbers) {
        let pagesHtml = '';
        for (let i = 1; i <= totalPages; i++) {
            pagesHtml += `
                <button class="page-number ${i === currentPage ? 'active' : ''}"
                        onclick="goToPage(${i})">${i}</button>
            `;
        }
        pageNumbers.innerHTML = pagesHtml;
    }
    
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    
    if (prevPage) prevPage.disabled = currentPage === 1;
    if (nextPage) nextPage.disabled = currentPage === totalPages;
}

function changePage(delta) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const newPage = currentPage + delta;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        displayProducts();
        updatePagination();
        
        // Scroll to top of products
        const productsGrid = document.getElementById('products-grid');
        if (productsGrid) {
            productsGrid.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function goToPage(page) {
    currentPage = page;
    displayProducts();
    updatePagination();
    
    // Scroll to top of products
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        productsGrid.scrollIntoView({ behavior: 'smooth' });
    }
}

// Enhanced add to cart functionality
function addProductToCart(productId) {
    const product = products.find(p => p.id === productId || p._id === productId);
    
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    if (!isInStock(product)) {
        if (window.UniversalCart) {
            window.UniversalCart.showNotification('Product is out of stock', 'error');
        }
        return;
    }
    
    // Use Universal Cart System
    if (window.UniversalCart) {
        const success = window.UniversalCart.addToCart(product);
        
        if (success) {
            // Add visual feedback to the button
            const button = document.querySelector(`[data-product-id="${productId}"] .add-to-cart-btn`);
            if (button) {
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Added!';
                button.classList.add('added');
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.classList.remove('added');
                }, 2000);
            }
        }
    } else {
        console.error('Universal Cart System not available');
    }
}

// Legacy support for old cart systems
function addToCart(productId) {
    addProductToCart(productId);
}

// Quick view functionality
function quickViewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Create quick view modal
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="quick-view-content">
            <button class="close-modal">&times;</button>
            <div class="quick-view-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="quick-view-details">
                <h2>${product.name}</h2>
                <p class="description">${product.description}</p>
                <div class="product-specs">
                    <span class="category">Category: ${product.category}</span>
                    ${product.weight ? `<span class="weight">Weight: ${product.weight}</span>` : ''}
                </div>

                <button onclick="addProductToCart('${product.id}')" class="add-to-cart-btn">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal events
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Export functions for global use
window.ProductsManager = {
    addProductToCart,
    quickViewProduct,
    getProducts: () => [...products],
    getSampleProducts: () => [...SAMPLE_PRODUCTS],
    filterProducts,
    sortProducts
};

console.log('📦 Products Manager loaded with', products.length, 'products');

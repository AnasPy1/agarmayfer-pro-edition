// SVG Placeholder Generator for Missing Images
class PlaceholderGenerator {
    static generateSVG(width = 400, height = 300, text = "Product Image", color = "#E5E7EB") {
        return `data:image/svg+xml;charset=UTF-8,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='${encodeURIComponent(color)}' /%3E%3Ctext x='50%25' y='50%25' font-size='18' fill='%23374151' text-anchor='middle' dy='.3em'%3E${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`;
    }

    static generateProductPlaceholder(productName) {
        const colors = [
            "#F3F4F6", "#E5E7EB", "#D1D5DB", "#F9FAFB", 
            "#F0F9FF", "#EFF6FF", "#FEFCE8", "#F0FDF4"
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        return this.generateSVG(400, 300, productName, randomColor);
    }

    static generateCategoryPlaceholder(categoryName) {
        const colors = {
            "Structural Steel": "#1E40AF",
            "Reinforcement Steel": "#DC2626", 
            "Pipes & Tubes": "#059669",
            "Steel Sheets": "#7C3AED"
        };
        const color = colors[categoryName] || "#6B7280";
        return this.generateSVG(600, 400, categoryName, color);
    }

    static generateBannerPlaceholder(text = "Hero Banner") {
        return this.generateSVG(1200, 400, text, "#1F2937");
    }

    // Replace missing images with placeholders
    static replaceMissingImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Check if image fails to load
            img.onerror = function() {
                const alt = this.alt || 'Placeholder';
                
                // Determine placeholder type based on src path
                if (this.src.includes('/products/')) {
                    this.src = PlaceholderGenerator.generateProductPlaceholder(alt);
                } else if (this.src.includes('/categories/')) {
                    this.src = PlaceholderGenerator.generateCategoryPlaceholder(alt);
                } else if (this.src.includes('/banners/')) {
                    this.src = PlaceholderGenerator.generateBannerPlaceholder(alt);
                } else {
                    this.src = PlaceholderGenerator.generateSVG(400, 300, alt);
                }
            };
            
            // Trigger error check for existing broken images
            if (this.complete && this.naturalHeight === 0) {
                this.onerror();
            }
        });
    }
}

// Initialize placeholder system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    PlaceholderGenerator.replaceMissingImages();
    
    // Also run when new images are added dynamically
    const observer = new MutationObserver(() => {
        PlaceholderGenerator.replaceMissingImages();
    });
    
    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlaceholderGenerator;
} 
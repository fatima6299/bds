// Hero Slider 
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.prev-slide');
        this.nextBtn = document.querySelector('.next-slide');
        this.currentSlide = 0;
        this.interval = 5000; // 5 seconds
        this.slideInterval;
        
        this.init();
    }
    
    init() {
        // Show first slide
        this.showSlide(this.currentSlide);
        
        // Auto slide
        this.startSlideShow();
        
        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Pause on hover
        const slider = document.querySelector('.hero-slider');
        slider.addEventListener('mouseenter', () => this.pauseSlideShow());
        slider.addEventListener('mouseleave', () => this.startSlideShow());
        
        // Touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            this.pauseSlideShow();
        }, false);
        
        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
            this.startSlideShow();
        }, false);
    }
    
    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide and activate corresponding dot
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(this.currentSlide);
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(this.currentSlide);
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.showSlide(this.currentSlide);
    }
    
    startSlideShow() {
        this.slideInterval = setInterval(() => this.nextSlide(), this.interval);
    }
    
    pauseSlideShow() {
        clearInterval(this.slideInterval);
    }
    
    handleSwipe() {
        const SWIPE_THRESHOLD = 50; // Minimum distance to consider it a swipe
        
        if (touchStartX - touchEndX > SWIPE_THRESHOLD) {
            // Swipe left - next slide
            this.nextSlide();
        } else if (touchEndX - touchStartX > SWIPE_THRESHOLD) {
            // Swipe right - previous slide
            this.prevSlide();
        }
    }
}

// Featured Products
class FeaturedProducts {
    constructor() {
        this.productsContainer = document.querySelector('.featured-grid');
        this.products = [
            {
                id: 1,
                name: 'Abaya Noire Élégante',
                category: 'Abayas',
                price: 45000,
                originalPrice: 60000,
                image: 'images/abaya1.jpg',
                isNew: true,
                discount: 25
            },
            {
                id: 2,
                name: 'Costume Classique Homme',
                category: 'Vêtements Homme',
                price: 75000,
                image: 'images/costume.jpg',
                isNew: true
            },
            {
                id: 3,
                name: 'MacBook Air M1',
                category: 'Ordinateurs',
                price: 650000,
                originalPrice: 750000,
                image: 'images/macbook.jpg',
                discount: 13
            },
            {
                id: 4,
                name: 'Montre Connectée Pro',
                category: 'Montres',
                price: 85000,
                image: 'images/montre.jpg',
                isNew: true
            }
        ];
        
        this.init();
    }
    
    init() {
        this.renderProducts();
        this.addEventListeners();
    }
    
    renderProducts() {
        this.productsContainer.innerHTML = this.products.map(product => `
            <div class="product-card" data-id="${product.id}">
                ${product.isNew ? '<span class="product-badge">Nouveau</span>' : ''}
                ${product.discount ? `<span class="product-badge" style="background: #ff4757;">-${product.discount}%</span>` : ''}
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">${this.formatPrice(product.price)} FCFA</span>
                        ${product.originalPrice ? `<span class="original-price">${this.formatPrice(product.originalPrice)} FCFA</span>` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="add-to-cart" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Ajouter
                        </button>
                        <button class="add-to-wishlist" data-id="${product.id}">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    addEventListeners() {
        // Add to cart
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('button').dataset.id;
                this.addToCart(productId);
            });
        });
        
        // Add to wishlist
        document.querySelectorAll('.add-to-wishlist').forEach(button => {
            button.addEventListener('click', (e) => {
                const button = e.target.closest('button');
                const productId = button.dataset.id;
                this.toggleWishlist(button, productId);
            });
        });
    }
    
    addToCart(productId) {
        // Here you would typically add the product to the cart
        console.log(`Added product ${productId} to cart`);
        
        // Show notification
        this.showNotification('Produit ajouté au panier');
        
        // Update cart count
        this.updateCartCount();
    }
    
    toggleWishlist(button, productId) {
        button.classList.toggle('active');
        const icon = button.querySelector('i');
        
        if (button.classList.contains('active')) {
            icon.classList.remove('far');
            icon.classList.add('fas', 'text-danger');
            this.showNotification('Ajouté aux favoris');
        } else {
            icon.classList.remove('fas', 'text-danger');
            icon.classList.add('far');
        }
    }
    
    updateCartCount() {
        const countElements = document.querySelectorAll('.cart-count, .cart-count-floating');
        let currentCount = parseInt(countElements[0].textContent) || 0;
        const newCount = currentCount + 1;
        
        countElements.forEach(element => {
            element.textContent = newCount;
            element.style.display = 'flex';
        });
    }
    
    showNotification(message) {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .notification {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%) translateY(100px);
                    background: #4CAF50;
                    color: white;
                    padding: 15px 25px;
                    border-radius: 4px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 1000;
                    opacity: 0;
                    transition: all 0.3s ease;
                }
                
                .notification.show {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Update notification content
        notification.textContent = message;
        notification.classList.add('show');
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize hero slider if it exists on the page
    if (document.querySelector('.hero-slider')) {
        new HeroSlider();
    }
    
    // Initialize featured products if the container exists
    if (document.querySelector('.featured-grid')) {
        new FeaturedProducts();
    }
});

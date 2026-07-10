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
            this.handleSwipe(touchStartX, touchEndX);
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
    
    handleSwipe(touchStartX, touchEndX) {
        const SWIPE_THRESHOLD = 50;
        
        if (touchStartX - touchEndX > SWIPE_THRESHOLD) {
            this.nextSlide();
        } else if (touchEndX - touchStartX > SWIPE_THRESHOLD) {
            this.prevSlide();
        }
    }
}

// Featured Products - NOUVELLE VERSION AVEC API
class FeaturedProducts {
    constructor() {
        this.productsContainer = document.querySelector('.featured-grid');
        this.products = [];
        this.init();
    }
    
    async init() {
        await this.loadProducts();
        this.renderProducts();
        this.addEventListeners();
    }
    
    async loadProducts() {
        try {
            // Charger depuis l'API backend
            const response = await Products.getAll();
            // Prendre les 4 premiers produits pour la section featured
            this.products = (response.products || []).slice(0, 4);
        } catch (error) {
            console.error('Erreur chargement produits featured:', error);
            // Fallback sur des données par défaut
            this.products = this.getDefaultProducts();
        }
    }
    
    getDefaultProducts() {
        return [
            {
                id: 1,
                name: 'Abaya Noire Élégante',
                category: 'Abayas',
                price: 45000,
                oldPrice: 60000,
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
                oldPrice: 750000,
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
    }
    
    renderProducts() {
        if (!this.productsContainer) return;
        
        this.productsContainer.innerHTML = this.products.map(product => {
            const price = product.price || product.discounted_price || 0;
            const oldPrice = product.oldPrice || (product.price > product.discounted_price ? product.price : null);
            const discount = product.discount || product.discount_percent || 0;
            const image = product.images?.[0] || product.image_url || product.image || 'images/placeholder.jpg';
            
            return `
                <div class="product-card" data-id="${product.id}">
                    ${product.isNew ? '<span class="product-badge">Nouveau</span>' : ''}
                    ${discount > 0 ? `<span class="product-badge" style="background: #ff4757;">-${discount}%</span>` : ''}
                    <img src="${image}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-price">
                            <span class="current-price">${this.formatPrice(price)} FCFA</span>
                            ${oldPrice ? `<span class="original-price">${this.formatPrice(oldPrice)} FCFA</span>` : ''}
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
            `;
        }).join('');
    }
    
    addEventListeners() {
        // Add to cart
        document.querySelectorAll('.featured-grid .add-to-cart').forEach(button => {
            button.addEventListener('click', async (e) => {
                const productId = e.target.closest('button').dataset.id;
                await this.addToCart(productId);
            });
        });
        
        // Add to wishlist
        document.querySelectorAll('.featured-grid .add-to-wishlist').forEach(button => {
            button.addEventListener('click', (e) => {
                const button = e.target.closest('button');
                const productId = button.dataset.id;
                this.toggleWishlist(button, productId);
            });
        });
    }
    
    async addToCart(productId) {
        // Vérifier si l'utilisateur est connecté
        if (!Auth.isAuthenticated()) {
            this.showNotification('Veuillez vous connecter pour ajouter au panier', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }
        
        try {
            // Ajouter au panier via l'API
            await Cart.add(productId, 1);
            this.showNotification('Produit ajouté au panier !', 'success');
            this.updateCartCount();
        } catch (error) {
            console.error('Erreur:', error);
            this.showNotification('Erreur lors de l\'ajout au panier', 'error');
        }
    }
    
    toggleWishlist(button, productId) {
        button.classList.toggle('active');
        const icon = button.querySelector('i');
        
        if (button.classList.contains('active')) {
            icon.classList.remove('far');
            icon.classList.add('fas', 'text-danger');
            this.showNotification('Ajouté aux favoris', 'success');
        } else {
            icon.classList.remove('fas', 'text-danger');
            icon.classList.add('far');
        }
    }
    
    async updateCartCount() {
        try {
            const cartData = await Cart.get();
            const countElements = document.querySelectorAll('.cart-count, .cart-count-floating');
            const newCount = cartData.count || 0;
            
            countElements.forEach(element => {
                element.textContent = newCount;
                element.style.display = newCount > 0 ? 'flex' : 'none';
            });
        } catch (error) {
            console.error('Erreur mise à jour panier:', error);
        }
    }
    
    showNotification(message, type = 'success') {
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
            
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
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    z-index: 10000;
                    opacity: 0;
                    transition: all 0.3s ease;
                }
                .notification.show {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
                .notification.warning {
                    background: #ff9800;
                }
                .notification.error {
                    background: #f44336;
                }
            `;
            document.head.appendChild(style);
        }
        
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.classList.add('show');
        
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
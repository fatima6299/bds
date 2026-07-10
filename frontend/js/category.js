// Gestion des pages de catégories
class CategoryPage {
    constructor(categoryName) {
        this.categoryName = categoryName;
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.productGrid = document.getElementById('categoryProductGrid');
        this.init();
    }

    async init() {
        this.showLoading();
        await this.loadCategoryProducts();
        this.setupEventListeners();
        this.displayProducts();
        this.updateCartDisplay();
    }

    showLoading() {
        if (this.productGrid) {
            this.productGrid.innerHTML = `
                <div class="loading-container">
                    <div class="spinner"></div>
                    <p>Chargement des produits...</p>
                </div>
            `;
        }
    }

    async loadCategoryProducts() {
        try {
            console.log('Chargement des produits pour la catégorie:', this.categoryName);
            
            // Charger les produits de cette catégorie depuis l'API
            const response = await Products.getAll({ category: this.categoryName });
            this.products = response.products || [];
            this.filteredProducts = [...this.products];
            
            console.log(`${this.products.length} produits chargés pour la catégorie "${this.categoryName}"`);
            
            // Mettre à jour le compteur
            this.updateProductCount();
        } catch (error) {
            console.error('Erreur chargement produits:', error);
            this.showError();
        }
    }

    showError() {
        if (this.productGrid) {
            this.productGrid.innerHTML = `
                <div class="error-container">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #f44336;"></i>
                    <p>Erreur lors du chargement des produits</p>
                    <button onclick="location.reload()" class="btn-retry">Réessayer</button>
                </div>
            `;
        }
    }

    updateProductCount() {
        const countElement = document.getElementById('productCount');
        if (countElement) {
            countElement.textContent = this.filteredProducts.length;
        }
    }

    displayProducts() {
        if (!this.productGrid) return;

        if (this.filteredProducts.length === 0) {
            this.productGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-box-open" style="font-size: 48px; color: #ccc;"></i>
                    <p>Aucun produit disponible dans cette catégorie pour le moment</p>
                    <a href="../index.html" class="btn-back">Retour à l'accueil</a>
                </div>
            `;
            return;
        }

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        this.productGrid.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');
        this.updatePagination();
        this.attachProductEvents();
    }

    createProductCard(product) {
        const price = product.price || product.discounted_price || 0;
        const oldPrice = product.oldPrice || (product.price && product.discount_percent > 0 ? product.price : null);
        const discount = product.discount || product.discount_percent || 0;
        const image = product.images?.[0] || product.image_url || '../images/placeholder.jpg';
        const rating = product.rating || 0;
        const reviews = product.reviews || 0;

        return `
            <div class="product-card" data-id="${product.id}">
                ${discount > 0 ? `<span class="product-badge discount">-${discount}%</span>` : ''}
                ${product.isNew ? '<span class="product-badge new">Nouveau</span>' : ''}
                <div class="product-image-container">
                    <img src="${image}" alt="${product.name}" class="product-image" loading="lazy" onerror="this.src='../images/placeholder.jpg'">
                    <div class="product-overlay">
                        <button class="quick-view-btn" data-id="${product.id}">
                            <i class="fas fa-eye"></i> Voir détails
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    ${rating > 0 ? `
                        <div class="product-rating">
                            ${this.generateStars(rating)}
                            <span class="rating-count">(${reviews})</span>
                        </div>
                    ` : ''}
                    ${product.description ? `<p class="product-description">${product.description.substring(0, 80)}...</p>` : ''}
                    <div class="product-price">
                        <span class="current-price">${this.formatPrice(price)} FCFA</span>
                        ${oldPrice && oldPrice > price ? `<span class="original-price">${this.formatPrice(oldPrice)} FCFA</span>` : ''}
                    </div>
                    ${product.sizes && product.sizes.length > 0 ? `
                        <div class="product-sizes">
                            <span>Tailles : ${product.sizes.join(', ')}</span>
                        </div>
                    ` : ''}
                    ${product.colors && product.colors.length > 0 ? `
                        <div class="product-colors">
                            <span>Couleurs : ${product.colors.length}</span>
                        </div>
                    ` : ''}
                    ${product.stock === 0 ? '<p class="out-of-stock">Rupture de stock</p>' : product.stock < 10 ? `<p class="low-stock">Plus que ${product.stock} en stock</p>` : ''}
                    <div class="product-actions">
                        <button class="add-to-cart-btn" data-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i> Ajouter au panier
                        </button>
                        <button class="add-to-wishlist-btn" data-id="${product.id}">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        return stars;
    }

    attachProductEvents() {
        // Boutons "Ajouter au panier"
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const productId = e.currentTarget.dataset.id;
                await this.addToCart(productId);
            });
        });

        // Boutons "Favoris"
        document.querySelectorAll('.add-to-wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.toggleWishlist(e.currentTarget);
            });
        });

        // Aperçu rapide
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.id;
                this.showProductDetails(productId);
            });
        });
    }

    async addToCart(productId) {
        if (!Auth.isAuthenticated()) {
            this.showNotification('Veuillez vous connecter pour ajouter au panier', 'warning');
            setTimeout(() => {
                window.location.href = '../login.html';
            }, 1500);
            return;
        }

        try {
            await Cart.add(productId, 1);
            this.showNotification('Produit ajouté au panier !', 'success');
            this.updateCartDisplay();
        } catch (error) {
            this.showNotification(error.message || 'Erreur lors de l\'ajout', 'error');
        }
    }

    toggleWishlist(button) {
        button.classList.toggle('active');
        const icon = button.querySelector('i');

        if (button.classList.contains('active')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.showNotification('Ajouté aux favoris', 'success');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
        }
    }

    showProductDetails(productId) {
        const product = this.products.find(p => p.id == productId);
        if (!product) return;
        
        // Affichage simple - vous pouvez créer un modal plus élaboré
        alert(`${product.name}\n\nPrix: ${this.formatPrice(product.price)} FCFA\n${product.description || ''}\n\nStock: ${product.stock}`);
    }

    async updateCartDisplay() {
        if (!Auth.isAuthenticated()) {
            this.setCartCount(0);
            return;
        }

        try {
            const cartData = await Cart.get();
            this.setCartCount(cartData.count || 0);
        } catch (error) {
            console.error('Erreur récupération panier:', error);
            this.setCartCount(0);
        }
    }

    setCartCount(count) {
        const countElements = document.querySelectorAll('.cart-count');
        countElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'inline' : 'none';
        });
    }

    setupEventListeners() {
        // Tri
        const sortSelect = document.getElementById('sortBy');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortProducts(e.target.value);
            });
        }

        // Filtre de prix
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.addEventListener('input', (e) => {
                const maxPriceDisplay = document.getElementById('maxPrice');
                if (maxPriceDisplay) {
                    maxPriceDisplay.textContent = this.formatPrice(e.target.value) + ' FCFA';
                }
            });
            priceRange.addEventListener('change', () => {
                this.applyPriceFilter();
            });
        }

        // Pagination
        const prevBtn = document.querySelector('.prev-page');
        const nextBtn = document.querySelector('.next-page');
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousPage());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextPage());
    }

    sortProducts(sortBy) {
        switch (sortBy) {
            case 'price_asc':
                this.filteredProducts.sort((a, b) => (a.price || a.discounted_price) - (b.price || b.discounted_price));
                break;
            case 'price_desc':
                this.filteredProducts.sort((a, b) => (b.price || b.discounted_price) - (a.price || a.discounted_price));
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'name':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                this.filteredProducts = [...this.products];
        }
        this.currentPage = 1;
        this.displayProducts();
    }

    applyPriceFilter() {
        const maxPrice = parseInt(document.getElementById('priceRange')?.value || 1000000);
        this.filteredProducts = this.products.filter(product => {
            const price = product.price || product.discounted_price || 0;
            return price <= maxPrice;
        });
        this.currentPage = 1;
        this.updateProductCount();
        this.displayProducts();
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
        const currentPageEl = document.querySelector('.current-page');
        const totalPagesEl = document.querySelector('.total-pages');
        
        if (currentPageEl) currentPageEl.textContent = this.currentPage;
        if (totalPagesEl) totalPagesEl.textContent = totalPages;

        const prevBtn = document.querySelector('.prev-page');
        const nextBtn = document.querySelector('.next-page');

        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.displayProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.displayProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
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
}

// Mise à jour de l'affichage utilisateur
function updateUserDisplay() {
    const user = Auth.getCurrentUser();
    const accountLink = document.querySelector('.account');

    if (user && accountLink) {
        accountLink.title = user.firstname + ' ' + user.lastname;
        accountLink.href = '../profile.html';
    } else if (accountLink) {
        accountLink.href = '../login.html';
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    updateUserDisplay();
});
// ==================== GESTION DES PRODUITS ====================
class ProductManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.productGrid = document.getElementById('productGrid');
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupEventListeners();
        this.displayProducts();
        this.updateCartDisplay();
    }

    async loadProducts() {
        try {
            // Charger les produits depuis l'API backend
            const response = await Products.getAll();
            this.products = response.products || [];
            this.filteredProducts = [...this.products];
            console.log(`${this.products.length} produits chargés depuis l'API`);
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
            // Fallback sur les données locales en cas d'erreur
            await this.loadLocalProducts();
        }
    }

    async loadLocalProducts() {
        try {
            const response = await fetch('data/products.json');
            const data = await response.json();
            this.products = data.products || [];
            this.filteredProducts = [...this.products];
            console.log('Produits chargés depuis le fichier local');
        } catch (error) {
            console.error('Impossible de charger les produits:', error);
        }
    }

    displayProducts() {
        if (!this.productGrid) return;

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (productsToShow.length === 0) {
            this.productGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search" style="font-size: 48px; color: #ccc;"></i>
                    <p>Aucun produit trouvé</p>
                </div>
            `;
            return;
        }

        this.productGrid.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');
        this.updatePagination();
        this.attachProductEvents();
    }

    createProductCard(product) {
        const price = product.price || product.discounted_price || 0;
        const oldPrice = product.oldPrice || product.price || null;
        const discount = product.discount || product.discount_percent || 0;
        const image = product.images?.[0] || product.image_url || 'images/placeholder.jpg';
        const rating = product.rating || 0;
        const reviews = product.reviews || 0;

        return `
            <div class="product-card" data-id="${product.id}">
                ${discount > 0 ? `<span class="product-badge discount">-${discount}%</span>` : ''}
                ${product.isNew ? '<span class="product-badge new">Nouveau</span>' : ''}
                <div class="product-image-container">
                    <img src="${image}" alt="${product.name}" class="product-image" loading="lazy">
                    <div class="product-overlay">
                        <button class="quick-view-btn" data-id="${product.id}">
                            <i class="fas fa-eye"></i> Aperçu rapide
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-title">${product.name}</h3>
                    ${rating > 0 ? `
                        <div class="product-rating">
                            ${this.generateStars(rating)}
                            <span class="rating-count">(${reviews})</span>
                        </div>
                    ` : ''}
                    <div class="product-price">
                        <span class="current-price">${this.formatPrice(price)} FCFA</span>
                        ${oldPrice && oldPrice > price ? `<span class="original-price">${this.formatPrice(oldPrice)} FCFA</span>` : ''}
                    </div>
                    ${product.stock === 0 ? '<p class="out-of-stock">Rupture de stock</p>' : ''}
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
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.id;
                this.addToCart(productId);
            });
        });

        // Boutons "Favoris"
        document.querySelectorAll('.add-to-wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.currentTarget;
                this.toggleWishlist(button);
            });
        });

        // Aperçu rapide
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.id;
                this.showQuickView(productId);
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
            this.updateCartDisplay();
        } catch (error) {
            console.error('Erreur ajout panier:', error);
            this.showNotification(error.message || 'Erreur lors de l\'ajout au panier', 'error');
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
            this.showNotification('Retiré des favoris', 'info');
        }
    }

    showQuickView(productId) {
        const product = this.products.find(p => p.id == productId);
        if (!product) return;

        // Créer ou afficher un modal avec les détails du produit
        console.log('Afficher aperçu rapide pour:', product);
        // Vous pouvez implémenter un modal ici
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
            console.error('Erreur lors de la récupération du panier:', error);
            this.setCartCount(0);
        }
    }

    setCartCount(count) {
        const countElements = document.querySelectorAll('.cart-count, .cart-count-floating');
        countElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    setupEventListeners() {
        // Recherche
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.filterProducts({ search: e.target.value });
                }, 300);
            });
        }

        // Tri
        const sortSelect = document.getElementById('sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortProducts(e.target.value);
            });
        }

        // Filtres de catégorie
        document.querySelectorAll('input[name="category"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.applyFilters();
            });
        });

        // Filtre de prix
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.addEventListener('input', (e) => {
                document.getElementById('maxPrice').textContent = this.formatPrice(e.target.value);
            });
            priceRange.addEventListener('change', () => {
                this.applyFilters();
            });
        }

        // Bouton appliquer les filtres
        const applyFiltersBtn = document.querySelector('.apply-filters');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }

        // Pagination
        const prevBtn = document.querySelector('.prev-page');
        const nextBtn = document.querySelector('.next-page');
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousPage());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextPage());

        // Panier flottant
        const cartFloating = document.querySelector('.cart-floating');
        if (cartFloating) {
            cartFloating.addEventListener('click', () => {
                window.location.href = 'cart.html';
            });
        }
    }

    filterProducts(filters = {}) {
        this.filteredProducts = this.products.filter(product => {
            // Filtre de recherche
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchesSearch = 
                    product.name.toLowerCase().includes(searchLower) ||
                    (product.description && product.description.toLowerCase().includes(searchLower)) ||
                    product.category.toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }
            return true;
        });

        this.currentPage = 1;
        this.displayProducts();
    }

    applyFilters() {
        // Récupérer les catégories sélectionnées
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
            .map(checkbox => checkbox.value);

        // Récupérer le prix max
        const maxPrice = parseInt(document.getElementById('priceRange')?.value || 1000000);

        // Récupérer les vendeurs sélectionnés
        const selectedSellers = Array.from(document.querySelectorAll('input[name="seller"]:checked'))
            .map(checkbox => checkbox.value);

        // Appliquer les filtres
        this.filteredProducts = this.products.filter(product => {
            // Filtre catégorie
            if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
                return false;
            }

            // Filtre prix
            const price = product.price || product.discounted_price || 0;
            if (price > maxPrice) {
                return false;
            }

            // Filtre vendeur
            if (selectedSellers.length > 0 && product.seller && !selectedSellers.includes(product.seller)) {
                return false;
            }

            return true;
        });

        this.currentPage = 1;
        this.displayProducts();
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
            case 'newest':
                this.filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            default:
                // featured - ordre original
                this.filteredProducts = [...this.products];
        }
        this.displayProducts();
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
        document.querySelector('.current-page').textContent = this.currentPage;
        document.querySelector('.total-pages').textContent = totalPages;

        const prevBtn = document.querySelector('.prev-page');
        const nextBtn = document.querySelector('.next-page');

        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages;
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
                    font-size: 14px;
                    font-weight: 500;
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
                .notification.info {
                    background: #2196F3;
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

// ==================== GESTION DE L'UTILISATEUR ====================
class UserManager {
    constructor() {
        this.init();
    }

    init() {
        this.updateUserDisplay();
        this.setupEventListeners();
    }

    updateUserDisplay() {
        const user = Auth.getCurrentUser();
        const accountLink = document.querySelector('.account');

        if (user && accountLink) {
            accountLink.innerHTML = `
                <i class="fas fa-user"></i>
                <span style="font-size: 12px; display: block;">${user.firstname}</span>
            `;
            accountLink.href = 'profile.html';
        }
    }

    setupEventListeners() {
        // Bouton de compte
        const accountLink = document.querySelector('.account');
        if (accountLink && !Auth.isAuthenticated()) {
            accountLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'login.html';
            });
        }
    }
}

// ==================== INITIALISATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le gestionnaire de produits
    if (document.getElementById('productGrid')) {
        window.productManager = new ProductManager();
    }

    // Initialiser le gestionnaire d'utilisateur
    window.userManager = new UserManager();

    // Toggle filtres sur mobile
    const filterToggle = document.querySelector('.filter-toggle');
    const filtersSidebar = document.querySelector('.filters-sidebar');
    
    if (filterToggle && filtersSidebar) {
        filterToggle.addEventListener('click', () => {
            filtersSidebar.classList.toggle('active');
        });
    }
});
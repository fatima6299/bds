import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Products, Cart } from '../services/apiClient';

const categoryOptions = ['Abayas', 'Vêtements Homme', 'Ordinateurs', 'Montres'];
const fallbackImage = 'images/products/computers/im3.jpeg';

function productHasVariants(product) {
  return Boolean((product.sizes && product.sizes.trim()) || (product.colors && product.colors.trim()));
}

export default function ProductsGrid() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('featured');
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(new Set(categoryOptions));
  const [priceRange, setPriceRange] = useState(1000000);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await Products.getAll();
        setAllProducts(data.products || []);
      } catch (err) {
        setError(err.message || 'Impossible de charger les produits.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const toggleCategory = (category) => {
    setSelectedCategories((current) => {
      const updated = new Set(current);
      if (updated.has(category)) {
        updated.delete(category);
      } else {
        updated.add(category);
      }
      return updated;
    });
  };

  const handlePriceChange = (event) => {
    setPriceRange(Number(event.target.value));
  };

  const clearFilters = () => {
    setSelectedCategories(new Set(categoryOptions));
    setPriceRange(1000000);
  };

  const activeFilters =
    categoryOptions.length - selectedCategories.size +
    (priceRange < 1000000 ? 1 : 0);

  useEffect(() => {
    const filtered = allProducts.filter((product) => {
      const normalizedSearch = search.toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        (product.category || '').toLowerCase().includes(normalizedSearch);

      const matchesCategory = selectedCategories.has(product.category);
      const matchesPrice = Number(product.price || 0) <= priceRange;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'price_asc') return Number(a.price) - Number(b.price);
      if (sort === 'price_desc') return Number(b.price) - Number(a.price);
      if (sort === 'newest') return Number(b.id) - Number(a.id);
      return 0;
    });

    setProducts(sorted);
  }, [allProducts, search, sort, selectedCategories, priceRange]);

  async function handleAddToCart(product) {
    if (productHasVariants(product)) {
      navigate(`/product/${product.id}`);
      return;
    }
    try {
      await Cart.add(product.id, 1);
      window.dispatchEvent(new Event('cart:update'));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <section id="products" className="products-grid">
      <div className="container products-grid-container">
        <div className={`filters-sidebar${showFilters ? ' open' : ''}`}>
          <div className="filter-header">
            <div>
              <p className="filter-title">Filtres</p>
              <span className="filter-subtitle">Affinez votre recherche par catégorie et prix.</span>
            </div>
            <button type="button" className="filter-close" onClick={() => setShowFilters(false)}>
              ×
            </button>
          </div>

          <div className="filter-section">
            <div className="filter-section-heading">
              <h3>Catégories</h3>
              <button type="button" className="clear-filters" onClick={clearFilters}>
                Réinitialiser
              </button>
            </div>
            <div className="filter-options">
              {categoryOptions.map((category) => (
                <label key={category}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.has(category)}
                    onChange={() => toggleCategory(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-section-heading">
              <h3>Prix maximum</h3>
              <span className="price-current">{priceRange.toLocaleString()} FCFA</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000000"
              step="1000"
              value={priceRange}
              onChange={handlePriceChange}
            />
            <div className="price-labels">
              <span>0</span>
              <span>1 000 000</span>
            </div>
          </div>
        </div>

        <div className="products-content">
          <div className="products-topbar">
            <div className="filter-summary">
              <button className="filter-toggle" type="button" onClick={() => setShowFilters(true)}>
                <i className="fas fa-sliders-h"></i> Filtres
              </button>
              <span className="filter-active-count">{activeFilters} filtre{activeFilters > 1 ? 's' : ''} actif{activeFilters > 1 ? 's' : ''}</span>
            </div>
            <div className="sort-by">
              <label htmlFor="sort">Trier par :</label>
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">En vedette</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="newest">Nouveautés</option>
              </select>
            </div>
          </div>

          <div className="product-search">
            <input
              type="text"
              placeholder="Rechercher des produits..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading && <div className="empty-state">Chargement des produits...</div>}
          {error && <div className="empty-state">{error}</div>}

          {!loading && !error && (
            <div className="featured-grid products-list">
              {products.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image-container">
                    <Link to={`/product/${product.id}`} className="product-image-link">
                      <img src={product.image_url || fallbackImage} alt={product.name} className="product-image" />
                    </Link>
                  </div>
                  <div className="product-info">
                    <div className="product-category">{product.category}</div>
                    <Link to={`/product/${product.id}`} className="product-title-link">
                      <h3 className="product-title">{product.name}</h3>
                    </Link>
                    <div className="product-price">
                      {Number(product.discount_percent || 0) > 0 ? (
                        <>
                          <span className="current-price">{product.price - (product.price * product.discount_percent) / 100} FCFA</span>
                          <span className="original-price">{product.price} FCFA</span>
                        </>
                      ) : (
                        <span className="current-price">{product.price} FCFA</span>
                      )}
                    </div>
                    <div className="product-actions">
                      <Link className="view-product-btn" to={`/product/${product.id}`}>
                        <i className="fas fa-eye"></i> Voir le produit
                      </Link>
                      <button
                        type="button"
                        className="view-product-btn"
                        onClick={() => handleAddToCart(product)}
                        disabled={Number(product.stock || 0) === 0}
                      >
                        <i className="fas fa-cart-plus"></i>
                        {productHasVariants(product) ? 'Options' : 'Ajouter'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {products.length === 0 && (
                <div className="empty-state">
                  <p>Aucun produit ne correspond à ces filtres.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

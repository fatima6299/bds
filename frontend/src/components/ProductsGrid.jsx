import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sampleProducts } from '../data/sampleProducts';


const categoryOptions = ['Abayas', 'Vêtements Homme', 'Ordinateurs', 'Montres'];
const vendorOptions = ['BDS FASHION', 'BDS TECH'];

export default function ProductsGrid() {
  const [products, setProducts] = useState(sampleProducts);
  const [sort, setSort] = useState('featured');
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(new Set(categoryOptions));
  const [selectedVendors, setSelectedVendors] = useState(new Set(vendorOptions));
  const [priceRange, setPriceRange] = useState(1000000);
  const [showFilters, setShowFilters] = useState(false);

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

  const toggleVendor = (vendor) => {
    setSelectedVendors((current) => {
      const updated = new Set(current);
      if (updated.has(vendor)) {
        updated.delete(vendor);
      } else {
        updated.add(vendor);
      }
      return updated;
    });
  };

  const handlePriceChange = (event) => {
    setPriceRange(Number(event.target.value));
  };

  const clearFilters = () => {
    setSelectedCategories(new Set(categoryOptions));
    setSelectedVendors(new Set(vendorOptions));
    setPriceRange(1000000);
  };

  const activeFilters =
    categoryOptions.length - selectedCategories.size +
    vendorOptions.length - selectedVendors.size +
    (priceRange < 1000000 ? 1 : 0);

  useEffect(() => {
    const filtered = sampleProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        (product.vendor || '').toLowerCase().includes(search.toLowerCase());

      const matchesCategory = selectedCategories.has(product.category);
      const matchesVendor = selectedVendors.has(product.vendor || '');
      const matchesPrice = product.discounted_price <= priceRange;

      return matchesSearch && matchesCategory && matchesVendor && matchesPrice;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'price_asc') return a.discounted_price - b.discounted_price;
      if (sort === 'price_desc') return b.discounted_price - a.discounted_price;
      if (sort === 'newest') return b.id - a.id;
      if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
      return b.id - a.id;
    });

    setProducts(sorted);
  }, [search, sort, selectedCategories, selectedVendors, priceRange]);

  return (
    <section id="products" className="products-grid">
      <div className="container products-grid-container">
        <div className={`filters-sidebar${showFilters ? ' open' : ''}`}>
          <div className="filter-header">
            <div>
              <p className="filter-title">Filtres</p>
              <span className="filter-subtitle">Affinez votre recherche par catégorie, prix et vendeur.</span>
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

          <div className="filter-section">
            <h3>Vendeurs</h3>
            <div className="filter-options">
              {vendorOptions.map((vendor) => (
                <label key={vendor}>
                  <input
                    type="checkbox"
                    checked={selectedVendors.has(vendor)}
                    onChange={() => toggleVendor(vendor)}
                  />
                  {vendor}
                </label>
              ))}
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
                <option value="rating">Mieux notés</option>
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

          <div className="featured-grid products-list">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image-container">
                  <img src={product.image_url} alt={product.name} className="product-image" />
                </div>
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3 className="product-title">{product.name}</h3>
                  <div className="product-price">
                    <span className="current-price">{product.discounted_price} FCFA</span>
                    <span className="original-price">{product.price} FCFA</span>
                  </div>
                  <div className="product-actions">
                    <Link className="view-product-btn" to={product.details_url}>
                      <i className="fas fa-eye"></i> Voir le produit
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

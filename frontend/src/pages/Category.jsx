import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Products, Cart } from '../services/apiClient';

const fallbackImages = [
  'images/products/computers/im3.jpeg',
  'images/products/computers/im2.jpeg',
  'images/products/computers/im.jpeg',
];

const categoryMeta = {
  abayas: {
    label: 'Abayas',
    description: 'Découvrez une sélection d’abayas élégants et raffinés pour chaque occasion.',
    highlights: ['Tissus premium', 'Couleurs tendance', 'Livraison rapide'],
  },
  'vetements-homme': {
    label: 'Vêtements Homme',
    description: 'Une collection de vêtements modernes, confortables et élégants pour homme.',
    highlights: ['Style urbain', 'Qualité garantie', 'Offres régulières'],
  },
  ordinateurs: {
    label: 'Ordinateurs',
    description: 'Trouvez les meilleurs ordinateurs portables et de bureau pour travailler, étudier et jouer.',
    highlights: ['Performance optimale', 'Écrans haute qualité', 'Garantie et support'],
  },
  montres: {
    label: 'Montres',
    description: 'Choisissez des montres élégantes et fonctionnelles pour tous les styles.',
    highlights: ['Design élégant', 'Précision horlogère', 'Prix compétitifs'],
  },
};

export default function Category() {
  const { category } = useParams();
  const navigate = useNavigate();
  const meta = categoryMeta[category];
  const label = meta?.label;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('all');
  const [type, setType] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    async function loadProducts() {
      if (!label) return;
      try {
        setLoading(true);
        setError('');
        const data = await Products.getAll({ category: label });
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message || 'Impossible de charger les produits.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [label]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    const filtered = products.filter((product) => {
      const matchesSearch = !normalizedSearch || [product.name, product.description, product.category]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesBrand = brand === 'all' || (product.brand || '').toLowerCase() === brand;
      const matchesType = type === 'all' || (product.type || '').toLowerCase() === type;
      const matchesStock = !onlyInStock || Number(product.stock || 0) > 0;

      let matchesPrice = true;
      if (priceFilter === 'under-500k') {
        matchesPrice = Number(product.price || 0) < 500000;
      } else if (priceFilter === '500k-800k') {
        matchesPrice = Number(product.price || 0) >= 500000 && Number(product.price || 0) <= 800000;
      } else if (priceFilter === 'above-800k') {
        matchesPrice = Number(product.price || 0) > 800000;
      }

      return matchesSearch && matchesBrand && matchesType && matchesStock && matchesPrice;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'price_asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price_desc') return Number(b.price) - Number(a.price);
      if (sortBy === 'newest') return Number(b.id) - Number(a.id);
      return 0;
    });

    return sorted;
  }, [products, search, brand, type, priceFilter, onlyInStock, sortBy]);

  function productHasVariants(product) {
    return Boolean((product.sizes && product.sizes.trim()) || (product.colors && product.colors.trim()));
  }

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

  function handleCardClick(event, productId) {
    const target = event.target;
    if (target.closest('button, a, input, select')) {
      return;
    }
    navigate(`/product/${productId}`);
  }

  if (!label) {
    return (
      <div className="container">
        <h2>Catégorie non trouvée</h2>
        <p>Cette catégorie n'existe pas.</p>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <section className="category-page">
      <div className="category-hero">
        <div className="container">
          <div className="category-hero-content">
            <span className="category-eyebrow">Collection {label}</span>
            <h1>{label}</h1>
            <p>{meta.description}</p>
            <div className="category-highlights">
              {meta.highlights.map((highlight) => (
                <span key={highlight} className="category-highlight">
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="section-header">
          <h2>{label}</h2>
          <p>Produits disponibles dans la catégorie {label}.</p>
        </div>

        <div className="category-toolbar">
          <div className="product-search">
            <input
              type="text"
              placeholder="Rechercher un ordinateur..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="category-filters">
            <select value={brand} onChange={(event) => setBrand(event.target.value)}>
              <option value="all">Toutes les marques</option>
              <option value="dell">Dell</option>
              <option value="hp">HP</option>
              <option value="lenovo">Lenovo</option>
              <option value="asus">Asus</option>
              <option value="apple">Apple</option>
            </select>

            <select value={type} onChange={(event) => setType(event.target.value)}>
              <option value="all">Tous les types</option>
              <option value="portable">Portable</option>
              <option value="bureau">Bureau</option>
              <option value="tout-en-un">Tout-en-un</option>
            </select>

            <select value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)}>
              <option value="all">Tous les prix</option>
              <option value="under-500k">Moins de 500 000 FCFA</option>
              <option value="500k-800k">500 000 à 800 000 FCFA</option>
              <option value="above-800k">Plus de 800 000 FCFA</option>
            </select>

            <label className="stock-toggle">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={() => setOnlyInStock((value) => !value)}
              />
              En stock uniquement
            </label>
          </div>

          <div className="category-sort">
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="featured">Recommandés</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="newest">Nouveautés</option>
            </select>
          </div>
        </div>

        {loading && <div className="empty-state">Chargement des produits...</div>}
        {error && <div className="empty-state">{error}</div>}

        {!loading && !error && (
          <div className="featured-grid products-list">
            {filteredProducts.map((product) => {
              return (
                <article
                  className="product-card"
                  key={product.id}
                  onClick={(event) => handleCardClick(event, product.id)}
                >
                  <div className="product-image-container">
                    <Link to={`/product/${product.id}`} className="product-image-link">
                      <img src={product.image_url || fallbackImages[0]} alt={product.name} className="product-image" />
                    </Link>
                  </div>

                  <div className="product-info">
                    <div className="product-category">{product.category}</div>
                    <Link to={`/product/${product.id}`} className="product-title-link">
                      <h3 className="product-title">{product.name}</h3>
                    </Link>
                    <p className="product-description-preview">{product.description || 'Ordinateur performant adapté à votre usage.'}</p>
                    <div className="product-meta">
                      {product.brand && <span>{product.brand}</span>}
                      {product.type && <span>{product.type}</span>}
                    </div>
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
                    <span className="product-stock">
                      {Number(product.stock || 0) > 0 ? (
                        Number(product.stock) > 5 ? 'En stock' : `Plus que ${product.stock} en stock`
                      ) : 'Rupture'}
                    </span>
                  </div>

                  <div className="product-actions">
                    <button
                      className="view-product-btn"
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={Number(product.stock || 0) === 0}
                    >
                      <i className="fas fa-cart-plus"></i>
                      {productHasVariants(product) ? 'Choisir les options' : 'Ajouter au panier'}
                    </button>
                  </div>
                </article>
              );
            })}
            {filteredProducts.length === 0 && (
              <div className="empty-state">
                <p>Aucun produit trouvé pour cette sélection.</p>
                <Link to="/" className="btn-secondary">
                  Retour à l'accueil
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

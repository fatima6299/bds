import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Products, Cart } from '../services/apiClient';

const fallbackImage = 'images/products/computers/im3.jpeg';

function productHasVariants(product) {
  return Boolean((product.sizes && product.sizes.trim()) || (product.colors && product.colors.trim()));
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function runSearch() {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const data = await Products.getAll({ search: query });
        setProducts(data.products || []);
      } catch (err) {
        // Le backend renvoie une 404 quand aucun résultat n'est trouvé
        setProducts([]);
        if (!/trouv/i.test(err.message || '')) {
          setError(err.message || 'Erreur lors de la recherche.');
        }
      } finally {
        setLoading(false);
      }
    }

    runSearch();
  }, [query]);

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
    <section className="category-page">
      <div className="container">
        <div className="section-header">
          <h2>Résultats pour « {query} »</h2>
          <p>{products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}.</p>
        </div>

        {loading && <div className="empty-state">Recherche en cours...</div>}
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
                  <p className="product-description-preview">{product.description || ''}</p>
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
                    {Number(product.stock || 0) > 0 ? 'En stock' : 'Rupture'}
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
            ))}

            {products.length === 0 && (
              <div className="empty-state">
                <p>{query ? `Aucun produit ne correspond à « ${query} ».` : 'Saisissez un terme de recherche.'}</p>
                <Link to="/" className="btn-secondary">Retour à l'accueil</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

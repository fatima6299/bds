import { Link, useParams } from 'react-router-dom';
import { sampleProducts } from '../data/sampleProducts';

export default function Product() {
  const { id } = useParams();
  const product = sampleProducts.find((item) => String(item.id) === id);

  if (!product) {
    return (
      <div className="container">
        <h2>Produit introuvable</h2>
        <p>Ce produit n'existe pas ou a été retiré.</p>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <section className="product-detail">
      <div className="container">
        <Link to="/" className="back-link">← Retour à l'accueil</Link>
        <div className="product-detail-grid">
          <div className="product-detail-image">
            <img src={product.image_url} alt={product.name} />
          </div>
          <div className="product-detail-info">
            <span className="product-category">{product.category}</span>
            <h2>{product.name}</h2>
            <div className="product-price">
              <span className="current-price">{product.discounted_price} FCFA</span>
              <span className="original-price">{product.price} FCFA</span>
            </div>
            <p className="product-description">
              Découvrez ce produit de qualité, disponible dès maintenant.
            </p>
            <div className="product-actions">
              <button className="btn-primary" type="button" disabled>
                Ajouter au panier
              </button>
              <Link to="/cart" className="btn-secondary">
                Voir le panier
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

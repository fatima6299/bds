import { Link, useParams } from 'react-router-dom';
import { sampleProducts } from '../data/sampleProducts';

const categoryLabels = {
  abayas: 'Abayas',
  'vetements-homme': 'Vêtements Homme',
  ordinateurs: 'Ordinateurs',
  montres: 'Montres',
};

export default function Category() {
  const { category } = useParams();
  const label = categoryLabels[category];
  const products = sampleProducts.filter(
    (product) => product.category.toLowerCase() === label?.toLowerCase()
  );

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
      <div className="container">
        <div className="section-header">
          <h2>{label}</h2>
          <p>Produits disponibles dans la catégorie {label}.</p>
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
          {products.length === 0 && (
            <div className="empty-state">
              <p>Aucun produit disponible dans cette catégorie pour le moment.</p>
              <Link to="/" className="btn-secondary">
                Retour à l'accueil
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

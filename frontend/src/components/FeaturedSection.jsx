export default function FeaturedSection() {
  return (
    <section className="featured-section">
      <div className="container">
        <div className="section-header">
          <h2>Produits en Vedette</h2>
          <p>Découvrez nos meilleures ventes et nouveautés</p>
        </div>
        <div className="featured-grid">
          <div className="featured-card">
            <div className="featured-image featured-image-1"></div>
            <div className="featured-content">
              <span>Collection</span>
              <h3>Abayas élégantes</h3>
            </div>
          </div>
          <div className="featured-card">
            <div className="featured-image featured-image-2"></div>
            <div className="featured-content">
              <span>Technologie</span>
              <h3>Ordinateurs performants</h3>
            </div>
          </div>
          <div className="featured-card">
            <div className="featured-image featured-image-3"></div>
            <div className="featured-content">
              <span>Offres</span>
              <h3>Réductions exclusives</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

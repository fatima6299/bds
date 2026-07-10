import { useEffect, useRef, useState } from 'react';

export default function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: 'Moussa Sow',
      role: 'Restaurant Le Bon Goût',
      location: 'Saint-Louis',
      text: 'La caisse est rapide et fiable. Mon équipe s’y est adaptée immédiatement sans formation particulière.',
    },
    {
      id: 2,
      name: 'Aminata Diallo',
      role: 'Pharmacie de la Santé',
      location: 'Thiès',
      text: 'La gestion des stocks est exactement ce dont nous avions besoin. Les niveaux sont toujours précis.',
    },
    {
      id: 3,
      name: 'Ibrahima Diop',
      role: 'Superette du Marché',
      location: 'Mbour',
      text: 'Grâce à BDS, j’ai réduit mes pertes de 40 %. La gestion est devenue un jeu d’enfant.',
    },
    {
      id: 4,
      name: 'Fatou Ndiaye',
      role: 'Salon de beauté',
      location: 'Dakar',
      text: 'Le site est simple à utiliser et nous avons gagné en visibilité immédiatement.',
    },
    {
      id: 5,
      name: 'Khadim Ba',
      role: 'Boutique de vêtements',
      location: 'Kaolack',
      text: 'Les commandes sont plus faciles à suivre et notre service client est plus réactif.',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const onScroll = () => {
      const children = Array.from(slider.children);
      const scrollLeft = slider.scrollLeft;
      let nearest = 0;
      let minDistance = Infinity;

      children.forEach((child, index) => {
        const distance = Math.abs(child.offsetLeft - scrollLeft);
        if (distance < minDistance) {
          minDistance = distance;
          nearest = index;
        }
      });

      setActiveIndex(nearest);
    };

    slider.addEventListener('scroll', onScroll, { passive: true });
    return () => slider.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToIndex = (index) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const card = slider.children[index];
    if (!card) return;

    slider.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    setActiveIndex(index);
  };

  const previous = () => scrollToIndex(Math.max(activeIndex - 1, 0));
  const next = () => scrollToIndex(Math.min(activeIndex + 1, reviews.length - 1));

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <h2>Témoignages de nos clients</h2>
          <p>Découvrez ce que nos clients disent de BDS BUSINESS et comment nos solutions facilitent leur activité.</p>
        </div>
        <div className="testimonials-slider">
          <button type="button" className="testimonial-nav testimonial-prev" onClick={previous} aria-label="Précédent">
            ‹
          </button>
          <div ref={sliderRef} className="testimonials-grid">
            {reviews.map((review) => (
              <article key={review.id} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    {review.name
                      .split(' ')
                      .map((word) => word[0])
                      .join('')}
                  </div>
                  <div>
                    <h3>{review.name}</h3>
                    <p className="testimonial-role">{review.role}</p>
                  </div>
                </div>
                <p className="testimonial-text">“{review.text}”</p>
                <div className="testimonial-footer">
                  <span className="testimonial-location">{review.location}</span>
                </div>
              </article>
            ))}
          </div>
          <button type="button" className="testimonial-nav testimonial-next" onClick={next} aria-label="Suivant">
            ›
          </button>
        </div>
        <div className="testimonial-dots">
          {reviews.map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              className={`testimonial-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => scrollToIndex(index)}
              aria-label={`Aller au témoignage ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

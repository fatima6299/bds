import { useEffect, useRef, useState } from 'react';

const slides = [
  {
    title: "Nouvelle Collection d'Abayas",
    description: "Découvrez nos dernières créations élégantes et raffinées pour toutes les occasions.",
    cta: "Voir la collection",
    href: "#categories",
    backgroundImage:
      "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('images/slide1.jpg')",
  },
  {
    title: "Équipez-vous avec BDS TECH",
    description: "Les meilleurs ordinateurs portables aux prix les plus compétitifs du marché.",
    cta: "Découvrir",
    href: "#products",
    backgroundImage:
      "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('images/slide22.jpeg')",
  },
  {
    title: "Soldes d'Été - Jusqu'à -50%",
    description: "Profitez de réductions exceptionnelles sur une sélection d'articles.",
    cta: "Voir les offres",
    href: "#products",
    backgroundImage:
      "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('images/slide3.jpg')",
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slideInterval = useRef(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    startSlideShow();
    return () => {
      clearInterval(slideInterval.current);
    };
  }, []);

  const startSlideShow = () => {
    clearInterval(slideInterval.current);
    slideInterval.current = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);
  };

  const pauseSlideShow = () => {
    clearInterval(slideInterval.current);
  };

  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  const prevSlide = () => {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0].screenX;
    pauseSlideShow();
  };

  const handleTouchEnd = (event) => {
    const touchEndX = event.changedTouches[0].screenX;
    const delta = touchStartX.current - touchEndX;

    if (delta > 50) {
      nextSlide();
    } else if (delta < -50) {
      prevSlide();
    }

    startSlideShow();
  };

  return (
    <section className="hero-section">
      <div
        className="hero-slider"
        onMouseEnter={pauseSlideShow}
        onMouseLeave={startSlideShow}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            className={`hero-slide ${index === activeSlide ? 'active' : ''}`}
            style={{ backgroundImage: slide.backgroundImage }}
          >
            <div className="hero-content">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
              <a href={slide.href} className="hero-cta">
                {slide.cta}
              </a>
            </div>
          </div>
        ))}

        <div className="slider-nav">
          <button type="button" className="prev-slide" onClick={prevSlide}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button type="button" className="next-slide" onClick={nextSlide}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              className={`dot ${index === activeSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

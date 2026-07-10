import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedSection from '../components/FeaturedSection';
import ProductsGrid from '../components/ProductsGrid';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';

export default function Home() {
  return (
    <>
      <section className="home-intro">
        <div className="container">
          <h1>Bienvenue sur BDS BUSINESS</h1>
          <p>
            Découvrez nos dernières collections, offres et produits phares.
            Cette page est publique : tout le monde peut y accéder, connecté ou non.
          </p>
        </div>
      </section>
      <Hero />
      <Categories />
      <FeaturedSection />
      <ProductsGrid />
      <Testimonials />
      <FAQ />
    </>
  );
}

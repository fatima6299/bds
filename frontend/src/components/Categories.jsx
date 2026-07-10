import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'abayas',
    title: 'Abayas',
    image: 'images/products/abayas/im.jpg',
  },
  {
    id: 'vetements-homme',
    title: 'Vêtements Homme',
    image: 'images/products/men/im2.jpeg',
  },
  {
    id: 'ordinateurs',
    title: 'Ordinateurs',
    image: 'images/products/computers/im3.jpeg',
  },
  {
    id: 'montres',
    title: 'Montres',
    image: 'images/products/watches/im.jpg',
  },
];

export default function Categories() {
  return (
    <section id="categories" className="categories-icons">
      <div className="container">
        <h2 className="section-title">Nos Catégories</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="category-card"
            >
              <div className="category-icon">
                <img src={category.image} alt={category.title} />
              </div>
              <h3>{category.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

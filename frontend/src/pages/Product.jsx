import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Products, Cart } from '../services/apiClient';

const fallbackProducts = {
  1: {
    id: 1,
    name: 'Ordinateur portable premium',
    category: 'Ordinateurs',
    description: 'Un ordinateur puissant pour travailler, étudier et créer en toute fluidité.',
    price: 600000,
    discount_percent: 10,
    stock: 8,
    brand: 'Dell',
    type: 'Portable',
    processor: 'Intel Core i7',
    ram: '16 Go',
    storage: '512 Go SSD',
    screen: '15.6 pouces',
    image_url: 'images/products/computers/im3.jpeg',
  },
  8: {
    id: 8,
    name: 'PC Samsung i7 11th Gen',
    category: 'Ordinateurs',
    description: 'PC performant avec processeur Intel i7 11e génération, SSD rapide et écran clair.',
    price: 5971185,
    discount_percent: 0,
    stock: 3,
    brand: 'Samsung',
    type: 'Portable',
    processor: 'Intel Core i7 11th Gen',
    ram: '16 Go',
    storage: '512 Go SSD',
    screen: '15.6 pouces',
    image_url: 'images/products/computers/im2.jpeg',
  },
};

function parseVariantList(value) {
  if (!value) return [];
  return value.split(',').map((entry) => entry.trim()).filter(Boolean);
}

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [variantError, setVariantError] = useState('');

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const data = await Products.getById(id);
        const currentProduct = data.product || fallbackProducts[id] || fallbackProducts[1];
        setProduct(currentProduct);
        setSelectedImage(currentProduct?.image_url || 'images/products/computers/im3.jpeg');

        const related = await Products.getAll({ category: currentProduct?.category || 'Ordinateurs' });
        setRelatedProducts((related.products || []).filter((item) => String(item.id) !== String(id)).slice(0, 3));
      } catch (err) {
        setError(err.message || 'Produit introuvable.');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    const images = [product.image_url, ...(product.images || [])].filter(Boolean);
    return images.length > 0 ? images : ['images/products/computers/im3.jpeg'];
  }, [product]);

  const sizeOptions = useMemo(() => parseVariantList(product?.sizes), [product]);
  const colorOptions = useMemo(() => parseVariantList(product?.colors), [product]);

  if (loading) {
    return <div className="container"><p>Chargement du produit...</p></div>;
  }

  if (error && !product) {
    return (
      <div className="container">
        <h2>Produit introuvable</h2>
        <p>Ce produit n'existe pas ou a été retiré.</p>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    );
  }

  async function handleAddToCart() {
    setVariantError('');

    if (sizeOptions.length > 0 && !selectedSize) {
      setVariantError('Veuillez choisir une taille avant d\'ajouter ce produit au panier.');
      return;
    }
    if (colorOptions.length > 0 && !selectedColor) {
      setVariantError('Veuillez choisir une couleur avant d\'ajouter ce produit au panier.');
      return;
    }

    try {
      await Cart.add(product.id, quantity, selectedSize, selectedColor);
      window.dispatchEvent(new Event('cart:update'));
    } catch (err) {
      setVariantError(err.message || "Erreur lors de l'ajout au panier.");
    }
  }

  return (
    <section className="product-detail">
      <div className="container">
        <Link to="/" className="back-link">← Retour à l'accueil</Link>

        <div className="product-detail-grid">
          <div className="product-detail-gallery">
            <div className="product-main-image">
              <img src={selectedImage} alt={product.name} />
            </div>
            <div className="product-thumbnails">
              {galleryImages.map((image, index) => (
                <button key={`${image}-${index}`} type="button" className="thumbnail-btn" onClick={() => setSelectedImage(image)}>
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="product-detail-info">
            <span className="product-category">{product.category}</span>
            <h2>{product.name}</h2>
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
            <p className="product-description">{product.description || 'Découvrez ce produit de qualité, disponible dès maintenant.'}</p>

            <div className="product-stock-box">
              {Number(product.stock || 0) > 0 ? (
                Number(product.stock) > 5 ? 'En stock' : `Plus que ${product.stock} en stock`
              ) : 'Rupture de stock'}
            </div>

            <div className="product-specs">
              {product.brand && <p><strong>Marque :</strong> {product.brand}</p>}
              {product.type && <p><strong>Type :</strong> {product.type}</p>}
              {product.processor && <p><strong>Processeur :</strong> {product.processor}</p>}
              {product.ram && <p><strong>RAM :</strong> {product.ram}</p>}
              {product.storage && <p><strong>Stockage :</strong> {product.storage}</p>}
              {product.screen && <p><strong>Écran :</strong> {product.screen}</p>}
              {product.state && <p><strong>État :</strong> {product.state}</p>}
            </div>

            {sizeOptions.length > 0 && (
              <div className="variant-selector">
                <label htmlFor="size">Taille *</label>
                <select id="size" value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)}>
                  <option value="">Choisir une taille</option>
                  {sizeOptions.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}

            {colorOptions.length > 0 && (
              <div className="variant-selector">
                <label htmlFor="color">Couleur *</label>
                <select id="color" value={selectedColor} onChange={(event) => setSelectedColor(event.target.value)}>
                  <option value="">Choisir une couleur</option>
                  {colorOptions.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            )}

            {variantError && <p className="variant-error">{variantError}</p>}

            <div className="quantity-selector">
              <label htmlFor="quantity">Quantité</label>
              <select id="quantity" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>

            <div className="product-actions">
              <button className="btn-primary" type="button" onClick={handleAddToCart} disabled={Number(product.stock || 0) === 0}>
                Ajouter au panier
              </button>
              <Link to="/cart" className="btn-secondary">
                Voir le panier
              </Link>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h3>Produits similaires</h3>
            <div className="featured-grid products-list">
              {relatedProducts.map((item) => (
                <article className="product-card" key={item.id}>
                  <Link to={`/product/${item.id}`} className="product-card-link">
                    <div className="product-image-container">
                      <img src={item.image_url || 'images/products/computers/im3.jpeg'} alt={item.name} className="product-image" />
                    </div>
                    <div className="product-info">
                      <div className="product-category">{item.category}</div>
                      <h3 className="product-title">{item.name}</h3>
                      <div className="product-price">
                        <span className="current-price">{item.price} FCFA</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

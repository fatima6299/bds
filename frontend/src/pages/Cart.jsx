import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Auth, Cart, Orders } from '../services/apiClient';
import { formatPrice } from '../utils/format';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Auth.isAuthenticated()) {
      setLoading(false);
      return;
    }
    loadCart();
  }, []);

  async function loadCart() {
    try {
      setLoading(true);
      const data = await Cart.get();
      setCart(data.cart || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateQuantity(item, newQuantity) {
    if (newQuantity < 1) return;
    setError('');
    try {
      await Cart.update(item.product_id, newQuantity, item.size, item.color);
      await loadCart();
      window.dispatchEvent(new Event('cart:update'));
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour de la quantité.');
    }
  }

  async function handleRemove(item) {
    setError('');
    try {
      await Cart.remove(item.product_id, item.size, item.color);
      await loadCart();
      window.dispatchEvent(new Event('cart:update'));
    } catch (err) {
      setError(err.message || "Erreur lors du retrait de l'article.");
    }
  }

  async function handleCheckout() {
    setError('');
    setCheckingOut(true);
    try {
      const data = await Orders.create();
      window.dispatchEvent(new Event('cart:update'));
      navigate('/orders', { state: { justPlaced: data.order } });
    } catch (err) {
      setError(err.message || 'Erreur lors de la validation de la commande.');
      setCheckingOut(false);
    }
  }

  if (!Auth.isAuthenticated()) {
    return (
      <div className="container">
        <section className="cart-page">
          <h2>Mon panier</h2>
          <p>
            Vous devez être connecté pour voir votre panier.{' '}
            <Link to="/login">Se connecter</Link>
          </p>
        </section>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <p>Chargement du panier...</p>
      </div>
    );
  }

  return (
    <section className="cart-page">
      <div className="container">
        <h2>Mon panier</h2>
        {error && <p className="cart-error">{error}</p>}
        {cart.length === 0 ? (
          <p>Votre panier est vide.</p>
        ) : (
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image_url} alt={item.name} className="cart-item-image" />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  {(item.size || item.color) && (
                    <p className="cart-item-variant">
                      {[item.size && `Taille : ${item.size}`, item.color && `Couleur : ${item.color}`]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  )}
                  <p className="cart-item-price">{formatPrice(item.discounted_price)} FCFA</p>
                </div>
                <div className="cart-item-quantity">
                  <button
                    type="button"
                    onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-subtotal">{formatPrice(item.subtotal)} FCFA</div>
                <button
                  type="button"
                  className="cart-item-remove"
                  onClick={() => handleRemove(item)}
                  title="Retirer du panier"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            ))}

            <div className="cart-summary">
              <div className="cart-total">
                <strong>Total :</strong> {formatPrice(total)} FCFA
              </div>
              <button type="button" className="checkout-btn" onClick={handleCheckout} disabled={checkingOut}>
                {checkingOut ? 'Validation en cours...' : 'Passer la commande'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

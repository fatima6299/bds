import { useEffect, useState } from 'react';
import { Cart } from '../services/apiClient';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadCart() {
      try {
        const data = await Cart.get();
        setCart(data.cart || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error(err);
      }
    }

    loadCart();
  }, []);

  return (
    <section className="cart-page">
      <div className="container">
        <h2>Mon panier</h2>
        {cart.length === 0 ? (
          <p>Votre panier est vide.</p>
        ) : (
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-info">
                  <img src={item.image_url} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.quantity} x {item.discounted_price} FCFA</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="cart-total">
              <strong>Total :</strong> {total} FCFA
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

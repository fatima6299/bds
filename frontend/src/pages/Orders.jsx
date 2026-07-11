import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Auth, Orders as OrdersService } from '../services/apiClient';
import { formatPrice, formatDate, formatOrderStatus } from '../utils/format';
import { PAYMENT_METHODS, WHATSAPP_NUMBER } from '../utils/payment';

function formatVariant(item) {
  const parts = [item.size && `Taille : ${item.size}`, item.color && `Couleur : ${item.color}`].filter(Boolean);
  return parts.length > 0 ? ` (${parts.join(', ')})` : '';
}

function buildWhatsappLink(orderId, amount) {
  const message = `Bonjour, je viens d'effectuer le paiement de la commande #${orderId} (${formatPrice(amount)} FCFA). Voici la confirmation (capture d'écran en pièce jointe).`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function PaymentInstructions({ orderId, amount }) {
  return (
    <div className="payment-instructions">
      <h4><i className="fas fa-mobile-alt"></i> Comment payer</h4>
      <p>
        Envoyez <strong>{formatPrice(amount)} FCFA</strong> via l'un des moyens ci-dessous, en indiquant
        la référence <strong>#{orderId}</strong> dans le motif du paiement. Votre commande sera confirmée
        par notre équipe dès réception.
      </p>
      <ul className="payment-methods-list">
        {PAYMENT_METHODS.map((method) => (
          <li key={method.name}>
            <strong>{method.name}</strong> : {method.number} — {method.accountName}
          </li>
        ))}
      </ul>
      <a
        href={buildWhatsappLink(orderId, amount)}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-confirm-btn"
      >
        <i className="fab fa-whatsapp"></i> Envoyer la confirmation sur WhatsApp
      </a>
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const justPlaced = location.state?.justPlaced;

  useEffect(() => {
    if (!Auth.isAuthenticated()) return;
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const data = await OrdersService.getMy();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    }
  }

  if (!Auth.isAuthenticated()) {
    return (
      <div className="container">
        <section className="orders-page">
          <h2>Mes commandes</h2>
          <p>
            Vous devez être connecté pour voir vos commandes.{' '}
            <Link to="/login">Se connecter</Link>
          </p>
        </section>
      </div>
    );
  }

  return (
    <section className="orders-page">
      <div className="container">
        <h2>Mes commandes</h2>

        {justPlaced && (
          <div className="order-confirmation">
            <i className="fas fa-check-circle"></i>
            <div>
              <strong>Commande #{justPlaced.id} confirmée !</strong>
              <p>Merci pour votre achat. Voici le récapitulatif :</p>
              <ul>
                {(justPlaced.items || []).map((item) => (
                  <li key={item.id}>
                    {item.quantity} × {item.name}{formatVariant(item)} — {formatPrice(item.unit_price)} FCFA
                  </li>
                ))}
              </ul>
              <p className="order-confirmation-total">
                Total : {formatPrice(justPlaced.total_amount)} FCFA
              </p>
              {justPlaced.payment_status === 'pending' && (
                <PaymentInstructions orderId={justPlaced.id} amount={justPlaced.total_amount} />
              )}
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <p>Aucune commande trouvée.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-card-header">
                  <h3>Commande #{order.id}</h3>
                  <span className={`order-status order-status-${order.payment_status}`}>
                    {formatOrderStatus(order.payment_status)}
                  </span>
                </div>
                <p className="order-date">{formatDate(order.created_at)}</p>
                {order.items && order.items.length > 0 && (
                  <ul className="order-items">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.quantity} × {item.name}{formatVariant(item)} — {formatPrice(item.subtotal)} FCFA
                      </li>
                    ))}
                  </ul>
                )}
                <p className="order-total">
                  <strong>Total :</strong> {formatPrice(order.total_amount)} FCFA
                </p>
                {order.payment_status === 'pending' && (
                  <details className="order-payment-details">
                    <summary>Comment payer cette commande ?</summary>
                    <PaymentInstructions orderId={order.id} amount={order.total_amount} />
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

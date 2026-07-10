import { useEffect, useState } from 'react';
import { Orders as OrdersService } from '../services/apiClient';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await OrdersService.getMy();
        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
      }
    }

    loadOrders();
  }, []);

  return (
    <section className="orders-page">
      <div className="container">
        <h2>Mes commandes</h2>
        {orders.length === 0 ? (
          <p>Aucune commande trouvée.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <h3>Commande #{order.id}</h3>
                <p>Statut : {order.payment_status}</p>
                <p>Total : {order.total_amount} FCFA</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

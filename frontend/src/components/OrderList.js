import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../services/api';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load orders. Is the backend running?');
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await updateOrderStatus(id, newStatus);
      setOrders(orders.map(o => o.id === id ? response.data : o));
    } catch (err) {
      setError('Failed to update order status');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Orders</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {orders.length === 0 ? (
        <div className="card">
          <p>No orders yet. Place your first order!</p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Order #{order.id}</h3>
              <span className={`badge badge-${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            <p><strong>Customer:</strong> {order.customerName} ({order.customerEmail})</p>
            <p><strong>Total:</strong> <span className="price">${order.totalAmount}</span></p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>

            {order.items && order.items.length > 0 && (
              <table className="order-items">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(item => (
                    <tr key={item.id}>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="btn-group">
              {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                <>
                  {order.status === 'CONFIRMED' && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleStatusChange(order.id, 'SHIPPED')}
                    >
                      Mark Shipped
                    </button>
                  )}
                  {order.status === 'SHIPPED' && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleStatusChange(order.id, 'DELIVERED')}
                    >
                      Mark Delivered
                    </button>
                  )}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleStatusChange(order.id, 'CANCELLED')}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default OrderList;

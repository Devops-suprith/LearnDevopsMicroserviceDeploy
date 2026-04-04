import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, createOrder } from '../services/api';

function OrderForm() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    items: [{ productId: '', quantity: 1 }],
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setForm({ ...form, items: newItems });
  };

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { productId: '', quantity: 1 }] });
  };

  const removeItem = (index) => {
    if (form.items.length === 1) return;
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      items: form.items.map(item => ({
        productId: parseInt(item.productId, 10),
        quantity: parseInt(item.quantity, 10),
      })),
    };

    try {
      await createOrder(payload);
      navigate('/orders');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create order';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Place New Order</h2>
      <div className="card" style={{ maxWidth: '600px', marginTop: '1rem' }}>
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              required
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label>Customer Email</label>
            <input
              type="email"
              name="customerEmail"
              value={form.customerEmail}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>

          <h3 style={{ marginBottom: '0.75rem' }}>Order Items</h3>

          {form.items.map((item, index) => (
            <div key={index} className="order-item-row">
              <div className="form-group">
                <label>Product</label>
                <select
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                  required
                >
                  <option value="">Select product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} - ${p.price} ({p.quantity} in stock)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ maxWidth: '100px' }}>
                <label>Qty</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  min="1"
                  required
                />
              </div>

              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => removeItem(index)}
                style={{ marginBottom: '0.25rem' }}
              >
                X
              </button>
            </div>
          ))}

          <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}
            style={{ marginBottom: '1rem' }}>
            + Add Item
          </button>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/orders')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OrderForm;

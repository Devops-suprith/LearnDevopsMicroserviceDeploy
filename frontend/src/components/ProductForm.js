import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, getProduct, updateProduct } from '../services/api';

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadProduct();
    }
    // eslint-disable-next-line
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await getProduct(id);
      const p = response.data;
      setForm({
        name: p.name,
        description: p.description || '',
        price: p.price.toString(),
        quantity: p.quantity.toString(),
      });
    } catch (err) {
      setError('Failed to load product');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity, 10),
    };

    try {
      if (isEdit) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).join(', ')
        : err.response?.data?.message || 'Failed to save product';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
      <div className="card" style={{ maxWidth: '500px', marginTop: '1rem' }}>
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              placeholder="Enter product description"
            />
          </div>

          <div className="form-group">
            <label>Price ($)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label>Quantity in Stock</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              min="0"
              placeholder="0"
            />
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;

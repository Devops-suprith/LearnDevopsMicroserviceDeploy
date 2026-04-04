import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../services/api';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products. Is the backend running?');
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete product "${name}"?`)) return;

    try {
      await deleteProduct(id);
      setSuccess(`Product "${name}" deleted successfully`);
      setProducts(products.filter(p => p.id !== id));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete product');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Products</h2>
        <Link to="/products/new" className="btn btn-primary">+ Add Product</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {products.length === 0 ? (
        <div className="card">
          <p>No products found. Add your first product!</p>
        </div>
      ) : (
        <div className="grid">
          {products.map(product => (
            <div key={product.id} className="card">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="price">${product.price}</p>
              <p>Stock: {product.quantity} units</p>
              <div className="btn-group">
                <Link to={`/products/edit/${product.id}`} className="btn btn-secondary btn-sm">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;

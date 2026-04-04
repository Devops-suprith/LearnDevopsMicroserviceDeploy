import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8083';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product APIs
export const getProducts = () => api.get('/api/products');
export const getProduct = (id) => api.get(`/api/products/${id}`);
export const createProduct = (product) => api.post('/api/products', product);
export const updateProduct = (id, product) => api.put(`/api/products/${id}`, product);
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);

// Order APIs
export const getOrders = () => api.get('/api/orders');
export const getOrder = (id) => api.get(`/api/orders/${id}`);
export const createOrder = (order) => api.post('/api/orders', order);
export const updateOrderStatus = (id, status) =>
  api.put(`/api/orders/${id}/status?status=${status}`);

export default api;

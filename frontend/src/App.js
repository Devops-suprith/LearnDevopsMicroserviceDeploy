import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import OrderList from './components/OrderList';
import OrderForm from './components/OrderForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>DevOps Shop</h1>
          </div>
          <div className="nav-links">
            <Link to="/">Products</Link>
            <Link to="/products/new">Add Product</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/orders/new">Place Order</Link>
          </div>
        </nav>

        <main className="container">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/edit/:id" element={<ProductForm />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orders/new" element={<OrderForm />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>Microservice Demo App &mdash; Built for DevOps Practice</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

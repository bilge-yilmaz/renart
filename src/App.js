import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './components/ProductList';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goldPrice, setGoldPrice] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo('Attempting to connect to backend...');
      
      // Use environment variable for API URL, fallback to localhost for development
      const baseURL = process.env.REACT_APP_API_URL || 
                     (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '');
      
      setDebugInfo(`Connecting to: ${baseURL}/api/products`);
      
      // Try to fetch from the API
      const response = await axios.get(`${baseURL}/api/products`);
      
      if (response.data && response.data.products) {
        setProducts(response.data.products);
        setGoldPrice(response.data.goldPrice);
        setDebugInfo('Successfully loaded products!');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      
      let errorMessage = 'Failed to fetch products. ';
      
      if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        errorMessage += 'Backend server is not running. Please start the backend server on port 5000.';
      } else if (err.response?.status === 404) {
        errorMessage += 'API endpoint not found. Check if the backend routes are configured correctly.';
      } else {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
      setDebugInfo(`Error: ${err.message} | Code: ${err.code || 'Unknown'}`);
      setProducts([]);
      setGoldPrice(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading products...</p>
          {debugInfo && <p className="debug-info">{debugInfo}</p>}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h2>Connection Error</h2>
          <p>{error}</p>
          {debugInfo && <p className="debug-info">Debug: {debugInfo}</p>}
          
          <div className="error-instructions">
            <h3>To fix this:</h3>
            <ol>
              <li>Open a terminal in the <code>backend</code> folder</li>
              <li>Run: <code>npm install</code></li>
              <li>Run: <code>npm start</code></li>
              <li>Make sure you see "Server running on port 5000"</li>
              <li>Refresh this page</li>
            </ol>
          </div>
          
          <button onClick={fetchProducts} className="retry-btn">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Product List</h1>
        <div className="gold-price-info">
          <span>Gold Price: ${goldPrice || '0.00'}/gram</span>
        </div>
      </header>
      
      <main className="app-main">
        {products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <div className="no-products">
            <p>No products available</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App; 
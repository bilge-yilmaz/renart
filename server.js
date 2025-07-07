const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log(`🚀 STARTING SERVER ON PORT ${PORT}...`);
console.log(`📅 BOOT TIME: ${new Date().toISOString()}`);

// Middleware - CORS configuration for Vercel frontend
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://localhost:3000'
    ];
    
    // Allow any Vercel domain
    if (origin.includes('.vercel.app') || 
        allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Cache for gold price (refresh every 5 minutes)
let goldPriceCache = {
  price: 65.0, // Default fallback price
  timestamp: null,
  ttl: 5 * 60 * 1000 // 5 minutes in milliseconds
};

// Function to fetch current gold price (NON-BLOCKING)
async function fetchGoldPrice() {
  try {
    // Check cache first
    if (goldPriceCache.price && goldPriceCache.timestamp && 
        Date.now() - goldPriceCache.timestamp < goldPriceCache.ttl) {
      return goldPriceCache.price;
    }

    // Add timeout to prevent hanging
    const response = await axios.get('https://fcsapi.com/api-v3/forex/latest?symbol=XAUUSD&access_key=demo', {
      timeout: 5000 // 5 second timeout
    });
    
    // If API fails, use fallback price with slight variation to simulate real-time changes
    if (!response.data || !response.data.response || !response.data.response[0]) {
      console.log('Using fallback gold price with variation');
      // Simulate price variation (between $63-$67 per gram)
      const basePrice = 65.0;
      const variation = (Math.random() - 0.5) * 4; // ±2 USD variation
      return basePrice + variation;
    }
    
    // Convert from per ounce to per gram (1 oz = 31.1035 grams)
    const pricePerOunce = parseFloat(response.data.response[0].price);
    const pricePerGram = pricePerOunce / 31.1035;
    
    // Update cache
    goldPriceCache.price = pricePerGram;
    goldPriceCache.timestamp = Date.now();
    
    return pricePerGram;
  } catch (error) {
    console.error('Error fetching gold price:', error.message);
    // Return fallback price
    return goldPriceCache.price || 65.0;
  }
}

// Load products from JSON file
function loadProducts() {
  try {
    const productsPath = path.join(__dirname, 'products.json');
    const data = fs.readFileSync(productsPath, 'utf8');
    console.log(`✅ Products loaded from: ${productsPath}`);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

// Calculate product price
function calculatePrice(popularityScore, weight, goldPrice) {
  return ((popularityScore + 1) * weight * goldPrice).toFixed(2);
}

// Convert popularity score to 5-star rating
function convertPopularityToStars(popularityScore) {
  return Math.round(popularityScore * 50) / 10; // Convert to 5-star scale with 1 decimal
}

// Health check endpoint - FIRST for quick response
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: PORT,
    env: process.env.NODE_ENV || 'development'
  });
});

// GET /api/products - Get all products or filtered products
app.get('/api/products', async (req, res) => {
  try {
    const products = loadProducts();
    
    // Use cached price first, fetch in background
    let goldPrice = goldPriceCache.price;
    
    // Async fetch without blocking response
    fetchGoldPrice().then(price => {
      goldPriceCache.price = price;
    }).catch(err => {
      console.log('Background gold price fetch failed:', err.message);
    });
    
    // Apply filters if provided
    let filteredProducts = products;
    
    const { minPrice, maxPrice, minPopularity, maxPopularity } = req.query;
    
    // Calculate prices for all products first
    const productsWithPrices = filteredProducts.map(product => ({
      ...product,
      price: parseFloat(calculatePrice(product.popularityScore, product.weight, goldPrice)),
      rating: convertPopularityToStars(product.popularityScore),
      goldPrice: goldPrice.toFixed(2)
    }));
    
    // Apply filters to products with prices
    filteredProducts = productsWithPrices;
    
    // Apply price filters
    if (minPrice) {
      filteredProducts = filteredProducts.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product => product.price <= parseFloat(maxPrice));
    }
    
    // Apply popularity filters
    if (minPopularity) {
      filteredProducts = filteredProducts.filter(product => product.popularityScore >= parseFloat(minPopularity));
    }
    if (maxPopularity) {
      filteredProducts = filteredProducts.filter(product => product.popularityScore <= parseFloat(maxPopularity));
    }
    
    res.json({
      products: filteredProducts,
      goldPrice: goldPrice.toFixed(2),
      totalCount: filteredProducts.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/gold-price - Get current gold price
app.get('/api/gold-price', async (req, res) => {
  try {
    const goldPrice = await fetchGoldPrice();
    res.json({ 
      pricePerGram: goldPrice.toFixed(2),
      currency: 'USD',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching gold price:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler for non-API routes (API-only backend)
app.get('*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    message: 'This is an API-only backend. Available endpoints: /api/health, /api/products, /api/gold-price',
    timestamp: new Date().toISOString()
  });
});

// Start API server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 BACKEND API SERVER RUNNING ON PORT ${PORT}`);
  console.log(`⚡ SERVER READY IN ${process.uptime()}s`);
  console.log(`📅 DEPLOYMENT TIMESTAMP: ${new Date().toISOString()}`);
  console.log(`🌍 Server listening on port ${PORT}`);
  console.log(`⏰ Gold price cache TTL: ${goldPriceCache.ttl / 1000 / 60} minutes`);
  console.log(`🎯 API-only backend - Available endpoints: /api/health, /api/products, /api/gold-price`);
  
  // Background tasks after server is ready
  setTimeout(() => {
    // Load products for first time (async)
    try {
      const products = loadProducts();
      console.log(`📦 Products loaded: ${products.length} items`);
    } catch (err) {
      console.log(`⚠️  Products load failed: ${err.message}`);
    }
    
    // Initial gold price fetch (async, non-blocking)
    fetchGoldPrice().then(price => {
      console.log(`💰 Initial gold price: $${price.toFixed(2)}/gram`);
    }).catch(err => {
      console.log(`⚠️  Initial gold price fetch failed: ${err.message}`);
    });
  }, 1000); // 1 second delay after server start
}); 
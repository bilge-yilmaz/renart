const fs = require('fs');
const path = require('path');

// Load products from JSON file
function loadProducts() {
  try {
    const productsPath = path.join(__dirname, '..', 'products.json');
    const data = fs.readFileSync(productsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

// Calculate product price (same formula as in server.js)
function calculatePrice(popularityScore, weight, goldPrice) {
  return ((popularityScore + 1) * weight * goldPrice).toFixed(2);
}

// Convert popularity score to 5-star rating
function convertPopularityToStars(popularityScore) {
  return Math.round(popularityScore * 50) / 10;
}

// Test the price calculation
console.log('🧪 RENART PRICE CALCULATION TEST');
console.log('================================\n');

const products = loadProducts();
const testGoldPrice = 65.00; // Test gold price per gram in USD

console.log(`📊 Using test gold price: $${testGoldPrice}/gram\n`);
console.log('Price Formula: (popularityScore + 1) × weight × goldPrice\n');

products.forEach((product, index) => {
  const price = calculatePrice(product.popularityScore, product.weight, testGoldPrice);
  const rating = convertPopularityToStars(product.popularityScore);
  
  console.log(`${index + 1}. ${product.name}`);
  console.log(`   Weight: ${product.weight}g`);
  console.log(`   Popularity: ${product.popularityScore} (${rating}/5 stars)`);
  console.log(`   Calculation: (${product.popularityScore} + 1) × ${product.weight} × ${testGoldPrice}`);
  console.log(`   Price: $${price} USD`);
  console.log('');
});

console.log('✅ Price calculation test completed!');
console.log('\nNote: Actual prices in the app will use real-time gold prices.');
console.log('Real-time gold price varies but is typically between $60-$70/gram.'); 
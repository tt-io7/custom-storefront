// This script tests the connection to the Medusa server running on port 9000
const fetch = require('node-fetch');

const MEDUSA_URL = 'http://localhost:9000';
// Use the publishable API key from .env file
const PUBLISHABLE_API_KEY = 'pk_01HKQG3PKYJQWM1V7Z1VJ0BVEP';

async function testConnection() {
  console.log(`Testing connection to Medusa server at ${MEDUSA_URL}...`);
  
  try {
    // Test health endpoint
    console.log('\nTesting health endpoint:');
    const healthResponse = await fetch(`${MEDUSA_URL}/health`);
    console.log(`Status: ${healthResponse.status}`);
    
    if (healthResponse.ok) {
      const text = await healthResponse.text();
      console.log(`Response: ${text}`);
    } else {
      console.log(`Error: ${healthResponse.statusText}`);
    }
    
    // Test products endpoint
    console.log('\nTesting products endpoint:');
    const productsResponse = await fetch(`${MEDUSA_URL}/store/products?limit=100`, {
      headers: {
        'x-publishable-api-key': PUBLISHABLE_API_KEY
      }
    });
    
    console.log(`Status: ${productsResponse.status}`);
    
    // Log the request headers for debugging
    console.log('Request headers:');
    console.log('x-publishable-api-key:', PUBLISHABLE_API_KEY);
    
    if (productsResponse.ok) {
      const data = await productsResponse.json();
      console.log(`Found ${data.products.length} products`);
      
      // Log each product
      data.products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.title} (${product.id}) - Status: ${product.status}`);
      });
      
      if (data.products.length === 0) {
        console.log('No products found. You may need to create some products in the admin panel.');
      }
    } else {
      console.log(`Error: ${productsResponse.statusText}`);
      try {
        const errorData = await productsResponse.json();
        console.log('Error details:', errorData);
      } catch (e) {
        console.log('Could not parse error response');
      }
    }
    
    // Test product categories endpoint
    console.log('\nTesting product categories endpoint:');
    const categoriesResponse = await fetch(`${MEDUSA_URL}/store/product-categories`, {
      headers: {
        'x-publishable-api-key': PUBLISHABLE_API_KEY
      }
    });
    
    console.log(`Status: ${categoriesResponse.status}`);
    
    if (categoriesResponse.ok) {
      const data = await categoriesResponse.json();
      console.log(`Found ${data.product_categories.length} categories`);
      console.log('First category:', data.product_categories[0]?.name || 'No categories found');
    } else {
      console.log(`Error: ${categoriesResponse.statusText}`);
      try {
        const errorData = await categoriesResponse.json();
        console.log('Error details:', errorData);
      } catch (e) {
        console.log('Could not parse error response');
      }
    }
    
  } catch (error) {
    console.error('Connection error:', error.message);
  }
}

testConnection(); 
// This script tests the admin API to check product categories
const fetch = require('node-fetch');

const MEDUSA_URL = 'http://localhost:9000';
// For admin API, we need to use cookie-based auth

async function testAdminAPI() {
  console.log(`Testing Medusa Admin API at ${MEDUSA_URL}...`);
  
  try {
    // 1. First test the store products to check if they're accessible
    console.log('\nTesting store products:');
    const productsResponse = await fetch(`${MEDUSA_URL}/store/products`);
    console.log(`Status: ${productsResponse.status}`);
    
    if (productsResponse.ok) {
      const data = await productsResponse.json();
      console.log(`Found ${data.products.length} products in store API`);
      
      // Log each product
      data.products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.title} (ID: ${product.id}) - Status: ${product.status}`);
      });
    } else {
      console.log(`Error: ${productsResponse.statusText}`);
      try {
        const errorData = await productsResponse.json();
        console.log('Error details:', errorData);
      } catch (e) {
        console.log('Could not parse error response');
      }
    }
    
    // 2. Test the admin products list (only shows count without auth)
    console.log('\nTesting admin products list:');
    const adminProductsResponse = await fetch(`${MEDUSA_URL}/admin/products`);
    console.log(`Status: ${adminProductsResponse.status}`);
    
    // This will likely return 401 Unauthorized, which is expected
    try {
      const adminData = await adminProductsResponse.json();
      console.log('Response:', adminData);
    } catch (e) {
      console.log('Could not parse response (expected if unauthorized)');
    }
    
    console.log('\nNote: To access admin API endpoints, you need to be authenticated.');
    console.log('You can view your products in the Medusa admin panel at:');
    console.log(`${MEDUSA_URL}/app`);
    
  } catch (error) {
    console.error('Connection error:', error.message);
  }
}

testAdminAPI(); 
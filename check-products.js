// Check products availability without API key
const fetch = require('node-fetch');

const MEDUSA_URL = 'http://localhost:9000';

async function checkProducts() {
  console.log(`Testing product availability at ${MEDUSA_URL}...`);
  
  try {
    // Try fetching without API key first
    console.log('\nAttempting to get products without API key:');
    const productsResponse = await fetch(`${MEDUSA_URL}/store/products`);
    console.log(`Status: ${productsResponse.status}`);
    
    if (productsResponse.ok) {
      const data = await productsResponse.json();
      console.log(`Found ${data.products.length} products`);
      
      // Log each product
      data.products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.title} (${product.id})`);
        console.log(`   Price: ${product.variants?.[0]?.prices?.[0]?.amount || 'N/A'}`);
        console.log(`   Status: ${product.status}`);
        console.log(`   Handle: ${product.handle}`);
        console.log(`   Thumbnail: ${product.thumbnail || 'No thumbnail'}`);
        console.log(`   Categories: ${product.categories?.length || 0}`);
        console.log(`   Has variants: ${(product.variants?.length || 0) > 0 ? 'Yes' : 'No'}`);
        console.log('-----------------------------------');
      });
      
      if (data.products.length === 0) {
        console.log('No products found in the database.');
        console.log('You may need to seed your database or create products in the admin panel.');
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
  } catch (error) {
    console.error('Connection error:', error.message);
  }
}

checkProducts(); 
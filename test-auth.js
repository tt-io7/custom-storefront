const fetch = require('node-fetch');

// Configuration - modify these values
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_c5369fa943d22d821ef788bf12df91cc8cddb65af2393a73fd4a46f40e00799c';

// Test email - change this to a new random email for testing registration
const testEmail = `test${Date.now()}@example.com`;
const testPassword = 'TestPassword123!';

async function testAuth() {
  console.log('=== Medusa Authentication Test ===');
  console.log(`Backend URL: ${MEDUSA_BACKEND_URL}`);
  console.log(`Test email: ${testEmail}`);
  console.log('\n');

  try {
    // First check if the server is reachable at all
    console.log('Checking server health...');
    try {
      const healthResponse = await fetch(`${MEDUSA_BACKEND_URL}/health`, {
        method: 'GET'
      });
      
      if (healthResponse.ok) {
        console.log('Server health check: OK (Server is running!)');
      } else {
        console.log('Server health check failed with status:', healthResponse.status);
        const errorText = await healthResponse.text();
        console.log('Error:', errorText);
      }
    } catch (error) {
      console.error('Server health check failed:', error.message);
      throw new Error(`Backend server not reachable at ${MEDUSA_BACKEND_URL}. Make sure it's running and accessible.`);
    }

    // Check CORS settings
    console.log('\nChecking CORS setup...');
    try {
      const corsCheckResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/customers/me`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'x-publishable-api-key': PUBLISHABLE_API_KEY,
        }
      });
      
      console.log('CORS check response status:', corsCheckResponse.status);
      // 401 is expected without authentication, but indicates CORS is working
      if (corsCheckResponse.status === 401) {
        console.log('CORS appears to be configured correctly.');
      } else {
        console.log('Unexpected response on CORS check. This might indicate CORS issues.');
      }
    } catch (error) {
      console.error('CORS check failed:', error.message);
      console.error('This could indicate CORS is not configured correctly in your Medusa backend.');
      console.error('Make sure your .env file in the Medusa backend has:');
      console.error('STORE_CORS=http://localhost:3000,http://localhost:8000');
      console.error('AUTH_CORS=http://localhost:3000,http://localhost:8000,http://localhost:9000');
    }

    console.log('\n1. Testing registration...');
    // Step 1: Register
    try {
      const registerResponse = await fetch(`${MEDUSA_BACKEND_URL}/auth/customer/emailpass/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-publishable-api-key': PUBLISHABLE_API_KEY,
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      });
      
      console.log(`Registration status: ${registerResponse.status}`);
      
      if (!registerResponse.ok) {
        const errorText = await registerResponse.text();
        console.error('Registration error response:', errorText);
        try {
          const registerData = JSON.parse(errorText);
          throw new Error(`Registration failed: ${registerData.message || 'Unknown error'}`);
        } catch (e) {
          throw new Error(`Registration failed with status ${registerResponse.status}. Raw response: ${errorText}`);
        }
      }
      
      const registerData = await registerResponse.json();
      console.log('Registration response:', JSON.stringify(registerData, null, 2));
      
      const token = registerData.token;
      console.log(`Token received: ${token ? 'Yes' : 'No'}`);
      
      if (!token) {
        throw new Error('No authentication token received from the server');
      }
      
      // Step 2: Create a customer profile
      console.log('\n2. Creating customer profile...');
      const customerResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-publishable-api-key': PUBLISHABLE_API_KEY,
        },
        body: JSON.stringify({
          email: testEmail,
          first_name: 'Test',
          last_name: 'User',
        }),
      });
      
      console.log(`Customer creation status: ${customerResponse.status}`);
      
      if (!customerResponse.ok) {
        const errorText = await customerResponse.text();
        console.error('Customer creation error response:', errorText);
        try {
          const customerError = JSON.parse(errorText);
          throw new Error(`Customer creation failed: ${customerError.message || 'Unknown error'}`);
        } catch (e) {
          throw new Error(`Customer creation failed with status ${customerResponse.status}. Raw response: ${errorText}`);
        }
      }
      
      const customerData = await customerResponse.json();
      console.log('Customer creation response:', JSON.stringify(customerData, null, 2));
      
      // Step 3: Test login
      console.log('\n3. Testing login...');
      const loginResponse = await fetch(`${MEDUSA_BACKEND_URL}/auth/customer/emailpass/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-publishable-api-key': PUBLISHABLE_API_KEY,
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      });
      
      console.log(`Login status: ${loginResponse.status}`);
      
      if (!loginResponse.ok) {
        const errorText = await loginResponse.text();
        console.error('Login error response:', errorText);
        try {
          const loginError = JSON.parse(errorText);
          throw new Error(`Login failed: ${loginError.message || 'Unknown error'}`);
        } catch (e) {
          throw new Error(`Login failed with status ${loginResponse.status}. Raw response: ${errorText}`);
        }
      }
      
      const loginData = await loginResponse.json();
      console.log('Login response:', JSON.stringify(loginData, null, 2));
      
      console.log('\n=== All tests PASSED ===');
      console.log(`You can now log in with: ${testEmail} / ${testPassword}`);
    } catch (error) {
      throw error;
    }
  } catch (error) {
    console.error('\n=== Test FAILED ===');
    console.error(error.message);
    
    // Provide some troubleshooting tips
    console.log('\n=== Troubleshooting Tips ===');
    console.log('1. Make sure your Medusa backend is running at:', MEDUSA_BACKEND_URL);
    console.log('2. Check your CORS settings in the Medusa backend .env file:');
    console.log('   STORE_CORS=http://localhost:3000,http://localhost:8000');
    console.log('   AUTH_CORS=http://localhost:3000,http://localhost:8000,http://localhost:9000');
    console.log('3. Ensure your publishable API key is valid:', PUBLISHABLE_API_KEY);
    console.log('4. Check network tab in browser dev tools for more detailed error information');
    console.log('5. Look at the Medusa backend logs for any server-side errors');
  }
}

testAuth(); 
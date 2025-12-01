const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    headers: {
        'Content-Type': 'application/json'
    }
};

function makeRequest(path, method, data, token) {
    return new Promise((resolve, reject) => {
        const reqOptions = {
            ...options,
            path,
            method,
            headers: { ...options.headers } // Deep copy headers
        };
        if (token) {
            reqOptions.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(reqOptions, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(body) }));
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    try {
        console.log('--- Starting Tests ---');

        // 1. Login
        console.log('\n1. Testing Login...');
        const loginRes = await makeRequest('/login', 'POST', { username: 'testuser', password: 'password123' });
        console.log('Status:', loginRes.statusCode);
        console.log('Body:', loginRes.body);

        if (loginRes.statusCode !== 200 || !loginRes.body.token) {
            throw new Error('Login failed');
        }
        const token = loginRes.body.token;
        console.log('Token received.');

        // 2. Protected Route (with token)
        console.log('\n2. Testing Protected Route (with token)...');
        const protectedRes = await makeRequest('/protected', 'GET', null, token);
        console.log('Status:', protectedRes.statusCode);
        console.log('Body:', protectedRes.body);

        if (protectedRes.statusCode !== 200) {
            throw new Error('Protected route failed with valid token');
        }

        // 3. Protected Route (without token)
        console.log('\n3. Testing Protected Route (without token)...');
        const noTokenRes = await makeRequest('/protected', 'GET', null, null);
        console.log('Status:', noTokenRes.statusCode);
        console.log('Body:', noTokenRes.body);

        if (noTokenRes.statusCode !== 401) {
            throw new Error('Protected route should fail without token');
        }

        console.log('\n--- All Tests Passed ---');

    } catch (error) {
        console.error('\nTest Failed:', error.message);
    }
}

// Wait for server to start (manual delay for simplicity in this script, 
// in real scenario we'd wait for the server process)
setTimeout(runTests, 1000);

const express = require('express');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_super_secret_key_change_this_in_production';

app.use(express.json());

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'JWT Auth API',
            version: '1.0.0',
            description: 'A simple Express API with JWT Authentication',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./server.js'], // Files containing annotations
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mock user for demonstration
const user = {
    id: 1,
    username: 'testuser',
    password: 'password123'
};

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login to get a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: testuser
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
// Login endpoint to generate token
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // In a real app, you would verify credentials against a database
    if (username === user.username && password === user.password) {
        // Generate JWT
        // Payload: data you want to store in the token
        // Secret: key used to sign the token
        // Options: expiresIn (optional)
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

        res.json({
            message: 'Login successful',
            token: token
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Middleware to verify token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Access a protected route
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Access token required
 *       403:
 *         description: Invalid or expired token
 */
// Protected endpoint
app.get('/protected', authenticateToken, (req, res) => {
    res.json({
        message: 'This is a protected route',
        user: req.user
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});

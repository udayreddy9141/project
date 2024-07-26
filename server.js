// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

const secretKey = 'your-secret-key'; // Replace with a strong secret key
const saltRounds = 10;

// In-memory storage for results and users
let results = [];
let users = [
    // Example user, in real applications, you should store users in a database
    { username: 'admin', password: bcrypt.hashSync('password123', saltRounds) }
];

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static('public'));

// Endpoint to register a new user (for demo purposes)
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if user already exists
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password and store user
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
});

// Endpoint to login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if user exists and password is correct
    const user = users.find(user => user.username === username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
});

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Endpoint to get results
app.get('/api/results', authenticateToken, (req, res) => {
    res.json(results);
});

// Endpoint to add a new result
app.post('/api/results', authenticateToken, (req, res) => {
    const { studentName, rollNumber, subject, marks } = req.body;
    if (!studentName || !rollNumber || !subject || !marks) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    results.push({ studentName, rollNumber, subject, marks });
    res.status(201).json({ message: 'Result added successfully' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

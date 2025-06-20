 // backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const ideaRoutes = require('./routes/ideaRoutes');
// const commentRoutes = require('./routes/commentRoutes');

const app = express();

// --- CORS Configuration ---
// Define allowed origins based on environment
const allowedOrigins = [];
if (process.env.NODE_ENV === 'production') {
    if (process.env.CORS_ORIGIN) { // Expecting CORS_ORIGIN from .env or platform env vars
        allowedOrigins.push(process.env.CORS_ORIGIN);
    }
    // You could add more production origins here if needed, e.g., a staging environment
    // allowedOrigins.push('https://staging.yourfrontend.com');
} else {
    // Development origins
    allowedOrigins.push('http://localhost:3000'); // Common React dev port
    allowedOrigins.push('http://localhost:3001'); // Another possible React dev port
    // Add any other local frontend ports you might use
}

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true, // If you plan to use cookies or session-based auth features later
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// MIDDLEWARE
app.use(cors(corsOptions)); // Use the configured CORS options
app.use(express.json());   // To parse JSON request bodies. MUST BE BEFORE ROUTES.

// Basic Route (for testing server is up)
app.get('/', (req, res) => {
    res.send('Backend API is running!');
});

// MOUNT ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
// app.use('/api/comments', commentRoutes);

// Database Connection
const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 5000; // Render (and others) will set process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (process.env.NODE_ENV === 'production') {
        console.log(`Production CORS allowing origin: ${process.env.CORS_ORIGIN}`);
    } else {
        console.log(`Development CORS allowing origins: ${allowedOrigins.join(', ')}`);
    }
});
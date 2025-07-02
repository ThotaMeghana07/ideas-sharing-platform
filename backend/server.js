const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const ideaRoutes = require('./routes/ideaRoutes');

const app = express();

// --- CORS CONFIG ---
const allowedOrigins = [process.env.CORS_ORIGIN];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // For preflight
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('Backend API is running!'));
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);

// Connect DB and Start
const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

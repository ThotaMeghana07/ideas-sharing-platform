 // Final server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const ideaRoutes = require('./routes/ideaRoutes'); // <-- Re-add this line

const app = express();

app.use(cors()); // Use simple cors for now, we can add options back later
app.use(express.json());

app.get('/', (req, res) => res.send('Server is running!'));
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes); // <-- Re-add this line

const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started successfully on port ${PORT}`);
});
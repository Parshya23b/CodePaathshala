require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve image files

// Routes
const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Schedule API is running...');
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Schedule Server running on port ${PORT}`);
});

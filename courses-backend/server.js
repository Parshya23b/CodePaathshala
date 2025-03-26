require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const courseRoutes = require('./routes/courseRoutes');

const app = express();

// Middleware (must be before routes)
app.use(express.json()); // ✅ Parses JSON bodies
app.use(cors());         // ✅ Enables CORS

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/courses', courseRoutes);  // ✅ Only once

// Start Server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Courses Server is running on port ${PORT}`));

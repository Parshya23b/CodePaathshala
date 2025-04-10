require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Analytics Server is running on port ${PORT}`));

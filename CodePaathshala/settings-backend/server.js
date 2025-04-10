const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const settingsRoutes = require('./routes/settingsRoutes');
app.use('/api/settings', settingsRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Settings server running on port ${PORT}`);
});

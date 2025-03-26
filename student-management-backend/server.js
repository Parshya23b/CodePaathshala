const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Routes
const batchRoutes = require('./routes/batchRoutes');
app.use('/api/batches', batchRoutes);

// Start Server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Student Management Server running on port ${PORT}`);
});

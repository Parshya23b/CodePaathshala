const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const askRoutes = require('./routes/askRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ask', askRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Ask AI server running on http://localhost:${PORT}`);
});

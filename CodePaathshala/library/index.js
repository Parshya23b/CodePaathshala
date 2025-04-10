const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const libraryRoutes = require('./routes/libraryRoutes');





dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;













// Middleware
app.use(cors());
app.use(express.json());
const quizRoutes = require('./routes/libraryQuizRoutes');
app.use('/api/library/quizzes', quizRoutes);


// Routes
app.use('/api/library', libraryRoutes);


const courseRoutes = require('./routes/libraryCourseRoutes');
app.use('/api/library/courses', courseRoutes);


const assignmentRoutes = require('./routes/libraryAssignmentRoutes');
app.use('/api/library/assignments', assignmentRoutes);



// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

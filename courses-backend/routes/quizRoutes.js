const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');

// Mock Quiz schema (replace if you have actual model)
const quizSchema = new mongoose.Schema({
  title: String,
  timeLimit: Number,
  questions: [Object],
});
const Quiz = mongoose.model('Quiz', quizSchema);

// ✅ Add Quiz to Course
router.post('/:courseId/add-quiz', authMiddleware, async (req, res) => {
  try {
    const { title, timeLimit, questions } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const newQuiz = new Quiz({ title, timeLimit, questions });
    await newQuiz.save();

    course.assets.quiz.push(newQuiz._id);
    await course.save();

    res.status(200).json({ message: 'Quiz added successfully', quiz: newQuiz });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add quiz', error: err.message });
  }
});

module.exports = router;

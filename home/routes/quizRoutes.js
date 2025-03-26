const express = require('express');
const Quiz = require('../models/Quiz');
const authMiddleware = require('../middleware/authMiddleware'); // To protect routes

const router = express.Router();

// Create a new quiz (Only teachers/admins can create)
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { title, description, questions } = req.body;

        // Only allow teachers and admins to create quizzes
        if (req.user.role !== 'Teacher' && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Permission denied' });
        }

        const newQuiz = new Quiz({
            title,
            description,
            questions,
            createdBy: req.user.id
        });

        await newQuiz.save();
        res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all quizzes
router.get('/', authMiddleware, async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('createdBy', 'name email');
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Submit a quiz attempt (Only students can attempt quizzes)
router.post('/attempt/:id', authMiddleware, async (req, res) => {
    try {
        const { answers } = req.body; // answers should be { "questionId": "selectedOption" }
        const quizId = req.params.id;

        // Only students can attempt quizzes
        if (req.user.role !== 'Student') {
            return res.status(403).json({ message: 'Only students can attempt quizzes' });
        }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Calculate score
        let score = 0;
        quiz.questions.forEach((question, index) => {
            if (answers[question._id] === question.correctAnswer) {
                score++;
            }
        });

        res.json({ message: 'Quiz submitted successfully', score, totalQuestions: quiz.questions.length });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

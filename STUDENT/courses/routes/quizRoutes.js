const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Get quiz
router.get('/:quizId', quizController.getQuiz);

// Submit quiz
router.post('/:quizId/submit', quizController.submitQuiz);


// Get all quiz submissions by a user
router.get('/submissions/:userId', quizController.getUserQuizSubmissions);

// Get history for a specific quiz by a user
router.get('/:quizId/history/:userId', quizController.getQuizHistory);


module.exports = router;

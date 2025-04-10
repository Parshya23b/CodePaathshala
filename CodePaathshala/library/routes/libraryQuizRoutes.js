const express = require('express');
const router = express.Router();
const quizController = require('../controllers/libraryQuizController');

// Create
router.post('/', quizController.createQuiz);

// Get all
router.get('/', quizController.getAllQuizzes);

// Get one
router.get('/:quizId', quizController.getQuizById);

// Update
router.put('/:quizId', quizController.updateQuiz);

// Delete
router.delete('/:quizId', quizController.deleteQuiz);

module.exports = router;

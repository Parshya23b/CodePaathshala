const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Teacher/Admin who created it
    questions: [
        {
            questionText: { type: String, required: true },
            options: [{ type: String, required: true }], // Array of multiple-choice options
            correctAnswer: { type: String, required: true } // Correct option
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', QuizSchema);

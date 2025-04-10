const LibraryQuiz = require('../models/LibraryQuiz');

// ✅ Create Quiz
exports.createQuiz = async (req, res) => {
  try {
    const quiz = new LibraryQuiz(req.body);
    await quiz.save();
    res.status(201).json({ message: 'Quiz created', quiz });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create quiz', error: err.message });
  }
};

// ✅ Get All Quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await LibraryQuiz.find().sort({ createdAt: -1 });
    res.status(200).json({ quizzes });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quizzes', error: err.message });
  }
};

// ✅ Get Quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await LibraryQuiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    res.status(200).json({ quiz });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quiz', error: err.message });
  }
};

// ✅ Update Quiz
exports.updateQuiz = async (req, res) => {
  try {
    const updated = await LibraryQuiz.findByIdAndUpdate(req.params.quizId, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Quiz not found' });

    res.status(200).json({ message: 'Quiz updated', quiz: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update quiz', error: err.message });
  }
};

// ✅ Delete Quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const deleted = await LibraryQuiz.findByIdAndDelete(req.params.quizId);
    if (!deleted) return res.status(404).json({ message: 'Quiz not found' });

    res.status(200).json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete quiz', error: err.message });
  }
};

const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');

/* ------------------------------------------
   ✅ GET Quiz Questions (No correct answers)
   Endpoint: GET /api/courses/quiz/:quizId
------------------------------------------ */
exports.getQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Hide correct answers
    const questions = quiz.questions.map(q => ({
      question: q.question,
      options: q.options
    }));

    res.status(200).json({ title: quiz.title, questions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load quiz', error: err.message });
  }
};

/* ------------------------------------------
   ✅ Submit Quiz Answers
   Endpoint: POST /api/courses/quiz/:quizId/submit
------------------------------------------ */
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { userId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({ message: 'Invalid answers array' });
    }

    // Score calculation
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (q.correctAnswer === answers[i]) score++;
    });

    const submission = new QuizSubmission({
      userId,
      quizId,
      answers,
      score
    });

    await submission.save();

    res.status(200).json({ message: 'Quiz submitted', score, total: quiz.questions.length });
  } catch (err) {
    res.status(500).json({ message: 'Quiz submission failed', error: err.message });
  }
};


// ✅ GET /api/courses/quiz/submissions/:userId
exports.getUserQuizSubmissions = async (req, res) => {
  try {
    const { userId } = req.params;

    const submissions = await QuizSubmission.find({ userId })
      .populate('quizId', 'title')
      .sort({ submittedAt: -1 });

    res.status(200).json({ submissions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch submissions', error: err.message });
  }
};



// ✅ GET /api/courses/quiz/:quizId/history/:userId
exports.getQuizHistory = async (req, res) => {
  try {
    const { quizId, userId } = req.params;

    const submissions = await QuizSubmission.find({ quizId, userId }).sort({ submittedAt: -1 });

    res.status(200).json({ submissions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quiz history', error: err.message });
  }
};

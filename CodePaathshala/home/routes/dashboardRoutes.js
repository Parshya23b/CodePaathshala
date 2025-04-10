const express = require('express');
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');
const Schedule = require('../models/Schedule');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Weekly Summary API (Active Students, Assignments, Quizzes)
router.get('/weekly-summary', authMiddleware, async (req, res) => {
    try {
        const activeStudents = await User.countDocuments({
            role: 'Student',
            updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });

        const totalAssignments = await Assignment.countDocuments();
        const totalQuizzes = await Quiz.countDocuments();

        res.json({ activeStudents, totalAssignments, totalQuizzes });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Activity Feed API (Recent Assignments & Quizzes)
router.get('/activity-feed', authMiddleware, async (req, res) => {
    try {
        const recentAssignments = await Assignment.find()
            .sort({ updatedAt: -1 })
            .limit(5)
            .populate('createdBy', 'name');

        const recentQuizzes = await Quiz.find()
            .sort({ updatedAt: -1 })
            .limit(5)
            .populate('createdBy', 'name');

        const activity = [
            ...recentAssignments.map(a => ({ message: `${a.createdBy.name} created an assignment: ${a.title}`, type: "assignment", timestamp: a.updatedAt })),
            ...recentQuizzes.map(q => ({ message: `${q.createdBy.name} created a quiz: ${q.title}`, type: "quiz", timestamp: q.updatedAt }))
        ].sort((a, b) => b.timestamp - a.timestamp);

        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Upcoming Schedule API (Fetch Future Events)
router.get('/schedule', authMiddleware, async (req, res) => {
    try {
        const events = await Schedule.find({ date: { $gte: new Date() } })
            .sort({ date: 1 })
            .limit(5);

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

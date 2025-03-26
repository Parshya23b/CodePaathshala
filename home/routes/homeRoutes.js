const express = require('express');
const User = require('../models/User');  // Import User model
const Assignment = require('../models/Assignment');  // Import Assignment model
const Quiz = require('../models/Quiz');  // Import Quiz model
const Schedule = require('../models/Schedule');  // Import Schedule model
const Activity = require('../models/Activity');  // Import Activity model

const router = express.Router();

// **Fetch Home Page Data**
router.get('/home', async (req, res) => {
    try {
        const activeStudents = await User.find({ role: "Student" }).countDocuments();
        const assignments = await Assignment.find().sort({ dueDate: -1 }).limit(3);
        const quizzes = await Quiz.find().sort({ createdAt: -1 }).limit(3);
        const schedule = await Schedule.find().sort({ date: 1 }).limit(5);
        const activityFeed = await Activity.find().sort({ timestamp: -1 }).limit(5);

        res.json({
            activeStudents,
            assignments,
            quizzes,
            schedule,
            activityFeed
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

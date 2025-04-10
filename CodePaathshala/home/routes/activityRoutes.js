const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure you have this middleware for authentication

// ✅ **Route to log an activity**
router.post('/log', authMiddleware, async (req, res) => {
    try {
        const { activity } = req.body;

        const newActivity = new Activity({
            user: req.user.id,  // User ID from authentication token
            activity
        });

        await newActivity.save();
        res.status(201).json({ message: 'Activity logged successfully', activity: newActivity });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ✅ **Route to fetch all activities for a user**
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const activities = await Activity.find({ user: req.user.id }).sort({ timestamp: -1 });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

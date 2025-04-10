const express = require('express');
const Schedule = require('../models/Schedule');
const authMiddleware = require('../middleware/authMiddleware'); // To protect routes

const router = express.Router();

// Create a new schedule (Only teachers/admins can create)
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { title, description, date } = req.body;

        // Only allow teachers and admins to create schedules
        if (req.user.role !== 'Teacher' && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Permission denied' });
        }

        const newSchedule = new Schedule({
            title,
            description,
            date,
            createdBy: req.user.id
        });

        await newSchedule.save();
        res.status(201).json({ message: 'Schedule created successfully', schedule: newSchedule });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all schedules
router.get('/', authMiddleware, async (req, res) => {
    try {
        const schedules = await Schedule.find().populate('createdBy', 'name email');
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Join a schedule (Students can join events)
router.post('/join/:id', authMiddleware, async (req, res) => {
    try {
        const scheduleId = req.params.id;

        const schedule = await Schedule.findById(scheduleId);
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        // Only students can join schedules
        if (req.user.role !== 'Student') {
            return res.status(403).json({ message: 'Only students can join events' });
        }

        // Add student to attendees list if not already joined
        if (!schedule.attendees.includes(req.user.id)) {
            schedule.attendees.push(req.user.id);
            await schedule.save();
        }

        res.json({ message: 'Successfully joined the schedule', schedule });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

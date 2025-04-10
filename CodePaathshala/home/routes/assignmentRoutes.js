const express = require('express');
const Assignment = require('../models/Assignment');
const authMiddleware = require('../middleware/authMiddleware'); // To protect routes

const router = express.Router();

// Create a new assignment (Only teachers/admins can create)
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;

        // Only allow teachers and admins to create assignments
        if (req.user.role !== 'Teacher' && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Permission denied' });
        }

        const newAssignment = new Assignment({
            title,
            description,
            dueDate,
            createdBy: req.user.id
        });

        await newAssignment.save();
        res.status(201).json({ message: 'Assignment created successfully', assignment: newAssignment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all assignments
router.get('/', authMiddleware, async (req, res) => {
    try {
        const assignments = await Assignment.find().populate('createdBy', 'name email');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Submit an assignment (Only students can submit)
router.post('/submit/:id', authMiddleware, async (req, res) => {
    try {
        const { file } = req.body; // This will be a file URL or path
        const assignmentId = req.params.id;

        // Only students can submit assignments
        if (req.user.role !== 'Student') {
            return res.status(403).json({ message: 'Only students can submit assignments' });
        }

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Add submission
        assignment.submissions.push({ studentId: req.user.id, file });
        await assignment.save();

        res.json({ message: 'Assignment submitted successfully', assignment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// ✅ Get all student courses by status (active, completed, incomplete)
router.get('/:userId', courseController.getCoursesByStatus);

// ✅ Get full course detail (sections + lectures)
router.get('/detail/:courseId', courseController.getCourseDetails);

// ✅ Update course progress (mark a lecture complete)
router.post('/update-progress', courseController.updateProgress);

module.exports = router;

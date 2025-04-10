const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

// ✅ Get a specific assignment
router.get('/:assignmentId', assignmentController.getAssignment);

// ✅ Submit code for an assignment
router.post('/:assignmentId/submit', assignmentController.submitAssignment);


router.get('/submissions/:userId', assignmentController.getAllUserSubmissions);
router.get('/:assignmentId/submissions/:userId', assignmentController.getUserAssignmentSubmissions);


// routes/assignmentRoutes.js
router.get('/:assignmentId/solution', assignmentController.getSolution);

router.post('/:assignmentId/custom-run', assignmentController.runCustomTestCase);




module.exports = router;

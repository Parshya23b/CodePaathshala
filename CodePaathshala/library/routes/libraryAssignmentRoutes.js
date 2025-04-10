const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/libraryAssignmentController');

// Create assignment
router.post('/', assignmentController.createAssignment);

// Get all
router.get('/', assignmentController.getAllAssignments);

// Get one
router.get('/:assignmentId', assignmentController.getAssignmentById);

// Update
router.put('/:assignmentId', assignmentController.updateAssignment);

// Delete
router.delete('/:assignmentId', assignmentController.deleteAssignment);

module.exports = router;

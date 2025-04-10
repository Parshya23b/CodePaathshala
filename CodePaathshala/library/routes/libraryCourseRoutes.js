const express = require('express');
const router = express.Router();
const courseController = require('../controllers/libraryCourseController');

// ✅ Create new course
router.post('/', courseController.createCourse);

// ✅ Get all courses
router.get('/', courseController.getAllCourses);

// ✅ Get course by ID
router.get('/:courseId', courseController.getCourseById);

// ✅ Update course
router.put('/:courseId', courseController.updateCourse);

// ✅ Delete course
router.delete('/:courseId', courseController.deleteCourse);


// Add module to course
router.post('/:courseId/add-module', courseController.addModuleToCourse);


module.exports = router;

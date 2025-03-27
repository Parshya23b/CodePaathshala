const express = require('express');
const multer = require('multer');
const path = require('path');
const Course = require('../models/Course');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// 🗂️ Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// ✅ Upload PDF file
router.post('/:courseId/upload-pdf', authMiddleware, upload.single('pdf'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.assets.pdf.push(req.file.filename);
    await course.save();

    res.status(200).json({ message: 'PDF uploaded', course });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading PDF', error: error.message });
  }
});

// ✅ Add PDF by public URL
router.post('/:courseId/add-pdf-url', authMiddleware, async (req, res) => {
  try {
    const { url } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.assets.pdf.push(url); // save public URL as string
    await course.save();

    res.status(200).json({ message: 'Public URL added', course });
  } catch (error) {
    res.status(500).json({ message: 'Error adding public URL', error: error.message });
  }
});

module.exports = router;

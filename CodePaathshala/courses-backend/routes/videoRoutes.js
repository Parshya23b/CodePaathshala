const express = require('express');
const multer = require('multer');
const Course = require('../models/Course');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// 🎥 Video upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// ✅ Upload Video File
router.post('/:courseId/upload-video', authMiddleware, upload.single('video'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.assets.videos.push(req.file.filename);
    await course.save();

    res.status(200).json({ message: 'Video uploaded', course });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading video', error: error.message });
  }
});

// ✅ Add Video Link (YouTube/Vimeo/Direct)
router.post('/:courseId/add-video-link', authMiddleware, async (req, res) => {
  try {
    const { url } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.assets.videos.push(url); // Save URL as string
    await course.save();

    res.status(200).json({ message: 'Video link added', course });
  } catch (error) {
    res.status(500).json({ message: 'Error adding video link', error: error.message });
  }
});

module.exports = router;

const express = require('express');
const multer = require('multer');
const path = require('path');
const Course = require('../models/Course');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ⚙️ Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

/* ----------------------------------------
   ✅ Upload Cover Image
---------------------------------------- */
router.post('/:courseId/upload-cover', authMiddleware, upload.single('cover'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.coverImage = req.file.filename;
    await course.save();

    res.status(200).json({ message: 'Cover image uploaded', course });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading cover image', error: error.message });
  }
});

/* ----------------------------------------
   ✅ Upload Promotional Video
---------------------------------------- */
router.post('/:courseId/upload-promo-video', authMiddleware, upload.single('promo'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.promoVideo = req.file.filename;
    await course.save();

    res.status(200).json({ message: 'Promotional video uploaded', course });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading promo video', error: error.message });
  }
});

/* ----------------------------------------
   ✅ Upload General Asset (PDF, SCORM, Audio, Files)
   Example: /upload/pdf/:courseId
---------------------------------------- */
router.post('/upload/:type/:courseId', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { type, courseId } = req.params;

    const allowedTypes = ['pdf', 'scorm', 'audio', 'files'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid asset type' });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.assets[type].push(req.file.filename);
    await course.save();

    res.status(200).json({ message: `${type} uploaded successfully`, file: req.file.filename });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

module.exports = router;

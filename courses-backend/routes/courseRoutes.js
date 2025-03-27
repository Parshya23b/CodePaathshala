const express = require('express');
const multer = require('multer');
const path = require('path');
const Course = require('../models/Course');
const authMiddleware = require('../middleware/authMiddleware');
const OpenAI = require('openai');

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 📦 Multer setup for cover and promo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// 🧠 Generate outline using OpenAI SDK v4 (chat model)
async function generateCourseOutline(topic) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Generate a structured course outline for "${topic}" with 5 chapters.`
      }
    ],
    max_tokens: 300
  });

  return response.choices[0].message.content.trim();
}

// ✅ Create Course (with cover & promo upload)
router.post(
  '/create',
  authMiddleware,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'promoVideo', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      if (req.user.role !== 'Teacher' && req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Permission denied' });
      }

      const { title, description, whatYouWillLearn, suggestions } = req.body;
      const coverImage = req.files?.coverImage?.[0]?.filename || null;
      const promoVideo = req.files?.promoVideo?.[0]?.filename || null;

      const newCourse = new Course({
        title,
        description,
        whatYouWillLearn,
        suggestions,
        createdBy: req.user.id,
        coverImage,
        promoVideo
      });

      await newCourse.save();
      res.status(201).json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// ✅ Generate AI-based Course Outline
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { topic } = req.body;
    const generatedOutline = await generateCourseOutline(topic);
    res.json({ message: 'Course outline generated successfully', outline: generatedOutline });
  } catch (error) {
    res.status(500).json({ message: 'Error generating content', error: error.message });
  }
});

// ✅ Add Chapter
router.post('/:courseId/add-chapter', authMiddleware, async (req, res) => {
  try {
    const { title, content, media } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.chapters.push({ title, content, media });
    await course.save();

    res.status(200).json({ message: 'Chapter added successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ Get All Courses
router.get('/', authMiddleware, async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ Get Course by ID (Preview)
router.get('/:courseId', authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate('assets.quiz');
    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch course', error: err.message });
  }
});

// ✅ Publish Course
router.post('/:courseId/publish', authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (!course.title || course.chapters.length === 0) {
      return res.status(400).json({ message: 'Course must have title and at least one chapter before publishing' });
    }

    course.isPublished = true;
    await course.save();

    res.status(200).json({ message: 'Course published successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error publishing course', error: error.message });
  }
});

module.exports = router;

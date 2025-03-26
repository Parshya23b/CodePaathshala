const express = require('express');
const multer = require('multer');
const Course = require('../models/Course');
const authMiddleware = require('../middleware/authMiddleware');
const OpenAI = require('openai');

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Utility: Generate outline using OpenAI
async function generateCourseOutline(topic) {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Generate a structured course outline for "${topic}" with 5 chapters.`,
        max_tokens: 150
    });
    return response.data.choices[0].text.trim();
}

// ✅ Create Course Manually (Full fields)
router.post('/create', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Teacher' && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Permission denied' });
        }

        const { title, description, whatYouWillLearn, suggestions } = req.body;

        const newCourse = new Course({
            title,
            description,
            whatYouWillLearn,
            suggestions,
            createdBy: req.user.id
        });

        await newCourse.save();
        res.status(201).json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

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

// ✅ Add Chapter to Course
router.post('/:courseId/add-chapter', authMiddleware, async (req, res) => {
    try {
        const { title, content, media } = req.body;
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

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

module.exports = router;

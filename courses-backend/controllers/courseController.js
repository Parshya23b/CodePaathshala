const Course = require('../models/Course');
const path = require('path');

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      learnings,
      tags,
      sharingEnabled,
      watermarkEnabled
    } = req.body;

    // Parse comma-separated strings into arrays if needed
    const learningsArr = typeof learnings === 'string' ? learnings.split(',') : learnings;
    const tagsArr = typeof tags === 'string' ? tags.split(',') : tags;

    // Upload asset filenames or URLs
    const assets = {
      pdf: req.body.pdf || [],
      scorm: req.body.scorm || [],
      audio: req.body.audio || [],
      files: req.body.files || [],
      quiz: req.body.quiz || [],
      video: req.body.video || []
    };

    // Upload cover image and promo video (filenames from multer if uploaded)
    const coverImage = req.files?.coverImage?.[0]?.filename || null;
    const promoVideo = req.files?.promoVideo?.[0]?.filename || req.body.promoVideo || null;

    const newCourse = new Course({
      title,
      description,
      learnings: learningsArr,
      tags: tagsArr,
      assets,
      coverImage,
      promoVideo,
      sharingEnabled,
      watermarkEnabled
    });

    await newCourse.save();
    res.status(201).json({ message: 'Course created successfully', course: newCourse });

  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

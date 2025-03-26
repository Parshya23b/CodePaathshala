const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createEvent, getAllEvents } = require('../controllers/eventController');

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Routes
router.post('/create', upload.single('poster'), createEvent);
router.get('/', getAllEvents);

module.exports = router;

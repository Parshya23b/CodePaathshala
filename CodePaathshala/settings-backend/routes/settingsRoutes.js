const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  updateProfile,
  updateNotifications,
  getUserSettings,
  uploadProfilePicture
} = require('../controllers/settingsController');

// Multer config for profile picture upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    cb(null, `user_${Date.now()}.${ext}`);
  }
});
const upload = multer({ storage });

// Get current user settings
router.get('/:userId', getUserSettings);

// Update profile settings
router.put('/:userId', updateProfile);

// Update notification preferences
router.put('/:userId/notifications', updateNotifications);

// Upload profile picture
router.post('/:userId/upload-picture', upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;

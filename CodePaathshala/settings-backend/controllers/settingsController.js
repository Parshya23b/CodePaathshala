const User = require('../models/User');
const path = require('path');

// Update profile info
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, title, workEmail, aboutMe } = req.body;
    const profilePicture = req.file ? req.file.filename : undefined;

    const updatedFields = {
      firstName,
      lastName,
      title,
      workEmail,
      aboutMe
    };

    if (profilePicture) updatedFields.profilePicture = profilePicture;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updatedFields },
      { new: true }
    );

    res.status(200).json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

// Update notification preferences
exports.updateNotifications = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: { notificationPrefs: req.body } },
      { new: true }
    );

    res.status(200).json({ message: 'Notification preferences updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notifications', error: error.message });
  }
};

// Get settings
exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user settings', error: error.message });
  }
};


// Upload profile picture only
exports.uploadProfilePicture = async (req, res) => {
    try {
      const profilePicture = req.file ? req.file.filename : null;
  
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { profilePicture },
        { new: true }
      );
  
      res.status(200).json({ message: 'Profile picture updated', user });
    } catch (error) {
      res.status(500).json({ message: 'Failed to upload profile picture', error: error.message });
    }
  };
  


exports.getUserSettings = exports.getSettings;

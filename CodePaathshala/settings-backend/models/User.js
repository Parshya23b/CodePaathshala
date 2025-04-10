const mongoose = require('mongoose');

const notificationPrefsSchema = new mongoose.Schema({
  newsAndUpdates: { type: Boolean, default: false },
  tipsAndTutorials: { type: Boolean, default: false },
  userResearch: { type: Boolean, default: false },
  commentNotification: { 
    type: String, 
    enum: ['none', 'mentions', 'all'], 
    default: 'none' 
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  title: String,
  workEmail: String,
  aboutMe: String,
  profilePicture: String, // File name of uploaded image

  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['Admin', 'Teacher', 'Student'], default: 'Student' },
  password: String, // Optional for Google login

  notificationPrefs: notificationPrefsSchema
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

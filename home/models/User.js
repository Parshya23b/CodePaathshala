const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // ✅ Not required for Google users
  googleId: { type: String }, // ✅ New field for Google auth
  role: { type: String, enum: ['Admin', 'Teacher', 'Student'], default: 'Student' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

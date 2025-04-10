const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  type: { type: String, enum: ['assignment', 'class', 'meeting', 'event'], default: 'event' }
});

module.exports = mongoose.model('Schedule', scheduleSchema);

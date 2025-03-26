const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: String,
  date: Date,
  time: String,
  poster: String // filename of uploaded image
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);

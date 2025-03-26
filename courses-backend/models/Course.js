const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  media: { type: String } // URL or file path
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  whatYouWillLearn: { type: String },
  suggestions: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  chapters: [chapterSchema]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);

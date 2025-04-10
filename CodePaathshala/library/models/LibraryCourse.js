const mongoose = require('mongoose');

const libraryCourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  section: String,
  batch: String,
  subject: String,
  description: String,
  modules: [
    {
      type: {
        type: String, // 'pdf', 'video', 'assignment', 'quiz'
        enum: ['pdf', 'video', 'assignment', 'quiz'],
        required: true
      },
      refId: { type: mongoose.Schema.Types.ObjectId, required: true },
      title: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LibraryCourse', libraryCourseSchema);

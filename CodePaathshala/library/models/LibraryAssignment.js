const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  problemStatement: { type: String, required: true },
  language: { type: String, required: true }, // e.g. 'python', 'cpp', etc.
  testCases: [
    {
      input: String,
      expectedOutput: String
    }
  ],
  solution: { type: String }, // Optional: Model answer
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LibraryAssignment', assignmentSchema);

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true }
});

const batchSchema = new mongoose.Schema({
  batchName: { type: String, required: true },
  subject: { type: String, required: true },
  students: [studentSchema], // embedded student emails
}, { timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);

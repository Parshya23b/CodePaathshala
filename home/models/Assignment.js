const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to teacher/admin
    submissions: [
        {
            studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            file: { type: String }, // This can be a file path or link
            submittedAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Assignment', AssignmentSchema);

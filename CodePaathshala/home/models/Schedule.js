const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Teacher/Admin who scheduled it
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // List of users attending the event
}, { timestamps: true });

module.exports = mongoose.model('Schedule', ScheduleSchema);

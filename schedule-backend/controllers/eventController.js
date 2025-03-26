const Event = require('../models/event');
const path = require('path');

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { title, summary, date, time } = req.body;
    const poster = req.file ? req.file.filename : null;

    const newEvent = new Event({
      title,
      summary,
      date,
      time,
      poster
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};



// 📌 GET /api/home/activities/:userId
// ✅ Fetch last 10 activities for a specific user (optionally filtered by type)
const Activity = require('../models/Activity');

// GET /api/home/activities/:userId?range=week
exports.getRecentActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    const { range = 'week' } = req.query;

    let dateThreshold = new Date();

    if (range === 'day') {
      dateThreshold.setDate(dateThreshold.getDate() - 1);
    } else if (range === 'week') {
      dateThreshold.setDate(dateThreshold.getDate() - 7);
    } else if (range === 'month') {
      dateThreshold.setDate(dateThreshold.getDate() - 30);
    }

    const activities = await Activity.find({
      userId,
      createdAt: { $gte: dateThreshold },
    })
      .sort({ createdAt: -1 });

    res.status(200).json({ activities });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch filtered activities', error: error.message });
  }
};


// GET /api/home/weekly-summary/:userId
exports.getWeeklySummary = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Get date 7 days ago
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6); // Last 7 days
  
      const activities = await Activity.find({
        userId,
        createdAt: { $gte: startDate }
      });
  
      // Group by day
      const summary = {};
      for (let i = 0; i < 7; i++) {
        const dateKey = new Date();
        dateKey.setDate(startDate.getDate() + i);
        const formatted = dateKey.toISOString().split('T')[0]; // YYYY-MM-DD
        summary[formatted] = 0;
      }
  
      activities.forEach(activity => {
        const date = new Date(activity.createdAt).toISOString().split('T')[0];
        summary[date] = (summary[date] || 0) + (activity.duration || 0);
      });
  
      res.status(200).json({ summary });
    } catch (err) {
      res.status(500).json({ message: 'Failed to get weekly summary', error: err.message });
    }
  };

  

  // GET /api/home/quick-actions/:userId
exports.getQuickActions = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Example mock quick actions (replace with real DB logic if needed)
      const quickActions = [
        { type: 'course', title: 'Intro to Python', action: 'Resume' },
        { type: 'assignment', title: 'Math Homework 1', action: 'Submit' },
        { type: 'quiz', title: 'JavaScript Basics Quiz', action: 'Start' }
      ];
  
      res.status(200).json({ quickActions });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch quick actions', error: error.message });
    }
  };

  


  const Schedule = require('../models/Schedule');

// GET /api/home/schedule/:userId?month=April
exports.getSchedule = async (req, res) => {
  try {
    const { userId } = req.params;
    const { month } = req.query;

    const start = new Date(`${month} 1, ${new Date().getFullYear()}`);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);

    const events = await Schedule.find({
      userId,
      date: { $gte: start, $lt: end }
    }).sort({ date: 1 });

    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch schedule', error: error.message });
  }
};



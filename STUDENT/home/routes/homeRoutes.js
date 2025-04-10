const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// 📌 Route: Get recent student activities by userId
// GET /api/home/activities/:userId
router.get('/activities/:userId', homeController.getRecentActivities);
router.get('/weekly-summary/:userId', homeController.getWeeklySummary);

// GET /api/home/quick-actions/:userId
router.get('/quick-actions/:userId', homeController.getQuickActions);
router.get('/schedule/:userId', homeController.getSchedule);



module.exports = router;

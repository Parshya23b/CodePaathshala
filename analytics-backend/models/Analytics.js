const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
    totalRevenue: { type: Number, default: 0 },
    newSignups: { type: Number, default: 0 },
    newEnrollments: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 },
    transactions: { type: Number, default: 0 },
    successfulTransactions: { type: Number, default: 0 },
    transactionAmount: { type: Number, default: 0 },
    totalClasses: { type: Number, default: 0 },
    averageDailyClasses: { type: Number, default: 0 },
    averageDailyTests: { type: Number, default: 0 },
    passPercentage: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);

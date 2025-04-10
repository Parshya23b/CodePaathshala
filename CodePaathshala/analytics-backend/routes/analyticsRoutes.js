const express = require('express');
const Analytics = require('../models/Analytics');
const router = express.Router();
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Function to calculate date range based on period
const getDateRange = (period) => {
    const now = new Date();
    let startDate;

    if (period === 'week') {
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'year') {
        startDate = new Date();
        startDate.setFullYear(now.getFullYear() - 1);
    } else {
        startDate = new Date(0); // Default: get all data
    }

    return { startDate, endDate: now };
};

// ** ✅ Fix: Move `/report` before `/:type` to avoid route conflicts **
router.get('/report', async (req, res) => {
    try {
        const { format, period } = req.query;
        const { startDate, endDate } = getDateRange(period);

        const analytics = await Analytics.find({
            createdAt: { $gte: startDate, $lte: endDate }
        }).sort({ createdAt: -1 });

        if (!analytics.length) {
            return res.status(404).json({ message: 'No analytics data available' });
        }

        if (format === 'csv') {
            const fields = ['totalRevenue', 'newSignups', 'newEnrollments', 'activeUsers', 'totalTimeSpent'];
            const json2csvParser = new Parser({ fields });
            const csvData = json2csvParser.parse(analytics);

            res.header('Content-Type', 'text/csv');
            res.attachment('analytics_report.csv');
            return res.send(csvData);

        } else if (format === 'pdf') {
            const doc = new PDFDocument();
            const filePath = './analytics_report.pdf';
            const writeStream = fs.createWriteStream(filePath);

            doc.pipe(writeStream);
            doc.fontSize(18).text('Analytics Report', { align: 'center' });
            doc.moveDown();

            analytics.forEach((item, index) => {
                doc.fontSize(14).text(`Entry ${index + 1}:`);
                doc.fontSize(12).text(`Total Revenue: ${item.totalRevenue}`);
                doc.fontSize(12).text(`New Signups: ${item.newSignups}`);
                doc.fontSize(12).text(`New Enrollments: ${item.newEnrollments}`);
                doc.fontSize(12).text(`Active Users: ${item.activeUsers}`);
                doc.fontSize(12).text(`Total Time Spent: ${item.totalTimeSpent}`);
                doc.moveDown();
            });

            doc.end();

            writeStream.on('finish', async () => {
                res.download(filePath, 'analytics_report.pdf', (err) => {
                    if (!err) fs.unlinkSync(filePath);
                });
            });

        } else {
            return res.status(400).json({ message: 'Invalid format. Use csv or pdf' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ** ✅ POST Route for Updating Analytics Data **
router.post('/update', async (req, res) => {
    try {
        const { 
            totalRevenue, newSignups, newEnrollments, activeUsers, totalTimeSpent,
            transactions, successfulTransactions, transactionAmount,
            totalClasses, averageDailyClasses, averageDailyTests, passPercentage
        } = req.body;

        const newAnalytics = new Analytics({
            totalRevenue, newSignups, newEnrollments, activeUsers, totalTimeSpent,
            transactions, successfulTransactions, transactionAmount,
            totalClasses, averageDailyClasses, averageDailyTests, passPercentage
        });

        await newAnalytics.save();
        res.status(201).json({ message: 'Analytics data updated successfully', analytics: newAnalytics });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ** ✅ GET Route to Retrieve Analytics Based on Type & Period **
router.get('/:type', async (req, res) => {
    try {
        const { period } = req.query;
        const { type } = req.params;
        const { startDate, endDate } = getDateRange(period);

        const analytics = await Analytics.findOne({
            createdAt: { $gte: startDate, $lte: endDate }
        }).sort({ createdAt: -1 });

        if (!analytics) {
            return res.status(404).json({ message: 'No data found for the selected period' });
        }

        let responseData = {};

        switch (type) {
            case 'overview':
                responseData = {
                    totalRevenue: analytics.totalRevenue,
                    newSignups: analytics.newSignups,
                    newEnrollments: analytics.newEnrollments,
                    activeUsers: analytics.activeUsers,
                    totalTimeSpent: analytics.totalTimeSpent
                };
                break;

            case 'revenue':
                responseData = {
                    transactions: analytics.transactions,
                    successfulTransactions: analytics.successfulTransactions,
                    transactionAmount: analytics.transactionAmount
                };
                break;

            case 'performance':
                responseData = {
                    activeUsers: analytics.activeUsers,
                    totalTimeSpent: analytics.totalTimeSpent,
                    totalStudents: analytics.totalStudentsCount
                };
                break;

            case 'engagement':
                responseData = {
                    totalClasses: analytics.totalClasses,
                    averageDailyClasses: analytics.averageDailyClasses,
                    averageDailyTests: analytics.averageDailyTests,
                    passPercentage: analytics.passPercentage
                };
                break;

            default:
                return res.status(400).json({ message: 'Invalid analytics type' });
        }

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ✅ **Final `module.exports` at the end**
module.exports = router;

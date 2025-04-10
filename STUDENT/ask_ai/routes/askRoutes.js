const express = require('express');
const router = express.Router();
const askAIController = require('../controllers/askAIController');

router.post('/', askAIController.askQuestion);

module.exports = router;

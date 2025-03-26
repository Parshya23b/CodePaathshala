const express = require('express');
const router = express.Router();

const {
  createBatch,
  addStudent,
  removeStudent,
  getAllBatches,
  getBatchById,
  importFromCSV,
  downloadCSV
} = require('../controllers/batchController'); // ✅ Destructuring all needed functions

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Create batch
router.post('/create', createBatch);

// Add student
router.post('/:batchId/add-student', addStudent);

// Remove student
router.delete('/:batchId/remove-student/:email', removeStudent);

// Get all batches
router.get('/', getAllBatches);

// Get specific batch
router.get('/:batchId', getBatchById);

// Import students from CSV
router.post('/:batchId/import-csv', upload.single('file'), importFromCSV);

// Download student list as CSV
router.get('/:batchId/download-csv', downloadCSV);

module.exports = router;

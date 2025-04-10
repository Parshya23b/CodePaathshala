const Batch = require('../models/Batch');
const csv = require('csv-parser');
const fs = require('fs');
const { Parser } = require('json2csv');

// Create a new batch
exports.createBatch = async (req, res) => {
  try {
    const { batchName, subject } = req.body;
    const batch = new Batch({ batchName, subject });
    await batch.save();
    res.status(201).json(batch);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create batch', error: err.message });
  }
};

// Add a student to a batch
exports.addStudent = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { email } = req.body;
    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    batch.students.push({ email });
    await batch.save();
    res.status(200).json(batch);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add student', error: err.message });
  }
};

// Remove a student from batch
exports.removeStudent = async (req, res) => {
  try {
    const { batchId, email } = req.params;
    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    batch.students = batch.students.filter(student => student.email !== email);
    await batch.save();
    res.status(200).json(batch);
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove student', error: err.message });
  }
};

// Get all batches
exports.getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find();
    res.status(200).json(batches);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch batches', error: err.message });
  }
};

// Get a specific batch
exports.getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.batchId);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    res.status(200).json(batch);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch batch', error: err.message });
  }
};

// Import students from CSV
exports.importFromCSV = async (req, res) => {
  try {
    const { batchId } = req.params;
    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        if (data.email) results.push({ email: data.email });
      })
      .on('end', async () => {
        const updatedBatch = await Batch.findByIdAndUpdate(
          batchId,
          { $push: { students: { $each: results } } },
          { new: true }
        );
        fs.unlinkSync(req.file.path); // Remove temp CSV file
        res.json({ message: 'CSV imported successfully', batch: updatedBatch });
      });
  } catch (error) {
    res.status(500).json({ message: 'CSV import failed', error: error.message });
  }
};

// Download student list as CSV
exports.downloadCSV = async (req, res) => {
  try {
    const { batchId } = req.params;
    const batch = await Batch.findById(batchId);

    if (!batch) return res.status(404).json({ message: 'Batch not found' });

    const parser = new Parser({ fields: ['email'] });
    const csvData = parser.parse(batch.students);

    res.header('Content-Type', 'text/csv');
    res.attachment(`${batch.batchName}_students.csv`);
    res.send(csvData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to download CSV', error: error.message });
  }
};

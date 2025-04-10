const LibraryAssignment = require('../models/LibraryAssignment');

// ✅ Create assignment
exports.createAssignment = async (req, res) => {
  try {
    const assignment = new LibraryAssignment(req.body);
    await assignment.save();
    res.status(201).json({ message: 'Assignment created', assignment });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create assignment', error: err.message });
  }
};

// ✅ Get all assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await LibraryAssignment.find().sort({ createdAt: -1 });
    res.status(200).json({ assignments });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch assignments', error: err.message });
  }
};

// ✅ Get assignment by ID
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await LibraryAssignment.findById(req.params.assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    res.status(200).json({ assignment });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch assignment', error: err.message });
  }
};

// ✅ Update assignment
exports.updateAssignment = async (req, res) => {
  try {
    const updated = await LibraryAssignment.findByIdAndUpdate(
      req.params.assignmentId,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Assignment not found' });

    res.status(200).json({ message: 'Assignment updated', assignment: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update assignment', error: err.message });
  }
};

// ✅ Delete assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const deleted = await LibraryAssignment.findByIdAndDelete(req.params.assignmentId);
    if (!deleted) return res.status(404).json({ message: 'Assignment not found' });

    res.status(200).json({ message: 'Assignment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete assignment', error: err.message });
  }
};

const axios = require('axios');
const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');

/* -----------------------------------------------------
   ✅ Get Assignment Problem
----------------------------------------------------- */
exports.getAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    res.status(200).json({
      title: assignment.title,
      problemStatement: assignment.problemStatement,
      language: assignment.language
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch assignment', error: err.message });
  }
};

/* -----------------------------------------------------
   ✅ Submit Code (with time, memory, testResults[])
----------------------------------------------------- */
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { userId, code } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const language = assignment.language;
    const testCases = assignment.testCases;

    let passedAll = true;
    const testResults = [];

    for (const testCase of testCases) {
      const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
        language,
        version: '*',
        files: [{ name: 'main.py', content: code }],
        stdin: testCase.input
      });

      const run = response.data.run;
      const actualOutput = run.output.trim();
      const expectedOutput = testCase.expectedOutput.trim();
      const passed = actualOutput === expectedOutput;

      testResults.push({
        input: testCase.input,
        expectedOutput,
        actualOutput,
        passed,
        time: run?.time || 'N/A',
        memory: run?.memory || 'N/A'
      });

      if (!passed) passedAll = false;
    }

    const submission = new AssignmentSubmission({
      userId,
      assignmentId,
      code,
      language,
      verdict: passedAll ? 'Passed' : 'Failed',
      output: passedAll ? 'All test cases passed' : 'Some test cases failed',
      testResults
    });

    await submission.save();

    res.status(200).json({
      message: 'Submission evaluated',
      verdict: submission.verdict,
      testResults
    });
  } catch (err) {
    res.status(500).json({ message: 'Submission failed', error: err.message });
  }
};

/* -----------------------------------------------------
   ✅ Run Code on Custom Input
----------------------------------------------------- */
exports.runCustomTestCase = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { code, input } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    const language = assignment.language;

    const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
      language,
      version: '*',
      files: [{ name: 'main.py', content: code }],
      stdin: input
    });

    const run = response.data.run;

    res.status(200).json({
      message: 'Custom input executed',
      output: run.output.trim(),
      time: run.time || 'N/A',
      memory: run.memory || 'N/A'
    });
  } catch (err) {
    res.status(500).json({ message: 'Execution failed', error: err.message });
  }
};

/* -----------------------------------------------------
   ✅ Get All Submissions by User
----------------------------------------------------- */
exports.getAllUserSubmissions = async (req, res) => {
  try {
    const { userId } = req.params;

    const submissions = await AssignmentSubmission.find({ userId })
      .populate('assignmentId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({ submissions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch submissions', error: err.message });
  }
};

/* -----------------------------------------------------
   ✅ Submission History for Specific Assignment
----------------------------------------------------- */
exports.getUserAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId, userId } = req.params;

    const submissions = await AssignmentSubmission.find({ assignmentId, userId })
      .sort({ createdAt: -1 });

    res.status(200).json({ submissions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch assignment submissions', error: err.message });
  }
};

/* -----------------------------------------------------
   ✅ View Solution
----------------------------------------------------- */
exports.getSolution = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    res.status(200).json({
      title: assignment.title,
      solution: assignment.solution,
      language: assignment.language
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch solution', error: err.message });
  }
};

/* -----------------------------------------------------
   ✅ Submission History (cleaner alias route)
----------------------------------------------------- */
exports.getSubmissionHistory = async (req, res) => {
  try {
    const { assignmentId, userId } = req.params;

    const submissions = await AssignmentSubmission.find({ assignmentId, userId })
      .sort({ createdAt: -1 });

    res.status(200).json({ submissions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch submission history', error: err.message });
  }
};

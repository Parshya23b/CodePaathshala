const LibraryCourse = require('../models/LibraryCourse');

// ✅ Create new course
exports.createCourse = async (req, res) => {
  try {
    const course = new LibraryCourse(req.body);
    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create course', error: err.message });
  }
};

// ✅ Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await LibraryCourse.find().sort({ createdAt: -1 });
    res.status(200).json({ courses });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch courses', error: err.message });
  }
};

// ✅ Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await LibraryCourse.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.status(200).json({ course });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch course', error: err.message });
  }
};

// ✅ Update course
exports.updateCourse = async (req, res) => {
  try {
    const updated = await LibraryCourse.findByIdAndUpdate(
      req.params.courseId,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Course not found' });

    res.status(200).json({ message: 'Course updated', course: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update course', error: err.message });
  }
};

// ✅ Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const deleted = await LibraryCourse.findByIdAndDelete(req.params.courseId);
    if (!deleted) return res.status(404).json({ message: 'Course not found' });

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete course', error: err.message });
  }
};


// ✅ Add a module to a course
exports.addModuleToCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const { type, refId, title } = req.body;
  
      const allowedTypes = ['pdf', 'video', 'assignment', 'quiz'];
      if (!allowedTypes.includes(type)) {
        return res.status(400).json({ message: 'Invalid module type' });
      }
  
      const course = await LibraryCourse.findById(courseId);
      if (!course) return res.status(404).json({ message: 'Course not found' });
  
      course.modules.push({ type, refId, title });
      await course.save();
  
      res.status(200).json({ message: 'Module added successfully', course });
    } catch (err) {
      res.status(500).json({ message: 'Failed to add module', error: err.message });
    }
  };
  

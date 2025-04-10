const CourseProgress = require('../models/CourseProgress');
const Course = require('../models/Course');
const Section = require('../models/Section');
const Lecture = require('../models/Lecture');

/* --------------------------------------------
   ✅ Get All Courses With Progress by Status
   Endpoint: GET /api/courses/:userId?status=active|completed|incomplete
-------------------------------------------- */
exports.getCoursesByStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    const query = { userId };
    if (status) query.status = status;

    const progress = await CourseProgress.find(query)
      .populate({
        path: 'courseId',
        select: 'title subtitle thumbnail instructor',
      })
      .exec();

    const formatted = progress.map((item) => ({
      course: item.courseId,
      status: item.status,
      completedLectures: item.completedLectures,
    }));

    res.status(200).json({ courses: formatted });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses', error: err.message });
  }
};

/* --------------------------------------------
   ✅ Get Full Course Details with Curriculum
   Endpoint: GET /api/courses/detail/:courseId
-------------------------------------------- */
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const sections = await Section.find({ courseId }).sort({ order: 1 }).lean();

    // Attach lectures under each section
    for (const section of sections) {
      section.lectures = await Lecture.find({ sectionId: section._id }).sort({ createdAt: 1 }).lean();
    }

    res.status(200).json({
      course,
      curriculum: sections,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load course details', error: err.message });
  }
};

/* --------------------------------------------
   ✅ Update Lecture Progress
   Endpoint: POST /api/courses/update-progress
-------------------------------------------- */
exports.updateProgress = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.body;

    if (!userId || !courseId || !lectureId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        completedLectures: [lectureId],
        status: 'active',
      });
    } else {
      if (!progress.completedLectures.includes(lectureId)) {
        progress.completedLectures.push(lectureId);
      }
      progress.lastAccessed = new Date();
    }

    await progress.save();
    res.status(200).json({ message: 'Progress updated', progress });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update progress', error: error.message });
  }
};

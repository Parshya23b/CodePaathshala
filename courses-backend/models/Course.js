const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: String,
  content: String,
  media: String // URL or filename for media in chapter
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    whatYouWillLearn: String,
    suggestions: [String], // tags/keywords like "Basics of C++"

    // Cover image and promo video
    coverImage: String, // filename of uploaded course cover image
    promoVideo: String, // filename of uploaded promo video

    // File uploads or external links
    assets: {
      pdf: [{ type: String }],     // filenames or links
      scorm: [{ type: String }],
      audio: [{ type: String }],
      files: [{ type: String }],
      quiz: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }]
    },

    // Chapter-wise structure
    chapters: [chapterSchema],

    isPublished: {
      type: Boolean,
      default: false
    },
    

    // Creator reference
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);

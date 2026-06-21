const mongoose = require("mongoose");

// =========================
// LESSON MODEL
// =========================
const lessonSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },

  title: {
    type: String,
    required: true,
  },

  videoUrl: {
    type: String,
    default: "",
  },

  text: {
    type: String,
    default: "",
  },

  imageUrl: {
    type: String,
    default: "",
  },

  headingStyle: {
    type: String,
    enum: ["h2", "h3", "h4"],
    default: "h3",
  },

  order: {
    type: Number,
    default: 0,
  },
});

// =========================
// COURSE MODEL
// =========================
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  instructor: {
    type: String,
    required: true,
  },

  description: String,
  image: String,
  duration: {
    type: Number,
    default: 0,
  },

  content: [lessonSchema],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Course", courseSchema);

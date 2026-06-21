const express = require("express");
const router = express.Router();

const Course = require("../models/Course");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

// =========================
// GET ALL COURSES
// =========================
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// GET SINGLE COURSE
// =========================
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// CREATE COURSE
// =========================
router.post("/", protect, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "instructor") {
      return res.status(403).json({ message: "Only instructors allowed" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { title, description, duration, image, content } = req.body;

    const course = new Course({
      title,
      description,
      duration: Number(duration) || 0,
      image,
      content: Array.isArray(content) ? content : [],
      instructor: `${user.firstName} ${user.lastName}`,
    });

    await course.save();

    res.status(201).json({
      message: "Course created",
      course,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// =========================
// ADD LESSON
// =========================
router.post("/:id/lessons", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const { title, text, videoUrl, imageUrl, headingStyle } = req.body;

    course.content.push({
      title,
      text,
      videoUrl,
      imageUrl: imageUrl || "",
      headingStyle: headingStyle || "h3",
      order: course.content.length,
    });

    await course.save();

    res.json({ message: "Lesson added", course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// EDIT LESSON (SAFE VERSION)
// =========================
router.put("/:id/lessons/:lessonId", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lesson = course.content.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    lesson.title = req.body.title || lesson.title;
    lesson.text = req.body.text || lesson.text;
    lesson.videoUrl = req.body.videoUrl || lesson.videoUrl;
    lesson.imageUrl = req.body.imageUrl || lesson.imageUrl;
    lesson.headingStyle = req.body.headingStyle || lesson.headingStyle;

    await course.save();

    res.json({ message: "Lesson updated", course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// DELETE LESSON (SAFE VERSION)
// =========================
router.delete("/:id/lessons/:lessonId", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lesson = course.content.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    lesson.deleteOne(); // correct Mongoose way

    await course.save();

    res.json({ message: "Lesson deleted", course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// UPDATE COURSE (FIXED)
// =========================
router.put("/:id", protect, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "instructor") {
      return res.status(403).json({ message: "Only instructors allowed" });
    }

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const { title, description, image, duration } = req.body;

    course.title = title;
    course.description = description;
    course.image = image;
    course.duration = Number(duration) || 0;

    await course.save();

    res.json({
      message: "Course updated successfully",
      course,
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

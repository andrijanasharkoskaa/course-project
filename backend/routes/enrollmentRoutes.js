const express = require("express");
const router = express.Router();

const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Certificate = require("../models/Certificate"); // ✅ ADDED
const protect = require("../middleware/authMiddleware");

// GET all enrollments for current user
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const enrollments = await Enrollment.find({ userId }).populate("courseId");
    res.json(enrollments);
  } catch (err) {
    console.error("Error fetching enrollments:", err);
    res.status(500).json({
      message: "Error fetching enrollments",
      error: err.message,
    });
  }
});

// GET enrollment for a specific course
router.get("/:courseId", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      return res.status(404).json({ message: "Not enrolled" });
    }

    res.json(enrollment);
  } catch (err) {
    console.error("Error fetching enrollment:", err);
    res.status(500).json({
      message: "Error fetching enrollment",
      error: err.message,
    });
  }
});

// ENROLL in a course
router.post("/enroll/:courseId", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ message: "CourseId required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let enrollment = await Enrollment.findOne({ userId, courseId });
    if (enrollment) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    enrollment = await Enrollment.create({
      userId,
      courseId,
      completedLessons: [],
      lastLesson: null,
    });

    res.status(201).json(enrollment);
  } catch (err) {
    console.error("Error enrolling:", err);
    res.status(500).json({
      message: "Error enrolling in course",
      error: err.message,
    });
  }
});

// TOGGLE lesson complete + 🎓 CERTIFICATE LOGIC
router.post("/progress", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, lessonId } = req.body;

    if (!courseId || !lessonId) {
      return res
        .status(400)
        .json({ message: "courseId and lessonId required" });
    }

    let enrollment = await Enrollment.findOne({ userId, courseId }).populate(
      "courseId",
    );

    if (!enrollment) {
      enrollment = await Enrollment.create({
        userId,
        courseId,
        completedLessons: [],
        lastLesson: lessonId,
      });
    }

    const lessonIdStr = String(lessonId);

    const exists = enrollment.completedLessons
      .map(String)
      .includes(lessonIdStr);

    if (exists) {
      enrollment.completedLessons = enrollment.completedLessons.filter(
        (id) => String(id) !== lessonIdStr,
      );
    } else {
      enrollment.completedLessons.push(lessonId);
    }

    enrollment.lastLesson = lessonId;

    await enrollment.save();

    // ================================
    // 🎓 CERTIFICATE LOGIC (IMPORTANT)
    // ================================

    const course = enrollment.courseId;

    const totalLessons = course.content?.length || 0;
    const completed = enrollment.completedLessons.length;

    const progress =
      totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

    if (progress === 100) {
      const alreadyExists = await Certificate.findOne({
        userId,
        courseId,
      });

      if (!alreadyExists) {
        await Certificate.create({
          userId,
          courseId,
          hoursSpent: course.duration,
        });
      }
    }

    res.json({
      enrollment,
      progress,
    });
  } catch (err) {
    console.error("Progress update error:", err);
    res.status(500).json({
      message: "Error updating progress",
      error: err.message,
    });
  }
});

// UNENROLL
router.delete("/:courseId", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOneAndDelete({ userId, courseId });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json({ message: "Unenrolled successfully" });
  } catch (err) {
    console.error("Error unenrolling:", err);
    res.status(500).json({
      message: "Error unenrolling",
      error: err.message,
    });
  }
});

module.exports = router;

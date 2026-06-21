const express = require("express");
const router = express.Router();

// Mock instructors
let instructors = [
  {
    id: 1,
    name: "Dr. Emma Wilson",
    expertise: "Data Science",
    students: 120000,
  },
  {
    id: 2,
    name: "Mark Johnson",
    expertise: "Web Development",
    students: 98000,
  },
];

// GET all instructors
router.get("/", (req, res) => {
  res.json(instructors);
});

// Add new instructor
router.post("/", (req, res) => {
  const newInstructor = { id: Date.now(), ...req.body };
  instructors.push(newInstructor);
  res.status(201).json(newInstructor);
});

module.exports = router;


const express = require('express');
const pool = require('../config/database');
const router = express.Router();

router.post('/enroll', async (req,res)=>{
  const { student_id, course_id } = req.body;
  await pool.query(
    "INSERT INTO enrollments(student_id,course_id) VALUES($1,$2)",
    [student_id,course_id]
  );
  res.json({message:"Enrolled"});
});

router.get('/lessons/:courseId', async (req,res)=>{
  const result = await pool.query(
    "SELECT * FROM lessons WHERE course_id=$1",
    [req.params.courseId]
  );
  res.json(result.rows);
});

module.exports = router;

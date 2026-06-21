import React, { useEffect, useState } from "react";
import CourseCard from "../Components/CourseCard";
import { useNavigate } from "react-router-dom";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then((res) => res.json())
      .then((data) => {
        console.log("COURSES:", data);
        setCourses(data);
      });
  }, []);

  //  FIXED ENROLL HANDLER
  const handleEnroll = async (courseId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to enroll");
      navigate("/login"); // better UX
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/enrollments/enroll/${courseId}`, //  correct endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Enrollment failed");
        return;
      }

      alert("Enrolled successfully!");

      //  trigger refresh for enrolled courses
      window.dispatchEvent(new Event("userChanged"));
    } catch (err) {
      console.error("Enroll error:", err);
      alert("Server error. Try again.");
    }
  };

  return (
    <div className="courses-grid">
      {courses.map((course, index) => (
        <CourseCard
          key={course._id || course.id || index}
          course={course}
          onEnroll={handleEnroll}
        />
      ))}
    </div>
  );
}

export default CoursesPage;

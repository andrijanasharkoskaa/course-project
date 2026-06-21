import React from "react";
import { useNavigate } from "react-router-dom";

function CourseCard({ course, onEnroll }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isInstructor = user?.role === "instructor";

  // OPEN COURSE DETAILS
  const handleOpenCourse = () => {
    if (!course?._id) {
      console.error("Course _id missing:", course);
      return;
    }

    navigate(`/courses/${course._id}`);
  };

  // ENROLL HANDLER (students only)
  const handleEnrollClick = (e) => {
    e.stopPropagation();

    if (!course?._id) {
      alert("Course ID missing");
      return;
    }

    onEnroll(course._id);
  };

  // EDIT HANDLER (instructors)
  const handleEditClick = (e) => {
    e.stopPropagation();

    if (!course?._id) return;

    navigate(`/courses/${course._id}`);
  };

  return (
    <div className="course-card" onClick={handleOpenCourse}>
      {/* IMAGE */}
      <div className="course-image">
        <img
          src={course.image || "https://via.placeholder.com/300x180"}
          alt={course.title}
        />
      </div>

      {/* CONTENT */}
      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>

        <p className="course-instructor">By {course.instructor || "Unknown"}</p>

        <p className="course-description">
          {course.description || "No description available"}
        </p>

        <div className="course-meta">
          <span>⏱ {course.duration || 0} hours</span>
        </div>

        {/* 🔥 ROLE-BASED BUTTON */}
        {isInstructor ? (
          <button className="cta-btn enroll-btn" onClick={handleEditClick}>
            Edit Course
          </button>
        ) : (
          <button className="cta-btn enroll-btn" onClick={handleEnrollClick}>
            Enroll
          </button>
        )}
      </div>
    </div>
  );
}

export default CourseCard;

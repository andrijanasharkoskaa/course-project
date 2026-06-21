import React from "react";
import { useNavigate } from "react-router-dom";
import { generateCertificate } from "../utils/certificate";

function EnrolledCourseCard({ enrollment }) {
  const navigate = useNavigate();

  const course = enrollment?.courseId;

  if (!course) {
    return (
      <div className="enrolled-course-card">
        <p style={{ padding: "20px", color: "#666" }}>
          ⚠️ Course no longer available
        </p>
      </div>
    );
  }

  const totalLessons = course?.content?.length || 0;
  const completed = enrollment?.completedLessons?.length || 0;

  const progress =
    totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

  return (
    <div className="enrolled-course-card">
      <div
        className="enrolled-course-image"
        onClick={() => navigate(`/courses/${course._id}`)}
      >
        <img src={course.image} alt={course.title} />
      </div>

      <div className="enrolled-course-content">
        <h3>{course.title}</h3>

        {/* PROGRESS */}
        <div className="progress-section">
          <div className="progress-header">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="progress-text">
            {completed}/{totalLessons} lessons
          </div>
        </div>

        {/* BUTTONS */}
        <button
          className="btn-course"
          onClick={() => navigate(`/courses/${course._id}`)}
        >
          Continue Learning
        </button>

        {progress === 100 && (
          <button
            className="btn-course btn-certificate"
            onClick={() =>
              generateCertificate(
                JSON.parse(localStorage.getItem("user")),
                course,
              )
            }
          >
            Download Certificate 🎓
          </button>
        )}
      </div>
    </div>
  );
}

export default EnrolledCourseCard;

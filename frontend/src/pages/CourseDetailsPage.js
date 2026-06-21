import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LessonEditor from "../Components/LessonEditor";

function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLessonEditor, setShowLessonEditor] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const isInstructor = user?.role === "instructor";
  const isAuthor =
    course &&
    user &&
    course.instructor === `${user.firstName} ${user.lastName}`;

  // =========================
  // FETCH COURSE
  // =========================
  const fetchCourse = async () => {
    const res = await fetch(`http://localhost:5000/api/courses/${id}`);
    const data = await res.json();
    setCourse(data);
  };

  // =========================
  // FETCH ENROLLMENT
  // =========================
  const fetchEnrollment = async () => {
    if (!token) return;

    const res = await fetch(`http://localhost:5000/api/enrollments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setEnrollment(data);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchCourse();
      await fetchEnrollment();
      setLoading(false);
    };

    load();
  }, [id]);

  // =========================
  // TOGGLE LESSON COMPLETE
  // =========================
  const handleMarkLessonComplete = async (lessonId) => {
    const res = await fetch("http://localhost:5000/api/enrollments/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        courseId: id,
        lessonId,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setEnrollment(data);
    }
  };

  // =========================
  // DELETE LESSON
  // =========================
  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/courses/${id}/lessons/${lessonId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.ok) {
        const data = await res.json();
        setCourse(data.course);
        alert("Lesson deleted successfully!");
      } else {
        alert("Failed to delete lesson");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting lesson");
    }
  };

  // =========================
  // OPEN LESSON EDITOR
  // =========================
  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setShowLessonEditor(true);
  };

  const handleAddLesson = () => {
    setEditingLesson(null);
    setShowLessonEditor(true);
  };

  const handleSaveLesson = (updatedCourse) => {
    setCourse(updatedCourse);
    setShowLessonEditor(false);
    setEditingLesson(null);
  };

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
  if (!course) return <p style={{ padding: 40 }}>Course not found</p>;

  // =========================
  // PROGRESS CALCULATION
  // =========================
  const totalLessons = course.content?.length || 0;
  const completed = enrollment?.completedLessons?.length || 0;

  const progress =
    totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

  return (
    <div className="course-detail-wrapper">
      {/* FIXED PROGRESS BAR */}
      <div className="progress-sidebar">
        <h3>Your Progress</h3>

        <div className="progress-vertical-bar">
          <div
            className="progress-vertical-fill"
            style={{ height: `${progress}%` }}
          />
        </div>

        <div className="progress-circle">{progress}%</div>
        <p className="remaining-text">
          {completed}/{totalLessons} lessons
        </p>
      </div>

      {/* COURSE CONTENT */}
      <div className="course-detail-page">
        <div className="course-header">
          <div>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
          </div>
          {isInstructor && isAuthor && (
            <div className="instructor-controls">
              <button className="btn-add-lesson" onClick={handleAddLesson}>
                + Add Lesson
              </button>
            </div>
          )}
        </div>

        {/* LESSONS */}
        {course.content?.length === 0 && <p>No lessons found ❌</p>}

        {course.content?.map((lesson, index) => {
          const isCompleted = enrollment?.completedLessons?.includes(
            lesson._id,
          );
          const HeadingTag = lesson.headingStyle || "h3";

          return (
            <div
              key={lesson._id || index}
              className={`lesson-card-ui ${isCompleted ? "completed" : ""}`}
            >
              <div className="lesson-title-header">
                <div className="lesson-title-content">
                  <div
                    className={`lesson-checkbox ${isCompleted ? "checked" : ""}`}
                  >
                    {isCompleted ? "✓" : ""}
                  </div>
                  <div>
                    <HeadingTag style={{ margin: "0 0 4px 0" }}>
                      {lesson.title}
                    </HeadingTag>
                    <span className="lesson-number">Lesson {index + 1}</span>
                  </div>
                </div>
                {isInstructor && isAuthor && (
                  <div className="lesson-actions">
                    <button
                      className="btn-edit-lesson"
                      onClick={() => handleEditLesson(lesson)}
                      title="Edit lesson"
                    >
                      ✎
                    </button>
                    <button
                      className="btn-delete-lesson"
                      onClick={() => handleDeleteLesson(lesson._id)}
                      title="Delete lesson"
                    >
                      🗑
                    </button>
                  </div>
                )}
              </div>

              {lesson.imageUrl && (
                <img
                  src={lesson.imageUrl}
                  alt={lesson.title}
                  className="lesson-image"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}

              {lesson.videoUrl && (
                <div className="lesson-video">
                  <iframe
                    width="100%"
                    height="315"
                    src={lesson.videoUrl}
                    title={lesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              <div
                className="lesson-content"
                dangerouslySetInnerHTML={{ __html: lesson.text }}
              />

              <div className="mark-complete-container">
                <button
                  className={`btn-mark-complete ${
                    isCompleted ? "completed" : ""
                  }`}
                  onClick={() => handleMarkLessonComplete(lesson._id)}
                >
                  {isCompleted ? "✓ Completed" : "Mark Complete"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* LESSON EDITOR MODAL */}
      {showLessonEditor && (
        <LessonEditor
          lesson={editingLesson}
          courseId={id}
          onSave={handleSaveLesson}
          onCancel={() => {
            setShowLessonEditor(false);
            setEditingLesson(null);
          }}
        />
      )}
    </div>
  );
}

export default CourseDetailPage;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import LessonEditor from "../Components/LessonEditor";

function InstructorCourseEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [course, setCourse] = useState({
    title: "",
    description: "",
    image: "",
    duration: "",
  });

  const [loading, setLoading] = useState(true);
  const [showLessonEditor, setShowLessonEditor] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  // =========================
  // FETCH COURSE
  // =========================
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/courses/${id}`);
        const data = await res.json();

        setCourse({
          title: data.title || "",
          description: data.description || "",
          image: data.image || "",
          duration: data.duration || "",
        });

        setLoading(false);
      } catch (err) {
        console.error("Fetch course error:", err);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SAVE COURSE
  // =========================
  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...course,
          duration: Number(course.duration),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error updating course");
        return;
      }

      alert("Course updated successfully!");
      navigate(`/courses/${id}`);
    } catch (err) {
      console.error("Save error:", err);
      alert("Server error");
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
        setCourse({
          ...course,
          content: data.course.content,
        });
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
    setCourse({
      ...course,
      content: updatedCourse.content,
    });
    setShowLessonEditor(false);
    setEditingLesson(null);
  };

  if (loading) return <p>Loading course...</p>;

  return (
    <div className="dashboard-container">
      <div className="course-form">
        <h2>Edit Course</h2>

        {/* TITLE */}
        <input
          name="title"
          placeholder="Course Title"
          value={course.title}
          onChange={handleChange}
        />

        {/* DESCRIPTION (RICH TEXT) */}
        <label className="form-label">Course Description</label>
        <ReactQuill
          value={course.description}
          onChange={(value) => setCourse({ ...course, description: value })}
          theme="snow"
        />

        {/* IMAGE */}
        <input
          name="image"
          placeholder="Image URL"
          value={course.image}
          onChange={handleChange}
        />
        {course.image && (
          <img
            src={course.image}
            alt="Course"
            style={{ maxWidth: "200px", marginTop: "10px" }}
            onError={(e) => (e.target.style.display = "none")}
          />
        )}

        {/* DURATION */}
        <input
          name="duration"
          placeholder="Duration (hours)"
          value={course.duration}
          onChange={handleChange}
        />

        {/* SAVE */}
        <button className="cta-btn" onClick={handleSave}>
          Save Course Changes
        </button>
      </div>

      {/* LESSONS MANAGEMENT */}
      <div className="course-form lessons-section">
        <div className="lessons-header">
          <h2>Manage Lessons</h2>
          <button className="btn-add-lesson" onClick={handleAddLesson}>
            + Add New Lesson
          </button>
        </div>

        {!course.content || course.content.length === 0 ? (
          <p>No lessons yet. Add one to get started!</p>
        ) : (
          <div className="lessons-list">
            {course.content.map((lesson, index) => (
              <div key={lesson._id || index} className="lesson-item">
                <div className="lesson-item-content">
                  <h4>{lesson.title}</h4>
                  <p className="lesson-item-meta">Lesson {index + 1}</p>
                  {lesson.imageUrl && (
                    <span className="lesson-item-badge">📷 Has Image</span>
                  )}
                  {lesson.videoUrl && (
                    <span className="lesson-item-badge">🎥 Has Video</span>
                  )}
                </div>
                <div className="lesson-item-actions">
                  <button
                    className="btn-edit-lesson-small"
                    onClick={() => handleEditLesson(lesson)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete-lesson-small"
                    onClick={() => handleDeleteLesson(lesson._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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

export default InstructorCourseEditPage;

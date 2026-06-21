import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function InstructorDashboard() {
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    title: "",
    description: "",
    image: "",
    duration: "",
    content: "",
  });

  const handleChange = (e) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formattedCourse = {
      ...course,
      duration: Number(course.duration),
      content: course.content
        ? [
            {
              title: "Main Content",
              text: course.content,
              order: 1,
            },
          ]
        : [],
    };

    try {
      const res = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedCourse),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error creating course");
        return;
      }

      alert("Course created successfully!");
      navigate("/courses");
    } catch (err) {
      console.error("CREATE ERROR:", err);
      alert("Server error");
    }
  };

  return (
    <div className="dashboard-container">
      <form className="course-form" onSubmit={handleSubmit}>
        <h2>Create Course</h2>

        {/* TITLE */}
        <input
          name="title"
          placeholder="Course Title"
          value={course.title}
          onChange={handleChange}
          required
        />

        {/* DESCRIPTION */}
        <label className="form-label">Course Description</label>
        <ReactQuill
          value={course.description}
          onChange={(value) => setCourse({ ...course, description: value })}
          theme="snow"
          placeholder="Enter a short description..."
        />

        {/* IMAGE */}
        <input
          name="image"
          placeholder="Hero Image URL"
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

        {/* CONTENT */}
        <label className="form-label">Full Course Content</label>
        <ReactQuill
          value={course.content}
          onChange={(value) => setCourse({ ...course, content: value })}
          theme="snow"
          placeholder="Enter full course content..."
        />

        {/* SUBMIT */}
        <button className="cta-btn" type="submit">
          Publish Course
        </button>
      </form>
    </div>
  );
}

export default InstructorDashboard;

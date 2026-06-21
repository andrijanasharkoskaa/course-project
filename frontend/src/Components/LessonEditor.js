import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function LessonEditor({ lesson, onSave, onCancel, courseId }) {
  const safeLesson = lesson || {};

  const [formData, setFormData] = useState({
    title: safeLesson.title || "",
    text: safeLesson.text || "",
    videoUrl: safeLesson.videoUrl || "",
    imageUrl: safeLesson.imageUrl || "",
    headingStyle: safeLesson.headingStyle || "h3",
  });

  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTextChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      text: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Lesson title is required");
      return;
    }

    setSaving(true);

    try {
      const isEditing = !!safeLesson._id;

      const endpoint = isEditing
        ? `http://localhost:5000/api/courses/${courseId}/lessons/${safeLesson._id}`
        : `http://localhost:5000/api/courses/${courseId}/lessons`;

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save lesson");
      }

      if (onSave) {
        onSave(data.course || data);
      }

      alert(
        isEditing
          ? "Lesson updated successfully!"
          : "Lesson added successfully!",
      );

      if (onCancel) {
        onCancel();
      }
    } catch (err) {
      console.error("Lesson save error:", err);
      alert(err.message || "Error saving lesson");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="lesson-editor-modal">
      <div className="lesson-editor-overlay" onClick={onCancel}></div>

      <div className="lesson-editor-content">
        <div className="lesson-editor-header">
          <h2>{safeLesson._id ? "Edit Lesson" : "Add New Lesson"}</h2>
          <button className="close-btn" onClick={onCancel} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="lesson-editor-form">
          <div className="form-group">
            <label>Lesson Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter lesson title"
              required
            />
          </div>

          <div className="form-group">
            <label>Heading Style</label>
            <select
              name="headingStyle"
              value={formData.headingStyle}
              onChange={handleChange}
            >
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
            </select>
          </div>

          <div className="form-group">
            <label>Lesson Content</label>
            <ReactQuill
              theme="snow"
              value={formData.text}
              onChange={handleTextChange}
              placeholder="Write your lesson here..."
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            {formData.imageUrl && (
              <div className="image-preview">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                    marginTop: "10px",
                    borderRadius: "8px",
                  }}
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Video URL</label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://youtube.com/embed/..."
            />
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="btn-cancel"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "Saving..." : "Save Lesson"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LessonEditor;

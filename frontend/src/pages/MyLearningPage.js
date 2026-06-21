import React, { useEffect, useState } from "react";
import EnrolledCourseCard from "../Components/EnrolledCourseCard";

function MyLearningPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/enrollments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch enrollments");
        }

        const data = await res.json();
        setEnrollments(data);
      } catch (error) {
        console.error("Enrollment fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [token]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="my-learning-grid">
      {enrollments.length === 0 ? (
        <p>No enrollments found</p>
      ) : (
        enrollments.map((enrollment) => (
          <EnrolledCourseCard key={enrollment._id} enrollment={enrollment} />
        ))
      )}
    </div>
  );
}

export default MyLearningPage;

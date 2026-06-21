import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import Layout from "./Components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CoursesPage from "./pages/CoursesPage";
import MyLearningPage from "./pages/MyLearningPage";
import CourseDetailPage from "./pages/CourseDetailsPage";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorCourseEditPage from "./pages/InstructorCourseEditPage";

import bannerImg from "./imgs/banner-img3.png";
import "react-quill/dist/quill.snow.css";

function App() {
  const companies = [
    {
      name: "Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    },
    {
      name: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    },
    {
      name: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    },
    {
      name: "Meta",
      logo: "https://cdn.simpleicons.org/meta/1877F2",
    },
    {
      name: "Netflix",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    },
    {
      name: "IBM",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    },
  ];

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* HOME PAGE */}
        <Route
          index
          element={
            <>
              {/* HERO */}
              <div className="banner">
                <div className="banner-text">
                  <h1>Learn New Skills Anytime, Anywhere.</h1>
                  <p>
                    Join thousands of students mastering modern technologies.
                  </p>

                  <Link to="/courses">
                    <button className="cta-btn">Browse Courses</button>
                  </Link>
                </div>

                <div className="banner-img">
                  <img src={bannerImg} alt="banner" />
                </div>
              </div>

              {/* COMPANY STRIP */}
              <section className="company-strip">
                <p>Our students work at</p>

                <div className="logo-track">
                  <div className="logo-slide">
                    {/* FIRST LOOP */}
                    {companies.map((c, i) => (
                      <img
                        key={`a-${i}`}
                        src={c.logo}
                        alt={c.name}
                        className="company-logo"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/80?text=Logo";
                        }}
                      />
                    ))}

                    {/* SECOND LOOP */}
                    {companies.map((c, i) => (
                      <img
                        key={`b-${i}`}
                        src={c.logo}
                        alt={c.name}
                        className="company-logo"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/80?text=Logo";
                        }}
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* TESTIMONIALS */}
              <section className="testimonials">
                <h2>What Students Say</h2>

                <div className="testimonial-grid">
                  {[
                    {
                      name: "Anna",
                      text: "This platform helped me switch careers in 3 months!",
                    },
                    {
                      name: "Mark",
                      text: "The lessons are clear and very practical.",
                    },
                    {
                      name: "Elena",
                      text: "I love the interactive learning experience!",
                    },
                  ].map((t, i) => (
                    <div key={i} className="testimonial-card">
                      <div className="avatar">{t.name[0]}</div>
                      <p>"{t.text}"</p>
                      <h4>{t.name}</h4>
                    </div>
                  ))}
                </div>
              </section>

              {/* ABOUT */}
              <section className="about">
                <h2>About LearnHub</h2>
                <p>
                  LearnHub is a modern e-learning platform designed to help
                  students and professionals upgrade their skills with
                  structured courses, interactive lessons, and real-world
                  projects.
                </p>
              </section>

              {/* FOOTER */}
              <footer className="footer">
                <div>
                  <h3>LearnHub</h3>
                  <p>Learn. Build. Grow.</p>
                </div>

                <div>
                  <p>
                    © {new Date().getFullYear()} LearnHub. All rights reserved.
                  </p>
                </div>
              </footer>
            </>
          }
        />

        {/* ROUTES */}
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:id" element={<CourseDetailPage />} />
        <Route path="my-learning" element={<MyLearningPage />} />
        <Route path="instructor" element={<InstructorDashboard />} />
        <Route
          path="/instructor/course/edit/:id"
          element={<InstructorCourseEditPage />}
        />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}

export default App;

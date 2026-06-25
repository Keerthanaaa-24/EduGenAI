import Navbar from "../components/Navbar";

import {
  FaRobot,
  FaFileAlt,
  FaClipboardList,
  FaCalendarAlt,
  FaChartLine,
  FaFire,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } =
    useAuth();

  return (
    <>
      <Navbar />

      <div className="dashboard-container">

        {/* HERO */}

        <div className="hero-card">

          <h1>
            👋 Welcome Back,
            {" "}
            {user?.name ||
              "Student"}
          </h1>

          <p>
            Continue your
            AI-powered learning
            journey with
            EduGen AI.
          </p>

          <div className="hero-badges">

            <span>
              🔥 Streak:
              1 Day
            </span>

            <span>
              ⭐ Rating:
              Beginner
            </span>

            <span>
              📈 Progress:
              0%
            </span>

          </div>

        </div>

        {/* STATS */}

        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">
              📄
            </div>

            <h3>
              Notes Upload
            </h3>

            <p>
              Upload study
              materials
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              🤖
            </div>

            <h3>
              AI Chat
            </h3>

            <p>
              Ask questions
              instantly
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              📝
            </div>

            <h3>
              Quiz Generator
            </h3>

            <p>
              Practice with
              MCQs
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              📊
            </div>

            <h3>
              Analytics
            </h3>

            <p>
              Track your
              progress
            </p>
          </div>

        </div>

        {/* FEATURES */}

        <h2 className="section-title">
          🚀 Features
        </h2>

        <div className="feature-grid">

          <div className="feature-card">

            <FaRobot className="feature-icon" />

            <h3>
              AI Chat Assistant
            </h3>

            <p>
              Ask questions
              from uploaded
              notes using AI.
            </p>

          </div>

          <div className="feature-card">

            <FaFileAlt className="feature-icon" />

            <h3>
              Smart Summary
            </h3>

            <p>
              Generate detailed
              revision notes.
            </p>

          </div>

          <div className="feature-card">

            <FaClipboardList className="feature-icon" />

            <h3>
              Quiz Generator
            </h3>

            <p>
              Generate MCQs and
              evaluate yourself.
            </p>

          </div>

          <div className="feature-card">

            <FaCalendarAlt className="feature-icon" />

            <h3>
              Study Planner
            </h3>

            <p>
              Personalized
              planning using AI.
            </p>

          </div>

          <div className="feature-card">

            <FaChartLine className="feature-icon" />

            <h3>
              Analytics
            </h3>

            <p>
              Monitor learning
              performance.
            </p>

          </div>

          <div className="feature-card">

            <FaFire className="feature-icon" />

            <h3>
              Daily Streak
            </h3>

            <p>
              Stay consistent
              every day.
            </p>

          </div>

        </div>

        {/* RECENT ACTIVITY */}

        <div className="activity-card">

          <h2>
            📌 Recent Activity
          </h2>

          <ul>

            <li>
              Upload a PDF to
              start learning.
            </li>

            <li>
              Generate a quiz
              and test yourself.
            </li>

            <li>
              Create summaries
              for revision.
            </li>

            <li>
              Build a study
              planner.
            </li>

          </ul>

        </div>

      </div>
    </>
  );
}

export default Dashboard;

import {
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";

import {
  getAnalytics,
} from "../services/analyticsService";

function Analytics() {

  const [analytics,
    setAnalytics] =
    useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics =
    async () => {

      try {

        const result =
          await getAnalytics();

        setAnalytics(
          result.analytics
        );

      } catch (error) {

        console.log(error);

      }
    };

  if (!analytics) {
    return (
      <>
        <Navbar />
        <h2>
          Loading Analytics...
        </h2>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="dashboard-container">

        <h1>
          📊 Learning Analytics
        </h1>

        <div className="stats-grid">

          <div className="stat-card">
            <h2>
              📄
            </h2>
            <h3>
              Documents
            </h3>
            <p>
              {
                analytics.documentsUploaded
              }
            </p>
          </div>

          <div className="stat-card">
            <h2>
              📝
            </h2>
            <h3>
              Quiz Attempts
            </h3>
            <p>
              {
                analytics.quizAttempts
              }
            </p>
          </div>

          <div className="stat-card">
            <h2>
              📚
            </h2>
            <h3>
              Summaries
            </h3>
            <p>
              {
                analytics.summariesGenerated
              }
            </p>
          </div>

          <div className="stat-card">
            <h2>
              📅
            </h2>
            <h3>
              Plans
            </h3>
            <p>
              {
                analytics.studyPlansGenerated
              }
            </p>
          </div>

        </div>

      </div>
    </>
  );
}

export default Analytics;

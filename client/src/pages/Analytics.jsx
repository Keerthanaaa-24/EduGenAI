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

  const [history,
    setHistory] =
    useState([]);

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

        setHistory(
          result.history || []
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
          Loading...
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
                analytics.quizzesCompleted
              }
            </p>
          </div>

          <div className="stat-card">
            <h2>
              🎯
            </h2>
            <h3>
              Average Score
            </h3>
            <p>
              {
                analytics.averageScore
              }
              %
            </p>
          </div>

          <div className="stat-card">
            <h2>
              🏆
            </h2>
            <h3>
              Highest Score
            </h3>
            <p>
              {
                analytics.highestScore
              }
              %
            </p>
          </div>

          <div className="stat-card">
            <h2>
              ⭐
            </h2>
            <h3>
              Rating
            </h3>
            <p>
              {
                analytics.rating
              }
            </p>
          </div>

          <div className="stat-card">
            <h2>
              🔥
            </h2>
            <h3>
              Streak
            </h3>
            <p>
              {
                analytics.streakDays
              }
              {" "}
              Days
            </p>
          </div>

        </div>

        <div
          className="activity-card"
        >

          <h2>
            📝 Quiz History
          </h2>

          <table
            style={{
              width: "100%",
              marginTop:
                "20px",
            }}
          >

            <thead>

              <tr>

                <th>
                  Date
                </th>

                <th>
                  Score
                </th>

                <th>
                  Percentage
                </th>

                <th>
                  Grade
                </th>

              </tr>

            </thead>

            <tbody>

              {history.map(
                (quiz) => (

                  <tr
                    key={
                      quiz._id
                    }
                  >

                    <td>
                      {
                        new Date(
                          quiz.createdAt
                        ).toLocaleDateString()
                      }
                    </td>

                    <td>
                      {
                        quiz.score
                      }
                      /
                      {
                        quiz.totalQuestions
                      }
                    </td>

                    <td>
                      {
                        quiz.percentage
                      }
                      %
                    </td>

                    <td>
                      {
                        quiz.grade
                      }
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
}

export default Analytics;

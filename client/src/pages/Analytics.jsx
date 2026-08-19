import {
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";

import {
  getAnalytics,
} from "../services/analyticsService";

function Analytics() {

  const [
    analytics,
    setAnalytics,
  ] = useState(null);

  const [
    userStats,
    setUserStats,
  ] = useState(null);

  const [
    history,
    setHistory,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  /*
  ==========================================
  LOAD ANALYTICS
  ==========================================
  */

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics =
    async () => {

      try {

        setLoading(true);

        const result =
          await getAnalytics();

        setAnalytics(
          result.analytics || {}
        );

        setUserStats(
          result.user || {}
        );

        setHistory(
          result.history || []
        );

      } catch (error) {

        console.error(
          "Analytics Error:",
          error
        );

      } finally {

        setLoading(false);

      }
    };

  /*
  ==========================================
  FORMAT DATE
  ==========================================
  */

  const formatDate =
    (date) => {

      if (!date) {
        return "";
      }

      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day:
            "2-digit",

          month:
            "short",

          year:
            "numeric",
        }
      );
    };

  /*
  ==========================================
  LOADING
  ==========================================
  */

  if (loading) {

    return (
      <>
        <Navbar />

        <div
          className="dashboard-container"
        >

          <h2>
            Loading Analytics...
          </h2>

        </div>
      </>
    );
  }

  /*
  ==========================================
  ANALYTICS PAGE
  ==========================================
  */

  return (
    <>
      <Navbar />

      <div
        className="dashboard-container"
      >

        {/* ==================================
            HEADER
        ================================== */}

        <h1>
          📊 Learning Analytics
        </h1>

        <p
          style={{
            color:
              "#666",
            marginBottom:
              "25px",
          }}
        >
          View your learning progress,
          performance and quiz history.
        </p>

        {/* ==================================
            USER PROGRESS
        ================================== */}

        <div
          className="stats-grid"
          style={{
            marginBottom:
              "30px",
          }}
        >

          {/* STREAK */}

          <div
            className="stat-card"
          >

            <h2>
              🔥
            </h2>

            <h3>
              Learning Streak
            </h3>

            <p>
              {
                userStats?.streakDays ||
                0
              }{" "}
              days
            </p>

          </div>

          {/* PROGRESS */}

          <div
            className="stat-card"
          >

            <h2>
              📈
            </h2>

            <h3>
              Progress
            </h3>

            <p>
              {
                userStats?.progress ||
                0
              }%
            </p>

          </div>

          {/* LEVEL */}

          <div
            className="stat-card"
          >

            <h2>
              ⭐
            </h2>

            <h3>
              Level
            </h3>

            <p>
              {
                userStats?.level ||
                "Beginner"
              }
            </p>

          </div>

          {/* ACTIVITIES */}

          <div
            className="stat-card"
          >

            <h2>
              ⚡
            </h2>

            <h3>
              Activities
            </h3>

            <p>
              {
                userStats?.totalActivities ||
                0
              }
            </p>

          </div>

        </div>

        {/* ==================================
            ACTIVITY STATISTICS
        ================================== */}

        <div
          className="stats-grid"
        >

          {/* DOCUMENTS */}

          <div
            className="stat-card"
          >

            <h2>
              📄
            </h2>

            <h3>
              Documents
            </h3>

            <p>
              {
                analytics?.documentsUploaded ||
                0
              }
            </p>

          </div>

          {/* QUIZ ATTEMPTS */}

          <div
            className="stat-card"
          >

            <h2>
              📝
            </h2>

            <h3>
              Quiz Attempts
            </h3>

            <p>
              {
                analytics?.quizAttempts ||
                0
              }
            </p>

          </div>

          {/* SUMMARIES */}

          <div
            className="stat-card"
          >

            <h2>
              📚
            </h2>

            <h3>
              Summaries
            </h3>

            <p>
              {
                analytics?.summariesGenerated ||
                0
              }
            </p>

          </div>

          {/* STUDY PLANS */}

          <div
            className="stat-card"
          >

            <h2>
              📅
            </h2>

            <h3>
              Study Plans
            </h3>

            <p>
              {
                analytics?.studyPlansGenerated ||
                0
              }
            </p>

          </div>

        </div>

        {/* ==================================
            QUIZ HISTORY
        ================================== */}

        <div
          className="module-card"
          style={{
            marginTop:
              "30px",
          }}
        >

          <h2>
            📝 Quiz History
          </h2>

          {history.length ===
          0 ? (

            <div
              style={{
                textAlign:
                  "center",
                padding:
                  "30px",
                color:
                  "#777",
              }}
            >

              <div
                style={{
                  fontSize:
                    "40px",
                }}
              >
                📝
              </div>

              <p>
                No quizzes completed
                yet.
              </p>

            </div>

          ) : (

            <div
              style={{
                overflowX:
                  "auto",
              }}
            >

              <table
                style={{
                  width:
                    "100%",
                  borderCollapse:
                    "collapse",
                }}
              >

                <thead>

                  <tr>

                    <th
                      style={{
                        padding:
                          "12px",
                        textAlign:
                          "left",
                        borderBottom:
                          "1px solid #eee",
                      }}
                    >
                      Quiz
                    </th>

                    <th
                      style={{
                        padding:
                          "12px",
                        textAlign:
                          "center",
                        borderBottom:
                          "1px solid #eee",
                      }}
                    >
                      Score
                    </th>

                    <th
                      style={{
                        padding:
                          "12px",
                        textAlign:
                          "center",
                        borderBottom:
                          "1px solid #eee",
                      }}
                    >
                      Percentage
                    </th>

                    <th
                      style={{
                        padding:
                          "12px",
                        textAlign:
                          "center",
                        borderBottom:
                          "1px solid #eee",
                      }}
                    >
                      Grade
                    </th>

                    <th
                      style={{
                        padding:
                          "12px",
                        textAlign:
                          "center",
                        borderBottom:
                          "1px solid #eee",
                      }}
                    >
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {history.map(
                    (
                      attempt,
                      index
                    ) => (

                      <tr
                        key={
                          attempt._id ||
                          index
                        }
                      >

                        {/* QUIZ */}

                        <td
                          style={{
                            padding:
                              "12px",
                            borderBottom:
                              "1px solid #eee",
                          }}
                        >
                          {
                            attempt.document
                              ?.fileName ||
                            "Quiz"
                          }
                        </td>

                        {/* SCORE */}

                        <td
                          style={{
                            padding:
                              "12px",
                            textAlign:
                              "center",
                            borderBottom:
                              "1px solid #eee",
                          }}
                        >
                          {
                            attempt.score
                          }
                          {" / "}
                          {
                            attempt.totalQuestions
                          }
                        </td>

                        {/* PERCENTAGE */}

                        <td
                          style={{
                            padding:
                              "12px",
                            textAlign:
                              "center",
                            borderBottom:
                              "1px solid #eee",
                          }}
                        >
                          {
                            attempt.percentage ??
                            0
                          }%
                        </td>

                        {/* GRADE */}

                        <td
                          style={{
                            padding:
                              "12px",
                            textAlign:
                              "center",
                            fontWeight:
                              "bold",
                            borderBottom:
                              "1px solid #eee",
                          }}
                        >
                          {
                            attempt.grade ||
                            "-"
                          }
                        </td>

                        {/* DATE */}

                        <td
                          style={{
                            padding:
                              "12px",
                            textAlign:
                              "center",
                            borderBottom:
                              "1px solid #eee",
                          }}
                        >
                          {
                            formatDate(
                              attempt.createdAt
                            )
                          }
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>
    </>
  );
}

export default Analytics;
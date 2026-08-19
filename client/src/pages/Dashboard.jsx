import {
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";

import {
  getAnalytics,
  clearActivities,
} from "../services/analyticsService";

function Dashboard() {

  const [
    userStats,
    setUserStats,
  ] = useState(null);

  const [
    analytics,
    setAnalytics,
  ] = useState(null);

  const [
    activities,
    setActivities,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  /*
  ==========================================
  LOAD DASHBOARD
  ==========================================
  */

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard =
    async () => {

      try {

        setLoading(true);

        const result =
          await getAnalytics();

        setUserStats(
          result.user || {}
        );

        setAnalytics(
          result.analytics || {}
        );

        setActivities(
          result.recentActivities ||
          []
        );

      } catch (error) {

        console.error(
          "Dashboard Error:",
          error
        );

      } finally {

        setLoading(false);

      }
    };

  /*
  ==========================================
  CLEAR RECENT ACTIVITY
  ==========================================
  */

  const handleClearActivities =
    async () => {

      if (
        activities.length === 0
      ) {

        alert(
          "There is no activity to clear."
        );

        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to clear your recent activity?"
        );

      if (!confirmed) {
        return;
      }

      try {

        await clearActivities();

        /*
        Clear activity list
        immediately.
        */

        setActivities([]);

        /*
        Reset activity counter.
        */

        setUserStats(
          (previous) => ({
            ...previous,

            totalActivities:
              0,
          })
        );

      } catch (error) {

        console.error(
          "Clear Activity Error:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
          error.message ||
          "Failed to clear recent activity."
        );
      }
    };

  /*
  ==========================================
  ACTIVITY ICON
  ==========================================
  */

  const getActivityIcon =
    (type) => {

      switch (type) {

        case "document_upload":
          return "📄";

        case "document_delete":
          return "🗑️";

        case "quiz_generated":
          return "📝";

        case "quiz_completed":
          return "🎯";

        case "summary_generated":
          return "📚";

        case "study_plan_generated":
          return "📅";

        case "chat":
          return "🤖";

        default:
          return "📌";
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
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    };

  /*
  ==========================================
  PROGRESS MESSAGE
  ==========================================
  */

  const getProgressMessage =
    (progress) => {

      if (progress >= 80) {

        return (
          "Excellent progress! Keep going! 🏆"
        );
      }

      if (progress >= 60) {

        return (
          "You're doing great! 🚀"
        );
      }

      if (progress >= 40) {

        return (
          "Good progress. Keep learning! 📚"
        );
      }

      if (progress >= 20) {

        return (
          "You're getting started! 🌱"
        );
      }

      return (
        "Start learning to build your progress! 💡"
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
            Loading Dashboard...
          </h2>

        </div>
      </>
    );
  }

  const progress =
    userStats?.progress || 0;

  /*
  ==========================================
  DASHBOARD
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
          👋 Welcome back!
        </h1>

        <p
          style={{
            color: "#666",
          }}
        >
          Track your learning journey
          and keep improving every day.
        </p>

        {/* ==================================
            TOP STATS
        ================================== */}

        <div
          className="stats-grid"
        >

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

          <div
            className="stat-card"
          >

            <h2>
              📈
            </h2>

            <h3>
              Learning Progress
            </h3>

            <p>
              {progress}%
            </p>

          </div>

          <div
            className="stat-card"
          >

            <h2>
              ⭐
            </h2>

            <h3>
              Current Level
            </h3>

            <p>
              {
                userStats?.level ||
                "Beginner"
              }
            </p>

          </div>

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

        </div>

        {/* ==================================
            LEARNING PROGRESS
        ================================== */}

        <div
          className="module-card"
          style={{
            marginTop: "30px",
          }}
        >

          <h2>
            📈 Your Learning Progress
          </h2>

          <div
            style={{
              background:
                "#e5e7eb",
              borderRadius:
                "20px",
              height:
                "20px",
              overflow:
                "hidden",
              marginTop:
                "20px",
            }}
          >

            <div
              style={{
                width:
                  `${Math.min(
                    Math.max(
                      progress,
                      0
                    ),
                    100
                  )}%`,
                height:
                  "100%",
                background:
                  "linear-gradient(90deg, #4f46e5, #7c3aed)",
                borderRadius:
                  "20px",
                transition:
                  "width 0.5s ease",
              }}
            />

          </div>

          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              marginTop:
                "10px",
            }}
          >

            <strong>
              {progress}%
            </strong>

            <span>
              {
                userStats?.level ||
                "Beginner"
              }
            </span>

          </div>

          <p
            style={{
              marginTop:
                "15px",
              color:
                "#666",
            }}
          >
            {
              getProgressMessage(
                progress
              )
            }
          </p>

        </div>

        {/* ==================================
            QUICK STATISTICS
        ================================== */}

        <div
          className="stats-grid"
          style={{
            marginTop:
              "30px",
          }}
        >

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
            RECENT ACTIVITY
        ================================== */}

        <div
          className="module-card"
          style={{
            marginTop:
              "30px",
          }}
        >

          {/* ACTIVITY HEADER */}

          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap:
                "15px",
              marginBottom:
                "15px",
            }}
          >

            <h2
              style={{
                margin:
                  0,
              }}
            >
              🕒 Recent Activity
            </h2>

            {activities.length >
              0 && (

              <button
                onClick={
                  handleClearActivities
                }
                style={{
                  width:
                    "auto",
                  padding:
                    "8px 14px",
                  background:
                    "#ef4444",
                  color:
                    "#fff",
                  border:
                    "none",
                  borderRadius:
                    "8px",
                  cursor:
                    "pointer",
                }}
              >
                🗑️ Clear
              </button>

            )}

          </div>

          {/* NO ACTIVITY */}

          {activities.length ===
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
                📚
              </div>

              <p>
                No learning activity
                yet.
              </p>

              <small>
                Upload a document,
                take a quiz, generate
                a summary or use the
                AI tutor to start
                building your
                activity history.
              </small>

            </div>

          ) : (

            <div>

              {activities
                .slice(0, 10)
                .map(
                  (
                    activity,
                    index
                  ) => (

                    <div
                      key={
                        activity._id ||
                        index
                      }
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap:
                          "15px",
                        padding:
                          "15px 5px",
                        borderBottom:
                          "1px solid #eee",
                      }}
                    >

                      {/* ICON */}

                      <div
                        style={{
                          fontSize:
                            "28px",
                        }}
                      >
                        {
                          getActivityIcon(
                            activity.type
                          )
                        }
                      </div>

                      {/* DETAILS */}

                      <div
                        style={{
                          flex:
                            1,
                        }}
                      >

                        <strong>
                          {
                            activity.title
                          }
                        </strong>

                        <p
                          style={{
                            margin:
                              "5px 0",
                            color:
                              "#666",
                          }}
                        >
                          {
                            activity.description
                          }
                        </p>

                        <small
                          style={{
                            color:
                              "#999",
                          }}
                        >
                          {
                            formatDate(
                              activity.createdAt
                            )
                          }
                        </small>

                      </div>

                    </div>

                  )
                )}

            </div>

          )}

        </div>

      </div>
    </>
  );
}

export default Dashboard;
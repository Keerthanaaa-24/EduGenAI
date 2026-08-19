const express = require("express");
const auth = require("../middleware/auth");

const Analytics = require("../models/Analytics");
const QuizAttempt = require("../models/QuizAttempt");
const Activity = require("../models/Activity");
const User = require("../models/User");

const router = express.Router();

/*
==================================================
GET /api/analytics/dashboard
==================================================

Returns:
- user progress
- streak
- level
- analytics statistics
- quiz history
- recent activities

NOTE:
Recent activities are used ONLY for the
Dashboard activity feed.
They are NOT used as the source of
permanent analytics counters.
*/

router.get(
  "/dashboard",
  auth,
  async (req, res) => {
    try {
      const userId = req.user.id;

      /*
      ==========================================
      USER
      ==========================================
      */

      const user =
        await User.findById(userId).select(
          "-password"
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      /*
      ==========================================
      ANALYTICS
      ==========================================
      */

      const analytics =
        await Analytics.findOne({
          user: userId,
        });

      /*
      ==========================================
      QUIZ HISTORY
      ==========================================
      */

      const history =
        await QuizAttempt.find({
          user: userId,
        })
          .sort({
            createdAt: -1,
          })
          .limit(20)
          .populate(
            "document",
            "fileName"
          );

      /*
      ==========================================
      PERMANENT STATISTICS
      ==========================================
      */

      const quizAttempts =
        await QuizAttempt.countDocuments({
          user: userId,
        });

      /*
      These counters come from Analytics,
      not Activity.

      Therefore clearing Recent Activity
      will NOT erase these numbers.
      */

      const documentsUploaded =
        analytics?.documentsUploaded || 0;

      const summariesGenerated =
        analytics?.summariesGenerated || 0;

      const studyPlansGenerated =
        analytics?.studyPlansGenerated || 0;

      /*
      Quiz completed count.

      Prefer Analytics if available.
      Otherwise calculate from QuizAttempt.
      */

      const quizzesCompleted =
        analytics?.quizzesCompleted ??
        quizAttempts;

      /*
      ==========================================
      RECENT ACTIVITIES
      ==========================================
      */

      const recentActivities =
        await Activity.find({
          user: userId,
        })
          .sort({
            createdAt: -1,
          })
          .limit(10);

      /*
      ==========================================
      RESPONSE
      ==========================================
      */

      res.json({
        success: true,

        analytics: {
          ...(analytics
            ? analytics.toObject()
            : {}),

          documentsUploaded,

          quizAttempts,

          quizzesCompleted,

          summariesGenerated,

          studyPlansGenerated,
        },

        user: {
          id: user._id,

          name:
            user.name,

          email:
            user.email,

          streakDays:
            user.streakDays || 0,

          progress:
            user.progress || 0,

          level:
            user.level ||
            "Beginner",

          totalActivities:
            user.totalActivities || 0,
        },

        history,

        recentActivities,
      });

    } catch (error) {

      console.error(
        "Analytics Dashboard Error:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          error.message ||
          "Failed to load analytics",
      });
    }
  }
);

/*
==================================================
DELETE /api/analytics/activity
==================================================

Clear only the logged-in user's
Recent Activity feed.

IMPORTANT:
This does NOT delete:
- Documents
- Quiz attempts
- Analytics
- Study plans
- User account

It only deletes Activity records.
*/

router.delete(
  "/activity",
  auth,
  async (req, res) => {
    try {

      const userId =
        req.user.id;

      /*
      Delete only this user's activities.
      */

      const result =
        await Activity.deleteMany({
          user: userId,
        });

      /*
      Reset the activity counter
      because the activity history
      has been cleared.
      */

      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            totalActivities: 0,
          },
        }
      );

      res.status(200).json({
        success: true,

        message:
          "Recent activity cleared successfully.",

        deletedCount:
          result.deletedCount,
      });

    } catch (error) {

      console.error(
        "Clear Activity Error:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          error.message ||
          "Failed to clear activity.",
      });
    }
  }
);

module.exports = router;
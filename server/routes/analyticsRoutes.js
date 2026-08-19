import express from "express";

import auth from "../middleware/auth.js";

import Analytics from "../models/Analytics.js";
import QuizAttempt from "../models/QuizAttempt.js";

const router = express.Router();

/*
 * GET /api/analytics/dashboard
 *
 * Returns the current user's analytics
 * and recent quiz history.
 */
router.get(
  "/dashboard",
  auth,
  async (req, res) => {
    try {
      const userId = req.user._id;

      const analytics =
        await Analytics.findOne({
          user: userId,
        });

      const history =
        await QuizAttempt.find({
          user: userId,
        })
          .sort({
            createdAt: -1,
          })
          .limit(10);

      return res.status(200).json({
        success: true,
        analytics,
        history,
      });
    } catch (error) {
      console.error(
        "Analytics Dashboard Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load analytics.",
      });
    }
  }
);

export default router;
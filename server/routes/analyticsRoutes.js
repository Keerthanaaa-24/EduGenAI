
const express = require("express");
const express =
  require("express");

const auth =
  require("../middleware/auth");

const Analytics =
  require("../models/Analytics");

const QuizAttempt =
  require("../models/QuizAttempt");

const router =
  express.Router();

router.get(
  "/dashboard",
  auth,
  async (req, res) => {

    const analytics =
      await Analytics.findOne({
        user:
          req.user.id,
      });

    const history =
      await QuizAttempt.find({
        user:
          req.user.id,
      })
        .sort({
          createdAt: -1,
        })
        .limit(10);

    res.json({
      success: true,
      analytics,
      history,
    });

  }
);

<<<<<<< HEAD
module.exports = router;
=======
module.exports =
  router;
>>>>>>> d2968d4 (Add language selector and update planner, quiz, analytics features)

const express = require("express");
const auth = require("../middleware/auth");

const QuizAttempt =
  require("../models/QuizAttempt");

const Document =
  require("../models/Document");

const Analytics =
  require("../models/Analytics");

const Activity =
  require("../models/Activity");

const User =
  require("../models/User");

const router =
  express.Router();

/*
Calculate grade
*/

const getGrade = (
  percentage
) => {

  if (percentage >= 90)
    return "O";

  if (percentage >= 80)
    return "A+";

  if (percentage >= 70)
    return "A";

  if (percentage >= 60)
    return "B+";

  if (percentage >= 50)
    return "B";

  if (percentage >= 40)
    return "C";

  return "F";
};

/*
Calculate learning level
*/

const getLevel = (
  progress
) => {

  if (progress <= 20)
    return "Beginner";

  if (progress <= 40)
    return "Learner";

  if (progress <= 60)
    return "Intermediate";

  if (progress <= 80)
    return "Advanced";

  return "Expert";
};

/*
Calculate daily streak
*/

const calculateStreak = (
  currentStreak,
  lastActivityDate
) => {

  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  /*
  No previous activity
  */

  if (!lastActivityDate) {
    return 1;
  }

  const lastDate =
    new Date(
      lastActivityDate
    );

  lastDate.setHours(
    0,
    0,
    0,
    0
  );

  const difference =
    today.getTime() -
    lastDate.getTime();

  const oneDay =
    24 *
    60 *
    60 *
    1000;

  /*
  Already active today
  */

  if (
    difference === 0
  ) {
    return currentStreak || 1;
  }

  /*
  Active yesterday
  */

  if (
    difference === oneDay
  ) {
    return (
      (currentStreak || 0) +
      1
    );
  }

  /*
  Missed one or more days
  */

  return 1;
};

/*
Calculate progress
*/

const calculateProgress = (
  quizAverage,
  quizCount,
  activityCount
) => {

  /*
  Quiz performance contributes
  60% of progress.
  */

  const quizScore =
    quizAverage * 0.6;

  /*
  Quiz activity contributes
  up to 20%.
  */

  const quizActivity =
    Math.min(
      quizCount * 2,
      20
    );

  /*
  General learning activity
  contributes up to 20%.
  */

  const activityScore =
    Math.min(
      activityCount,
      20
    );

  const progress =
    quizScore +
    quizActivity +
    activityScore;

  return Math.min(
    Math.round(progress),
    100
  );
};

/*
POST /api/quiz-results/submit
*/

router.post(
  "/submit",
  auth,
  async (req, res) => {

    try {

      const {
        documentId,
        score,
        totalQuestions,
      } = req.body;

      if (
        !documentId ||
        score === undefined ||
        !totalQuestions
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Document ID, score and total questions are required.",
        });
      }

      const numericScore =
        Number(score);

      const numericTotal =
        Number(totalQuestions);

      if (
        numericTotal <= 0 ||
        numericScore < 0 ||
        numericScore >
          numericTotal
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Invalid quiz result.",
        });
      }

      /*
      Find document
      */

      const document =
        await Document.findById(
          documentId
        );

      if (!document) {

        return res.status(404).json({
          success: false,
          message:
            "Document not found.",
        });
      }

      /*
      Calculate percentage
      */

      const percentage =
        Number(
          (
            (numericScore /
              numericTotal) *
            100
          ).toFixed(2)
        );

      const grade =
        getGrade(
          percentage
        );

      /*
      Save quiz attempt
      */

      const quizAttempt =
        await QuizAttempt.create({
          user:
            req.user.id,

          document:
            documentId,

          score:
            numericScore,

          totalQuestions:
            numericTotal,

          percentage,

          grade,
        });

      /*
      Update analytics
      */

      await Analytics.findOneAndUpdate(
        {
          user:
            req.user.id,
        },
        {
          $inc: {
            quizAttempts: 1,
          },
        },
        {
          upsert: true,
          new: true,
        }
      );

      /*
      Count all completed quizzes
      */

      const completedQuizzes =
        await QuizAttempt.find({
          user:
            req.user.id,
        });

      /*
      Calculate average quiz score
      */

      let quizAverage = 0;

      if (
        completedQuizzes.length > 0
      ) {

        const totalPercentage =
          completedQuizzes.reduce(
            (
              total,
              attempt
            ) =>
              total +
              Number(
                attempt.percentage ||
                  0
              ),
            0
          );

        quizAverage =
          totalPercentage /
          completedQuizzes.length;
      }

      /*
      Count activities
      */

      const activityCount =
        await Activity.countDocuments({
          user:
            req.user.id,
        });

      /*
      Calculate progress
      */

      const progress =
        calculateProgress(
          quizAverage,
          completedQuizzes.length,
          activityCount
        );

      /*
      Get current user
      */

      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {

        return res.status(404).json({
          success: false,
          message:
            "User not found.",
        });
      }

      /*
      Calculate streak
      */

      const streakDays =
        calculateStreak(
          user.streakDays || 0,
          user.lastActivityDate
        );

      /*
      Calculate level
      */

      const level =
        getLevel(
          progress
        );

      /*
      Update user
      */

      await User.findByIdAndUpdate(
        req.user.id,
        {
          streakDays,

          lastActivityDate:
            new Date(),

          progress,

          level,
        }
      );

      /*
      Save real quiz activity
      */

      await Activity.create({
        user:
          req.user.id,

        type:
          "quiz_completed",

        title:
          "Completed a quiz",

        description:
          `Scored ${numericScore}/${numericTotal} in ${document.fileName}`,

        metadata: {
          documentId:
            document._id,

          documentName:
            document.fileName,

          score:
            numericScore,

          totalQuestions:
            numericTotal,

          percentage,

          grade,
        },
      });

      /*
      Update total activities
      */

      await User.findByIdAndUpdate(
        req.user.id,
        {
          $inc: {
            totalActivities: 1,
          },
        }
      );

      /*
      Final response
      */

      res.status(201).json({
        success: true,

        message:
          "Quiz result saved successfully.",

        quizAttempt,

        performance: {
          score:
            numericScore,

          totalQuestions:
            numericTotal,

          percentage,

          grade,

          progress,

          level,

          streakDays,
        },
      });

    } catch (error) {

      console.error(
        "Quiz Result Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to save quiz result.",
      });
    }
  }
);

/*
GET /api/quiz-results/history
*/

router.get(
  "/history",
  auth,
  async (req, res) => {

    try {

      const history =
        await QuizAttempt.find({
          user:
            req.user.id,
        })
          .sort({
            createdAt: -1,
          })
          .limit(50)
          .populate(
            "document",
            "fileName"
          );

      res.status(200).json({
        success: true,
        history,
      });

    } catch (error) {

      console.error(
        "Quiz History Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to load quiz history.",
      });
    }
  }
);

module.exports = router;
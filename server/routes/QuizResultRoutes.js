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

      const percentage =
        (
          (score /
            totalQuestions) *
          100
        ).toFixed(2);

      let grade = "F";

      if (percentage >= 90)
        grade = "O";
      else if (
        percentage >= 80
      )
        grade = "A+";
      else if (
        percentage >= 70
      )
        grade = "A";
      else if (
        percentage >= 60
      )
        grade = "B";
      else if (
        percentage >= 50
      )
        grade = "C";

      await QuizAttempt.create({
        user:
          req.user.id,

        document:
          documentId,

        score,

        totalQuestions,

        percentage,

        grade,
      });

      const attempts =
        await QuizAttempt.find({
          user:
            req.user.id,
        });

      const totalScore =
        attempts.reduce(
          (
            sum,
            attempt
          ) =>
            sum +
            attempt.percentage,
          0
        );

      const averageScore =
        (
          totalScore /
          attempts.length
        ).toFixed(2);

      const highestScore =
        Math.max(
          ...attempts.map(
            (a) =>
              a.percentage
          )
        );

      let rating =
        "Beginner";

      if (
        averageScore >= 90
      )
        rating = "Expert";
      else if (
        averageScore >= 75
      )
        rating =
          "Advanced";
      else if (
        averageScore >= 60
      )
        rating =
          "Intermediate";
      else if (
        averageScore >= 40
      )
        rating =
          "Learner";

      await Analytics.findOneAndUpdate(
        {
          user:
            req.user.id,
        },
        {
          quizzesCompleted:
            attempts.length,

          highestScore,

          averageScore,

          rating,
        },
        {
          upsert: true,
        }
      );

      res.json({
        success: true,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  }
);

module.exports =
  router;

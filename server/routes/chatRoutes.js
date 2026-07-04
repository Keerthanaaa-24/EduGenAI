const express = require("express");
const auth =
  require("../middleware/auth");

const Analytics =
  require("../models/Analytics");

const {
  askQuestion,
} = require("../services/ragService");

const router =
  express.Router();

router.post(
  "/ask",
  auth,
  async (req, res) => {
    try {
      const {
        documentId,
        question,
      } = req.body;

      const answer =
        await askQuestion(
          documentId,
          question
        );

      await Analytics.findOneAndUpdate(
        {
          user:
            req.user.id,
        },
        {
          $inc: {
            aiQuestionsAsked:
              1,
          },
        },
        {
          upsert: true,
        }
      );

      res.json({
        success: true,
        answer,
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

module.exports = router;

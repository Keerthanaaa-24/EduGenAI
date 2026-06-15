const express = require("express");

const auth =
  require("../middleware/auth");

const Document =
  require("../models/Document");

const Analytics =
  require("../models/Analytics");

const {
  generateQuiz,
} = require("../services/quizService");

const router =
  express.Router();

router.post(
  "/generate",
  auth,
  async (req, res) => {
    try {
      const {
        documentId,
      } = req.body;

      const document =
        await Document.findById(
          documentId
        );

      if (!document) {
        return res.status(404).json({
          success: false,
          message:
            "Document not found",
        });
      }

      const quiz =
        await generateQuiz(
          document.extractedText
        );

      await Analytics.findOneAndUpdate(
        {
          user:
            req.user.id,
        },
        {
          $inc: {
            quizAttempts:
              1,
          },
        },
        {
          upsert: true,
        }
      );

      res.json({
        success: true,
        quiz,
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
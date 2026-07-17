const express = require("express");
const auth =
  require("../middleware/auth");

const Document =
  require("../models/Document");

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
        language,
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
          document.extractedText,
          language || "English"
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

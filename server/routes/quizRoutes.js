const express = require("express");
const auth = require("../middleware/auth");

const Document = require("../models/Document");

const {
  generateQuiz,
} = require("../services/quizService");

const router = express.Router();

router.post(
  "/generate",
  auth,
  async (req, res) => {
    try {

      const {
        documentId,
        language,
      } = req.body;

      console.log("========== QUIZ REQUEST ==========");
      console.log("Document ID:", documentId);
      console.log("Language:", language);

      const document =
        await Document.findById(documentId);

      if (!document) {
        return res.status(404).json({
          success: false,
          message: "Document not found",
        });
      }

      console.log(
        "Document:",
        document.fileName
      );

      console.log(
        "Extracted Text Length:",
        document.extractedText
          ? document.extractedText.length
          : 0
      );

      if (
        !document.extractedText ||
        document.extractedText.trim().length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Document contains no extracted text.",
        });
      }

      let quiz =
        await generateQuiz(
          document.extractedText,
          language || "English"
        );

      // If service returns string, parse it
      if (typeof quiz === "string") {

        quiz = quiz
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();

        const start = quiz.indexOf("[");
        const end = quiz.lastIndexOf("]");

        if (start !== -1 && end !== -1) {
          quiz = quiz.substring(
            start,
            end + 1
          );
        }

        quiz = JSON.parse(quiz);
      }

      console.log("========== FINAL QUIZ ==========");
      console.log(
        JSON.stringify(
          quiz,
          null,
          2
        )
      );

      res.status(200).json({
        success: true,
        quiz,
      });

    } catch (error) {

      console.error(
        "========== QUIZ ERROR =========="
      );

      console.error(error);

      if (error.response) {
        console.error(
          error.response.data
        );
      }

      res.status(500).json({
        success: false,
        message:
          error.message ||
          "Quiz generation failed.",
      });

    }
  }
);

module.exports = router;
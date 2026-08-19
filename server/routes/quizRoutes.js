const express = require("express");
const auth = require("../middleware/auth");

const Document = require("../models/Document");
const Activity = require("../models/Activity");
const User = require("../models/User");

const {
  generateQuiz,
} = require("../services/quizService");

const router = express.Router();

/*
POST /api/quiz/generate
*/

router.post(
  "/generate",
  auth,
  async (req, res) => {
    try {
      const {
        documentId,
        language,
        numberOfQuestions,
      } = req.body;

      console.log(
        "========== QUIZ REQUEST =========="
      );

      console.log(
        "Document ID:",
        documentId
      );

      console.log(
        "Language:",
        language
      );

      console.log(
        "Number of Questions:",
        numberOfQuestions
      );

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
        document.extractedText
          .trim()
          .length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Document contains no extracted text.",
        });
      }

      /*
      Validate question count
      */

      let questionCount =
        Number(numberOfQuestions);

      if (
        !questionCount ||
        questionCount < 5
      ) {
        questionCount = 15;
      }

      if (questionCount > 30) {
        questionCount = 30;
      }

      /*
      Generate quiz
      */

      let quiz =
        await generateQuiz(
          document.extractedText,
          language || "English",
          questionCount
        );

      /*
      Clean AI response
      */

      if (
        typeof quiz === "string"
      ) {
        quiz = quiz
          .replace(
            /```json/gi,
            ""
          )
          .replace(
            /```/g,
            ""
          )
          .trim();

        const start =
          quiz.indexOf("[");

        const end =
          quiz.lastIndexOf("]");

        if (
          start !== -1 &&
          end !== -1
        ) {
          quiz =
            quiz.substring(
              start,
              end + 1
            );
        }

        quiz = JSON.parse(quiz);
      }

      if (
        !Array.isArray(quiz)
      ) {
        throw new Error(
          "AI returned an invalid quiz format."
        );
      }

      /*
      Save activity
      */

      await Activity.create({
        user: req.user.id,

        type:
          "quiz_generated",

        title:
          "Generated a new quiz",

        description:
          `${questionCount} questions generated from ${document.fileName}`,

        metadata: {
          documentId:
            document._id,

          documentName:
            document.fileName,

          questionCount,

          language:
            language || "English",
        },
      });

      /*
      Update user's activity count
      */

      await User.findByIdAndUpdate(
        req.user.id,
        {
          $inc: {
            totalActivities: 1,
          },
        }
      );

      console.log(
        "Quiz generated successfully."
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

      if (error.status) {
        console.error(
          "Status:",
          error.status
        );
      }

      if (error.response) {
        console.error(
          "Response:",
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
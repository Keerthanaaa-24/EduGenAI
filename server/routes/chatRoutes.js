const express = require("express");
const auth = require("../middleware/auth");

const Document = require("../models/Document");
const Activity = require("../models/Activity");
const User = require("../models/User");

const {
  askQuestion,
} = require("../services/ragService");

const router = express.Router();

/*
==================================================
POST /api/chat
AI Tutor Chat using RAG
==================================================
*/

router.post(
  "/",
  auth,
  async (req, res) => {
    try {
      const {
        question,
        documentId,
      } = req.body;

      console.log(
        "========== CHAT REQUEST =========="
      );

      console.log(
        "Question:",
        question
      );

      console.log(
        "Document ID:",
        documentId
      );

      /*
      Validate question
      */

      if (
        !question ||
        !question.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Question is required.",
        });
      }

      /*
      Validate document
      */

      if (!documentId) {
        return res.status(400).json({
          success: false,
          message:
            "Please select a document.",
        });
      }

      /*
      Check that document exists
      and belongs to logged-in user
      */

      const document =
        await Document.findOne({
          _id: documentId,
          user: req.user.id,
        });

      if (!document) {
        return res.status(404).json({
          success: false,
          message:
            "Document not found.",
        });
      }

      /*
      Check extracted text
      */

      if (
        !document.extractedText ||
        !document.extractedText.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "This document does not contain extracted text.",
        });
      }

      /*
      ==============================================
      IMPORTANT FIX
      ==============================================

      ragService.js expects:

      askQuestion(documentId, question)

      */

      const answer =
        await askQuestion(
          documentId,
          question.trim()
        );

      /*
      ==============================================
      SAVE ACTIVITY
      ==============================================
      */

      try {
        await Activity.create({
          user:
            req.user.id,

          type:
            "chat",

          title:
            "Asked the AI Tutor",

          description:
            `Asked a question about ${document.fileName}`,

          metadata: {
            documentId:
              document._id,

            documentName:
              document.fileName,

            question:
              question.trim(),
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

      } catch (activityError) {

        /*
        Activity failure should NOT
        make the successful AI answer fail.
        */

        console.error(
          "Activity Save Error:",
          activityError
        );
      }

      /*
      ==============================================
      SEND ANSWER
      ==============================================
      */

      console.log(
        "Chat response generated successfully."
      );

      return res.status(200).json({
        success: true,
        answer,
      });

    } catch (error) {

      console.error(
        "========== CHAT ERROR =========="
      );

      console.error(
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to get AI response.",
      });
    }
  }
);

module.exports = router;
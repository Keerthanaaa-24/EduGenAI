const express = require("express");
const auth =
  require("../middleware/auth");

const StudyPlan =
  require("../models/StudyPlan");

const Document =
  require("../models/Document");

const Analytics =
  require("../models/Analytics");

const {
  generateStudyPlan,
} = require("../services/plannerService");

const router =
  express.Router();

router.post(
  "/generate",
  auth,
  async (req, res) => {
    try {

      const {
        subject,
        examDate,
        hoursPerDay,
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

      const plan =
        await generateStudyPlan(
          document.extractedText,
          subject,
          examDate,
          hoursPerDay,
          language || "English"
        );

      const studyPlan =
        await StudyPlan.create({
          user:
            req.user.id,

          subject,

          examDate,

          hoursPerDay,

          plan,
        });

      await Analytics.findOneAndUpdate(
        {
          user:
            req.user.id,
        },
        {
          $inc: {
            studyPlansGenerated:
              1,
          },
        },
        {
          upsert: true,
        }
      );

      res.json({
        success: true,
        studyPlan,
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

router.get(
  "/my-plans",
  auth,
  async (req, res) => {

    try {

      const plans =
        await StudyPlan.find({
          user:
            req.user.id,
        });

      res.json({
        success: true,
        plans,
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

<<<<<<< HEAD
module.exports = router;
=======
module.exports =
  router;
>>>>>>> d2968d4 (Add language selector and update planner, quiz, analytics features)

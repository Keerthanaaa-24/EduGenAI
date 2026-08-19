const express = require("express");
const auth = require("../middleware/auth");

const StudyPlan = require("../models/StudyPlan");
const Document = require("../models/Document");
const Analytics = require("../models/Analytics");

const {
  generateStudyPlan,
} = require("../services/plannerService");

const router = express.Router();

/*
==========================================
Generate Study Plan
==========================================
*/

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
        await Document.findById(documentId);

      if (!document) {
        return res.status(404).json({
          success: false,
          message: "Document not found",
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
          user: req.user.id,
          subject,
          examDate,
          hoursPerDay,
          plan,
        });

      await Analytics.findOneAndUpdate(
        { user: req.user.id },
        {
          $inc: {
            studyPlansGenerated: 1,
          },
        },
        {
          upsert: true,
          new: true,
        }
      );

      res.json({
        success: true,
        studyPlan,
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/*
==========================================
Get My Study Plans
==========================================
*/

router.get(
  "/my-plans",
  auth,
  async (req, res) => {
    try {
      const plans =
        await StudyPlan.find({
          user: req.user.id,
        }).sort({
          createdAt: -1,
        });

      res.json({
        success: true,
        plans,
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;
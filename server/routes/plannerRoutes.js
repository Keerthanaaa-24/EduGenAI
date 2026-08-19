const express =
  require("express");

const auth =
  require("../middleware/auth");

const StudyPlan =
  require("../models/StudyPlan");

const Document =
  require("../models/Document");

const Analytics =
  require("../models/Analytics");

const Activity =
  require("../models/Activity");

const User =
  require("../models/User");

const {
  generateStudyPlan,
} = require("../services/plannerService");

const router =
  express.Router();

/*
==================================================
POST /api/planner/generate
==================================================
*/

router.post(
  "/generate",
  auth,
  async (req, res) => {

    try {

      const {
        subject,
        days,
        hoursPerDay,
        startTime,
        documentId,
        language,
      } = req.body;

      /*
      ==========================================
      VALIDATION
      ==========================================
      */

      if (
        !subject ||
        !days ||
        !hoursPerDay ||
        !startTime ||
        !documentId
      ) {

        return res.status(400).json({
          success: false,

          message:
            "Subject, number of days, hours per day, start time and document are required.",
        });
      }

      /*
      ==========================================
      LIMIT DAYS
      ==========================================
      */

      const totalDays =
        Math.min(
          Math.max(
            Number(days) || 7,
            1
          ),
          7
        );

      /*
      ==========================================
      VALIDATE HOURS
      ==========================================
      */

      const dailyHours =
        Number(hoursPerDay);

      if (
        isNaN(dailyHours) ||
        dailyHours <= 0
      ) {

        return res.status(400).json({
          success: false,

          message:
            "Hours per day must be greater than 0.",
        });
      }

      /*
      ==========================================
      FIND DOCUMENT
      ==========================================
      */

      const document =
        await Document.findOne({
          _id:
            documentId,

          user:
            req.user.id,
        });

      if (!document) {

        return res.status(404).json({
          success: false,

          message:
            "Document not found.",
        });
      }

      /*
      ==========================================
      CHECK EXTRACTED TEXT
      ==========================================
      */

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
      ==========================================
      GENERATE PLAN
      ==========================================
      */

      const plan =
        await generateStudyPlan(
          document.extractedText,

          subject,

          totalDays,

          dailyHours,

          startTime,

          language ||
            "English"
        );

      /*
      ==========================================
      SAVE STUDY PLAN
      ==========================================
      */

      const studyPlan =
        await StudyPlan.create({

          user:
            req.user.id,

          subject,

          /*
          Store the number of days
          instead of the old exam date.
          */

          days:
            totalDays,

          hoursPerDay:
            dailyHours,

          startTime,

          document:
            document._id,

          language:
            language ||
            "English",

          plan,
        });

      /*
      ==========================================
      UPDATE ANALYTICS
      ==========================================
      */

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
          upsert:
            true,

          new:
            true,
        }
      );

      /*
      ==========================================
      SAVE REAL ACTIVITY
      ==========================================
      */

      await Activity.create({

        user:
          req.user.id,

        type:
          "study_plan_generated",

        title:
          "Generated a mini study plan",

        description:
          `Created a ${totalDays}-day study plan for ${subject}`,

        metadata: {

          documentId:
            document._id,

          documentName:
            document.fileName,

          subject,

          days:
            totalDays,

          hoursPerDay:
            dailyHours,

          startTime,

          language:
            language ||
            "English",
        },
      });

      /*
      ==========================================
      UPDATE USER ACTIVITY COUNT
      ==========================================
      */

      await User.findByIdAndUpdate(
        req.user.id,

        {
          $inc: {
            totalActivities:
              1,
          },
        }
      );

      /*
      ==========================================
      RESPONSE
      ==========================================
      */

      res.status(200).json({

        success:
          true,

        studyPlan,
      });

    } catch (error) {

      console.error(
        "Planner Generation Error:",
        error
      );

      res.status(500).json({

        success:
          false,

        message:
          error.message ||
          "Planner generation failed.",
      });
    }
  }
);

/*
==================================================
GET /api/planner/my-plans
==================================================
*/

router.get(
  "/my-plans",
  auth,
  async (req, res) => {

    try {

      const plans =
        await StudyPlan.find({
          user:
            req.user.id,
        })
        .sort({
          createdAt:
            -1,
        });

      res.status(200).json({

        success:
          true,

        plans,
      });

    } catch (error) {

      console.error(
        "Get Study Plans Error:",
        error
      );

      res.status(500).json({

        success:
          false,

        message:
          error.message ||
          "Failed to fetch study plans.",
      });
    }
  }
);

module.exports =
  router;
const express = require("express");
const auth = require("../middleware/auth");

const Document = require("../models/Document");
const Analytics = require("../models/Analytics");
const Activity = require("../models/Activity");
const User = require("../models/User");

const {
  generateSummary,
} = require("../services/summaryService");

const router = express.Router();

/*
==================================================
POST /api/summary/generate
==================================================
*/

router.post(
  "/generate",
  auth,
  async (req, res) => {
    try {
      const {
        documentId,
        language,
      } = req.body;

      console.log(
        "========== SUMMARY REQUEST =========="
      );

      console.log(
        "Document ID:",
        documentId
      );

      console.log(
        "Language:",
        language
      );

      /*
      Validate document ID
      */

      if (!documentId) {
        return res.status(400).json({
          success: false,
          message:
            "Please select a document.",
        });
      }

      /*
      Find ONLY the logged-in
      user's document
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

      console.log(
        "Document:",
        document.fileName
      );

      /*
      Validate extracted text
      */

      if (
        !document.extractedText ||
        !document.extractedText.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Document contains no extracted text.",
        });
      }

      /*
      Generate summary
      */

      const selectedLanguage =
        language || "English";

      const summary =
        await generateSummary(
          document.extractedText,
          selectedLanguage
        );

      if (
        !summary ||
        !summary.trim()
      ) {
        throw new Error(
          "AI returned an empty summary."
        );
      }

      /*
      ==============================================
      UPDATE ANALYTICS
      ==============================================
      */

      await Analytics.findOneAndUpdate(
        {
          user: req.user.id,
        },
        {
          $inc: {
            summariesGenerated: 1,
          },
        },
        {
          upsert: true,
          new: true,
        }
      );

      /*
      ==============================================
      SAVE ACTIVITY
      ==============================================
      */

      try {
        await Activity.create({
          user: req.user.id,

          type:
            "summary_generated",

          title:
            "Generated a document summary",

          description:
            `Generated a summary for ${document.fileName}`,

          metadata: {
            documentId:
              document._id,

            documentName:
              document.fileName,

            language:
              selectedLanguage,
          },
        });

        /*
        Update activity count
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
        Activity failure should not
        destroy a successful summary.
        */

        console.error(
          "Summary Activity Error:",
          activityError
        );
      }

      /*
      ==============================================
      SUCCESS
      ==============================================
      */

      console.log(
        "Summary generated successfully."
      );

      return res.status(200).json({
        success: true,
        summary,
      });

    } catch (error) {

      console.error(
        "========== SUMMARY ERROR =========="
      );

      console.error(
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Summary generation failed.",
      });
    }
  }
);

module.exports = router;
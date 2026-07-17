const express = require("express");
const auth =
  require("../middleware/auth");

const Document =
  require("../models/Document");

const {
  generateSummary,
} = require("../services/summaryService");

const Analytics =
  require("../models/Analytics");

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

      const summary =
        await generateSummary(
          document.extractedText,
          language || "English"
        );

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

      res.json({
        success: true,
        summary,
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

const express = require("express");
const auth =
  require("../middleware/auth");

const Document =
  require("../models/Document");

const Summary =
  require("../models/Summary");

const Analytics =
  require("../models/Analytics");

const {
  generateSummary,
} = require("../services/summaryService");

const router =
  express.Router();

router.post(
  "/generate",
  auth,
  async (req, res) => {
    try {
      const { documentId } =
        req.body;

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
          document.extractedText
        );

      await Summary.create({
        user: req.user.id,
        document:
          document._id,
        title:
          document.fileName,
        summary,
      });

      await Analytics.findOneAndUpdate(
        {
          user:
            req.user.id,
        },
        {
          $inc: {
            summariesGenerated: 1,
          },
        },
        {
          upsert: true,
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

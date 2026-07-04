const express = require("express");
const auth =
  require("../middleware/auth");

const upload =
  require("../middleware/upload");

const Document =
  require("../models/Document");

const Analytics =
  require("../models/Analytics");

const {
  extractPDFText,
} = require("../services/pdfService");

const {
  extractImageText,
} = require("../services/ocrService");

const router =
  express.Router();

/*
==================================
UPLOAD DOCUMENT
==================================
*/

router.post(
  "/upload",
  auth,
  upload.single("file"),
  async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "No file uploaded",
        });
      }

      let extractedText = "";

      if (
        req.file.mimetype ===
        "application/pdf"
      ) {

        extractedText =
          await extractPDFText(
            req.file.path
          );

      } else {

        extractedText =
          await extractImageText(
            req.file.path
          );

      }

      const document =
        await Document.create({
          user:
            req.user.id,

          fileName:
            req.file.originalname,

          filePath:
            req.file.path,

          extractedText,

          fileType:
            req.file.mimetype,
        });

      await Analytics.findOneAndUpdate(
        {
          user:
            req.user.id,
        },
        {
          $inc: {
            documentsUploaded:
              1,
          },
        },
        {
          upsert: true,
          new: true,
        }
      );

      res.status(201).json({
        success: true,
        document,
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

/*
==================================
GET USER DOCUMENTS
==================================
*/

router.get(
  "/my-documents",
  auth,
  async (req, res) => {
    try {

      const docs =
        await Document.find({
          user:
            req.user.id,
        }).sort({
          createdAt: -1,
        });

      res.json({
        success: true,
        documents: docs,
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

const express = require("express");
const auth = require("../middleware/auth");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const pdfParse = require("pdf-parse");

const Document = require("../models/Document");
const Analytics = require("../models/Analytics");
const Activity = require("../models/Activity");
const User = require("../models/User");

const router = express.Router();

/*
==================================================
UPLOAD DIRECTORY
==================================================
*/

const uploadDir = path.join(
  __dirname,
  "../uploads"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

/*
==================================================
MULTER CONFIGURATION
==================================================
*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const originalName = path.basename(
      file.originalname,
      extension
    );

    const safeName =
      originalName.replace(
        /[^a-zA-Z0-9-_]/g,
        "_"
      );

    const uniqueName =
      `${Date.now()}-${safeName}${extension}`;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize:
      20 * 1024 * 1024,
  },

  fileFilter: (
    req,
    file,
    cb
  ) => {
    const extension =
      path.extname(
        file.originalname
      ).toLowerCase();

    if (extension === ".pdf") {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF files are allowed."
        )
      );
    }
  },
});

/*
==================================================
UPLOAD DOCUMENT
POST /api/documents/upload
==================================================
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
            "Please upload a PDF file.",
        });
      }

      const filePath =
        req.file.path;

      /*
      Read uploaded PDF
      */

      const fileBuffer =
        fs.readFileSync(
          filePath
        );

      /*
      Extract PDF text
      */

      const pdfData =
        await pdfParse(
          fileBuffer
        );

      const extractedText =
        pdfData.text || "";

      /*
      Make sure PDF contains text
      */

      if (
        extractedText
          .trim()
          .length === 0
      ) {
        if (
          fs.existsSync(
            filePath
          )
        ) {
          fs.unlinkSync(
            filePath
          );
        }

        return res.status(400).json({
          success: false,
          message:
            "Could not extract text from the PDF.",
        });
      }

      /*
      Save document permanently
      in MongoDB
      */

      const document =
        await Document.create({
          user:
            req.user.id,

          fileName:
            req.file.originalname,

          filePath,

          extractedText,

          fileType:
            "pdf",

          uploadDate:
            new Date(),
        });

      /*
      Update analytics
      */

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

      /*
      Save activity
      */

      await Activity.create({
        user:
          req.user.id,

        type:
          "document_upload",

        title:
          "Uploaded a document",

        description:
          `Uploaded ${req.file.originalname}`,

        metadata: {
          documentId:
            document._id,

          fileName:
            req.file.originalname,

          fileSize:
            req.file.size,
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

      /*
      Send response
      */

      return res.status(201).json({
        success: true,

        message:
          "Document uploaded successfully.",

        document,
      });

    } catch (error) {
      console.error(
        "Document Upload Error:",
        error
      );

      /*
      Delete uploaded file
      if something failed
      */

      if (
        req.file &&
        req.file.path &&
        fs.existsSync(
          req.file.path
        )
      ) {
        try {
          fs.unlinkSync(
            req.file.path
          );
        } catch (deleteError) {
          console.error(
            "File cleanup error:",
            deleteError
          );
        }
      }

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Document upload failed.",
      });
    }
  }
);

/*
==================================================
GET USER DOCUMENTS
GET /api/documents
==================================================
*/

router.get(
  "/",
  auth,
  async (req, res) => {
    try {
      const documents =
        await Document.find({
          user:
            req.user.id,
        })
          .sort({
            createdAt: -1,
          })
          .select(
            "_id fileName filePath fileType uploadDate createdAt"
          );

      return res.status(200).json({
        success: true,
        documents,
      });

    } catch (error) {
      console.error(
        "Get Documents Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch documents.",
      });
    }
  }
);

/*
==================================================
DELETE DOCUMENT
DELETE /api/documents/:id
==================================================
*/

router.delete(
  "/:id",
  auth,
  async (req, res) => {
    try {
      const document =
        await Document.findOne({
          _id:
            req.params.id,

          /*
          IMPORTANT:
          User can delete ONLY
          their own document.
          */

          user:
            req.user.id,
        });

      if (!document) {
        return res.status(404).json({
          success: false,
          message:
            "Document not found or you do not have permission to delete it.",
        });
      }

      /*
      Delete physical file
      */

      if (
        document.filePath &&
        fs.existsSync(
          document.filePath
        )
      ) {
        try {
          fs.unlinkSync(
            document.filePath
          );

          console.log(
            "Physical file deleted:",
            document.filePath
          );

        } catch (fileError) {
          console.error(
            "Physical file deletion failed:",
            fileError
          );
        }
      }

      /*
      Delete MongoDB document
      */

      await Document.deleteOne({
        _id:
          document._id,

        user:
          req.user.id,
      });

      /*
      Update analytics
      */

      await Analytics.findOneAndUpdate(
        {
          user:
            req.user.id,
        },

        {
          $inc: {
            documentsUploaded:
              -1,
          },
        }
      );

      /*
      Prevent negative count
      */

      await Analytics.findOneAndUpdate(
        {
          user:
            req.user.id,

          documentsUploaded: {
            $lt: 0,
          },
        },

        {
          $set: {
            documentsUploaded: 0,
          },
        }
      );

      /*
      Save activity
      */

      await Activity.create({
        user:
          req.user.id,

        type:
          "document_delete",

        title:
          "Deleted a document",

        description:
          `Deleted ${document.fileName}`,

        metadata: {
          documentId:
            document._id,

          fileName:
            document.fileName,
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

      return res.status(200).json({
        success: true,

        message:
          "Document deleted successfully.",

        documentId:
          document._id,
      });

    } catch (error) {
      console.error(
        "Delete Document Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to delete document.",
      });
    }
  }
);

module.exports = router;
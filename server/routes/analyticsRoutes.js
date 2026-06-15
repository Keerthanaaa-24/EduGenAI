const express = require("express");

const auth =
  require("../middleware/auth");

const Analytics =
  require("../models/Analytics");

const router =
  express.Router();

router.get(
  "/dashboard",
  auth,
  async (req, res) => {
    try {
      let analytics =
        await Analytics.findOne({
          user:
            req.user.id,
        });

      if (!analytics) {
        analytics =
          await Analytics.create({
            user:
              req.user.id,
          });
      }

      res.json({
        success: true,
        analytics,
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
const mongoose = require("mongoose");

const summarySchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      document: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true,
      },

      title: {
        type: String,
        required: true,
      },

      summary: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Summary",
    summarySchema
  );
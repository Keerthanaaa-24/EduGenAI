const mongoose = require("mongoose");
const activitySchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      type: {
        type: String,
        enum: [
          "document_upload",
          "document_delete",
          "quiz_generated",
          "quiz_completed",
          "summary_generated",
          "study_plan_generated",
          "chat",
        ],
        required: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        default: "",
      },

      metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },
    {
      timestamps: true,
    }
  );

activitySchema.index({
  user: 1,
  createdAt: -1,
});

module.exports =
  mongoose.model(
    "Activity",
    activitySchema
  );

const mongoose =
  require("mongoose");

const studyPlanSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      subject: String,

      examDate: Date,

      hoursPerDay: Number,

      plan: String,
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "StudyPlan",
    studyPlanSchema
  );
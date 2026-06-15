const mongoose = require("mongoose");

const analyticsSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
      },

      documentsUploaded: {
        type: Number,
        default: 0,
      },

      summariesGenerated: {
        type: Number,
        default: 0,
      },

      studyPlansGenerated: {
        type: Number,
        default: 0,
      },

      aiQuestionsAsked: {
        type: Number,
        default: 0,
      },

      quizAttempts: {
        type: Number,
        default: 0,
      },

      quizzesCompleted: {
        type: Number,
        default: 0,
      },

      totalScore: {
        type: Number,
        default: 0,
      },

      highestScore: {
        type: Number,
        default: 0,
      },

      averageScore: {
        type: Number,
        default: 0,
      },

      studyHours: {
        type: Number,
        default: 0,
      },

      progressPercentage: {
        type: Number,
        default: 0,
      },

      streakDays: {
        type: Number,
        default: 1,
      },

      lastLoginDate: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Analytics",
    analyticsSchema
  );
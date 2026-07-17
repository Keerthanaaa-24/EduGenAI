const mongoose = require("mongoose");

const quizAttemptSchema =
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
      },

      score: {
        type: Number,
        required: true,
      },

      totalQuestions: {
        type: Number,
        required: true,
      },

      percentage: {
        type: Number,
        required: true,
      },

      grade: {
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
    "QuizAttempt",
    quizAttemptSchema
  );
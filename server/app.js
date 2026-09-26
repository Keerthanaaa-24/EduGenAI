const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const chatRoutes = require("./routes/chatRoutes");
const quizRoutes = require("./routes/quizRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const plannerRoutes = require("./routes/plannerRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const quizResultRoutes = require("./routes/quizResultRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EduGen AI Backend Running",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/quiz-results", quizResultRoutes);

// Error handler — keep this LAST
app.use(errorHandler);

module.exports = app;
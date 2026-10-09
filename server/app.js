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

// Allowed Origins
const allowedOrigins = [
  "https://edu-gen-ai-six.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
];

// Add FRONTEND_URL or CLIENT_URL from environment if defined
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/+$/, ""));
}
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL.replace(/\/+$/, ""));
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }
    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/edu-gen-ai[a-z0-9-]*\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  optionsSuccessStatus: 204,
  credentials: false,
};

// Middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EduGen AI Backend Running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EduGen AI backend is running",
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
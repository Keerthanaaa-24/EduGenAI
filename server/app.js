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

// --------------------------------------------------
// Allowed frontend origins
// --------------------------------------------------

const allowedOrigins = [
  "https://edu-gen-ai-six.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
];

// Add frontend URLs configured in environment variables.
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(
    process.env.FRONTEND_URL.replace(/\/+$/, "")
  );
}

if (process.env.CLIENT_URL) {
  allowedOrigins.push(
    process.env.CLIENT_URL.replace(/\/+$/, "")
  );
}

// --------------------------------------------------
// CORS configuration
// --------------------------------------------------

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header,
    // such as server-to-server requests.
    if (!origin) {
      return callback(null, true);
    }

    // Allow explicitly configured frontend origins.
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow Vercel preview deployments belonging
    // to the configured Vercel account namespace.
    const isVercelPreview =
      /^https:\/\/edu-gen-[a-z0-9-]+-keerthanamr1307-1357s-projects\.vercel\.app$/.test(
        origin
      );

    if (isVercelPreview) {
      return callback(null, true);
    }

    return callback(
      new Error("Not allowed by CORS")
    );
  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

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

// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------------------------------------
// Root endpoint
// --------------------------------------------------

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EduGen AI Backend Running",
  });
});

// --------------------------------------------------
// Health endpoint
// --------------------------------------------------

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EduGen AI backend is running",
  });
});

// --------------------------------------------------
// API routes
// --------------------------------------------------

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/quiz-results", quizResultRoutes);

// --------------------------------------------------
// Error handler (must be last)
// --------------------------------------------------

app.use(errorHandler);

// --------------------------------------------------
// Export Express application
// --------------------------------------------------

module.exports = app;
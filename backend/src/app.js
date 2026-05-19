const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const errorHandler = require("./middleware/errorHandler");
const AppError = require("./utils/AppError");

const app = express();

// ─────────────────────────────────────────────
// SECURITY MIDDLEWARE
// ─────────────────────────────────────────────

// Set security HTTP headers
app.use(helmet());

// Enable CORS with explicit origins for development
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting: max 200 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
});
app.use("/api", limiter);

// ─────────────────────────────────────────────
// GENERAL MIDDLEWARE
// ─────────────────────────────────────────────

// Parse JSON request bodies (increased for code payloads)
app.use(express.json({ limit: "50kb" }));

// HTTP request logger (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({ message: "AI Code Reviewer API is running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api", reviewRoutes);

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found.`, 404));
});

// ─────────────────────────────────────────────
// GLOBAL ERROR HANDLER (must be last)
// ─────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const featureRoutes = require("./routes/featureRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Logger (optional but nice)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/features", featureRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Feature Tracker API running",
    status: "OK",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
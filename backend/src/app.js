const express = require("express");
const cors = require("cors");
const featureRoutes = require("./routes/featureRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Feature Tracker API running" });
});

app.use("/api/features", featureRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

module.exports = app;
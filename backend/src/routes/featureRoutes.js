const express = require("express");
const router = express.Router();

const {
  getAllFeatures,
  getFeatureById,
  createFeature,
  updateFeature,
  deleteFeature,
  updateFeatureStatus,
} = require("../controllers/featureController");

const validateFeature = require("../middlewares/validateFeature");
const validateStatus = require("../middlewares/validateStatus");

router.get("/", getAllFeatures);
router.get("/:id", getFeatureById);
router.post("/", validateFeature, createFeature);
router.put("/:id", validateFeature, updateFeature);
router.patch("/:id/status", validateStatus, updateFeatureStatus);
router.delete("/:id", deleteFeature);

module.exports = router;
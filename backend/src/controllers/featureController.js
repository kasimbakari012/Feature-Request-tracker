const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler");

const getAllFeatures = asyncHandler(async (req, res) => {
  const { status } = req.query;

  let sql = "SELECT * FROM features";
  const params = [];

  if (status && status !== "All") {
    sql += " WHERE status = ?";
    params.push(status);
  }

  sql += " ORDER BY created_at DESC";

  const [rows] = await pool.query(sql, params);
  res.status(200).json(rows);
});

const getFeatureById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query("SELECT * FROM features WHERE id = ?", [id]);

  if (rows.length === 0) {
    return res.status(404).json({ message: "Feature not found" });
  }

  res.status(200).json(rows[0]);
});

const createFeature = asyncHandler(async (req, res) => {
  const { title, description, priority = "Low", status = "Open" } = req.body;

  const [result] = await pool.query(
    `INSERT INTO features (title, description, priority, status, created_at)
     VALUES (?, ?, ?, ?, NOW())`,
    [(title || "").trim(), description || "", priority, status]
  );

  const [rows] = await pool.query("SELECT * FROM features WHERE id = ?", [
    result.insertId,
  ]);

  res.status(201).json({
    message: "Feature created successfully",
    data: rows[0],
  });
});

const updateFeature = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, status } = req.body;

  const [existing] = await pool.query("SELECT * FROM features WHERE id = ?", [
    id,
  ]);

  if (existing.length === 0) {
    return res.status(404).json({ message: "Feature not found" });
  }

  await pool.query(
    `UPDATE features
     SET title = ?, description = ?, priority = ?, status = ?
     WHERE id = ?`,
    [(title || "").trim(), description || "", priority, status, id]
  );

  const [updated] = await pool.query("SELECT * FROM features WHERE id = ?", [
    id,
  ]);

  res.status(200).json({
    message: "Feature updated successfully",
    data: updated[0],
  });
});

const deleteFeature = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existing] = await pool.query("SELECT id FROM features WHERE id = ?", [
    id,
  ]);

  if (existing.length === 0) {
    return res.status(404).json({ message: "Feature not found" });
  }

  await pool.query("DELETE FROM features WHERE id = ?", [id]);

  res.status(200).json({ message: "Feature deleted successfully" });
});

const updateFeatureStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const [existing] = await pool.query("SELECT id FROM features WHERE id = ?", [
    id,
  ]);

  if (existing.length === 0) {
    return res.status(404).json({ message: "Feature not found" });
  }

  await pool.query("UPDATE features SET status = ? WHERE id = ?", [status, id]);

  const [updated] = await pool.query("SELECT * FROM features WHERE id = ?", [
    id,
  ]);

  res.status(200).json({
    message: "Status updated successfully",
    data: updated[0],
  });
});

module.exports = {
  getAllFeatures,
  getFeatureById,
  createFeature,
  updateFeature,
  deleteFeature,
  updateFeatureStatus,
};
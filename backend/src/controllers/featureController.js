const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler");

// Lightweight in-memory cache
const cache = new Map();
const CACHE_TTL = 10 * 1000; // 10 seconds

const ALLOWED_STATUSES = new Set(["Open", "In Progress", "Completed"]);
const ALLOWED_PRIORITIES = new Set(["Low", "Medium", "High"]);

const MAX_TITLE_LENGTH = 150;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_SEARCH_LENGTH = 100;

function clearFeatureCache() {
  cache.clear();
}

function stripHtml(value) {
  return String(value).replace(/<[^>]*>/g, "");
}

function sanitizeInput(value, { maxLength = 255, allowNewLines = false } = {}) {
  if (value === undefined || value === null) return "";
  let text = String(value);

  // Remove null bytes and control chars except line breaks 
  text = allowNewLines
    ? text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    : text.replace(/[\u0000-\u001F\u007F]/g, " ");

  text = stripHtml(text);

  if (!allowNewLines) {
    text = text.replace(/\s+/g, " ");
  }

  text = text.trim();

  if (text.length > maxLength) {
    text = text.slice(0, maxLength).trim();
  }

  return text;
}

function normalizePriority(priority) {
  const value = sanitizeInput(priority, { maxLength: 20 });
  return ALLOWED_PRIORITIES.has(value) ? value : null;
}

function normalizeStatus(status) {
  const value = sanitizeInput(status, { maxLength: 30 });
  return ALLOWED_STATUSES.has(value) ? value : null;
}

function validateFeatureBody(body, { isUpdate = false } = {}) {
  const errors = [];

  const rawTitle = body?.title;
  const rawDescription = body?.description ?? body?.desc; // backward-compatible fallback
  const rawPriority = body?.priority;
  const rawStatus = body?.status;

  const title = sanitizeInput(rawTitle, { maxLength: MAX_TITLE_LENGTH });
  const description = sanitizeInput(rawDescription, {
    maxLength: MAX_DESCRIPTION_LENGTH,
    allowNewLines: true,
  });
  const priority = normalizePriority(rawPriority ?? "Low") || "Low";
  const status = normalizeStatus(rawStatus ?? "Open") || "Open";

  if (!title) {
    errors.push("Title is required.");
  }

  if (title && title.length < 2) {
    errors.push("Title must be at least 2 characters long.");
  }

  if (title && title.length > MAX_TITLE_LENGTH) {
    errors.push(`Title must not exceed ${MAX_TITLE_LENGTH} characters.`);
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push(`Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters.`);
  }

  if (rawPriority !== undefined && !ALLOWED_PRIORITIES.has(priority)) {
    errors.push("Priority must be Low, Medium, or High.");
  }

  if (rawStatus !== undefined && !ALLOWED_STATUSES.has(status)) {
    errors.push("Status must be Open, In Progress, or Completed.");
  }

  return {
    valid: errors.length === 0,
    errors,
    data: {
      title,
      description,
      priority,
      status,
    },
  };
}

const getAllFeatures = asyncHandler(async (req, res) => {
  const {
    status,
    search,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));

  const cacheKey = JSON.stringify({
    status,
    search,
    page: pageNum,
    limit: limitNum,
    sortBy,
    sortOrder,
  });

  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return res.status(200).json(cached.data);
    }
    cache.delete(cacheKey);
  }

  let sql = `
    SELECT id, title, description, priority, status, created_at
    FROM features
  `;
  let countSql = "SELECT COUNT(*) as total FROM features";

  const conditions = [];
  const params = [];

  const cleanSearch = sanitizeInput(search, { maxLength: MAX_SEARCH_LENGTH });
  const cleanStatus = sanitizeInput(status, { maxLength: 30 });

  if (cleanSearch) {
    // Full-text search
    conditions.push("MATCH(title, description) AGAINST(? IN NATURAL LANGUAGE MODE)");
    params.push(cleanSearch);
  }

  if (cleanStatus && cleanStatus !== "All") {
    if (!ALLOWED_STATUSES.has(cleanStatus)) {
      return res.status(400).json({
        message: "Invalid status filter.",
      });
    }
    conditions.push("status = ?");
    params.push(cleanStatus);
  }

  if (conditions.length > 0) {
    const whereClause = " WHERE " + conditions.join(" AND ");
    sql += whereClause;
    countSql += whereClause;
  }

  const allowedSortFields = {
    createdAt: "created_at",
    priority: "priority",
  };

  const sortField = allowedSortFields[sortBy] || "created_at";
  const order = String(sortOrder).toLowerCase() === "asc" ? "ASC" : "DESC";

  sql += ` ORDER BY ${sortField} ${order}`;

  const offset = (pageNum - 1) * limitNum;
  sql += " LIMIT ? OFFSET ?";
  const finalParams = [...params, limitNum, offset];

  const [rows] = await pool.query(sql, finalParams);
  const [countResult] = await pool.query(countSql, params);

  const total = Number(countResult?.[0]?.total || 0);
  const totalPages = Math.max(1, Math.ceil(total / limitNum));

  const response = {
    data: rows,
    total,
    totalPages,
    page: pageNum,
  };

  cache.set(cacheKey, {
    data: response,
    timestamp: Date.now(),
  });

  res.status(200).json(response);
});

const getFeatureById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const featureId = parseInt(id, 10);
  if (!Number.isInteger(featureId) || featureId <= 0) {
    return res.status(400).json({ message: "Invalid feature ID." });
  }

  const [rows] = await pool.query(
    "SELECT id, title, description, priority, status, created_at FROM features WHERE id = ?",
    [featureId]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Feature not found" });
  }

  res.status(200).json(rows[0]);
});

const createFeature = asyncHandler(async (req, res) => {
  const validation = validateFeatureBody(req.body);
  if (!validation.valid) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.errors,
    });
  }

  const { title, description, priority, status } = validation.data;

  const [result] = await pool.query(
    `INSERT INTO features (title, description, priority, status, created_at)
     VALUES (?, ?, ?, ?, NOW())`,
    [title, description, priority, status]
  );

  const [rows] = await pool.query(
    "SELECT id, title, description, priority, status, created_at FROM features WHERE id = ?",
    [result.insertId]
  );

  clearFeatureCache();

  res.status(201).json({
    message: "Feature created successfully",
    data: rows[0],
  });
});

const updateFeature = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const featureId = parseInt(id, 10);
  if (!Number.isInteger(featureId) || featureId <= 0) {
    return res.status(400).json({ message: "Invalid feature ID." });
  }

  const [existing] = await pool.query("SELECT id FROM features WHERE id = ?", [
    featureId,
  ]);

  if (existing.length === 0) {
    return res.status(404).json({ message: "Feature not found" });
  }

  const validation = validateFeatureBody(req.body, { isUpdate: true });
  if (!validation.valid) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.errors,
    });
  }

  const { title, description, priority, status } = validation.data;

  await pool.query(
    `UPDATE features
     SET title = ?, description = ?, priority = ?, status = ?
     WHERE id = ?`,
    [title, description, priority, status, featureId]
  );

  const [updated] = await pool.query(
    "SELECT id, title, description, priority, status, created_at FROM features WHERE id = ?",
    [featureId]
  );

  clearFeatureCache();

  res.status(200).json({
    message: "Feature updated successfully",
    data: updated[0],
  });
});

const deleteFeature = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const featureId = parseInt(id, 10);
  if (!Number.isInteger(featureId) || featureId <= 0) {
    return res.status(400).json({ message: "Invalid feature ID." });
  }

  const [existing] = await pool.query("SELECT id FROM features WHERE id = ?", [
    featureId,
  ]);

  if (existing.length === 0) {
    return res.status(404).json({ message: "Feature not found" });
  }

  await pool.query("DELETE FROM features WHERE id = ?", [featureId]);

  clearFeatureCache();

  res.status(200).json({ message: "Feature deleted successfully" });
});

const updateFeatureStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const featureId = parseInt(id, 10);
  if (!Number.isInteger(featureId) || featureId <= 0) {
    return res.status(400).json({ message: "Invalid feature ID." });
  }

  const cleanStatus = normalizeStatus(status);
  if (!cleanStatus) {
    return res.status(400).json({
      message: "Invalid status. Use Open, In Progress, or Completed.",
    });
  }

  const [existing] = await pool.query("SELECT id FROM features WHERE id = ?", [
    featureId,
  ]);

  if (existing.length === 0) {
    return res.status(404).json({ message: "Feature not found" });
  }

  await pool.query("UPDATE features SET status = ? WHERE id = ?", [
    cleanStatus,
    featureId,
  ]);

  const [updated] = await pool.query(
    "SELECT id, title, description, priority, status, created_at FROM features WHERE id = ?",
    [featureId]
  );

  clearFeatureCache();

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

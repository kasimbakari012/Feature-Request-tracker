const validateFeature = (req, res, next) => {
  const { title, description, priority, status } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({ message: "Description must be a string" });
  }

  const allowedPriorities = ["Low", "Medium", "High"];
  if (priority && !allowedPriorities.includes(priority)) {
    return res.status(400).json({ message: "Invalid priority value" });
  }

  const allowedStatuses = ["Open", "In Progress", "Completed"];
  if (status && !allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  next();
};

module.exports = validateFeature;
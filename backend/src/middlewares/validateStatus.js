module.exports = (req, res, next) => {
  const { status } = req.body;
  const allowedStatuses = ["Open", "In Progress", "Completed"];

  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Status must be one of: Open, In Progress, Completed",
    });
  }

  next();
};
const validateRequest = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = requiredFields.filter(
      (field) => !req.body[field] || req.body[field].toString().trim() === ""
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields: " + missingFields.join(", "),
      });
    }

    next();
  };
};

module.exports = validateRequest;
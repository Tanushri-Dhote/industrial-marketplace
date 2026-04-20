module.exports = (req, res, next) => {
  try {
    // Super admin bypass
    if (req.user.role === "super_admin") {
      req.tenantId = null;
      return next();
    }

    if (!req.user.website_id) {
      return res.status(403).json({ message: "No tenant access" });
    }

    req.tenantId = req.user.website_id;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
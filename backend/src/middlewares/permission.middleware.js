const Permission = require("../models/Permission");

module.exports = (moduleName, action) => {
  return async (req, res, next) => {
    try {
      // 🔥 Super admin bypass
      if (req.user.role === "super_admin") return next();

      const permission = await Permission.findOne({
        role: req.user.role,
        module: moduleName,
      });

      if (!permission || !permission.actions.includes(action)) {
        return res.status(403).json({
          message: "Permission denied",
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};
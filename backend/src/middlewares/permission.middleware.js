const Permission = require("../models/Permission");

const permission = (module, action) => {
  return async (req, res, next) => {
    try {
      const role = req.user.role;

      const perm = await Permission.findOne({
        role,
        module,
      });

      if (!perm || !perm.actions.includes(action)) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

module.exports = permission 
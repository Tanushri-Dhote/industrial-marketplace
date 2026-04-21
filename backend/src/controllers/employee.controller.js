const User = require("../models/User");

// ✅ GET ALL EMPLOYEES
exports.getEmployees = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE EMPLOYEE
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Employee updated",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE EMPLOYEE
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "Employee deleted",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ TOGGLE STATUS
exports.toggleStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.isActive = !user.isActive;
    await user.save();

    res.json({ data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
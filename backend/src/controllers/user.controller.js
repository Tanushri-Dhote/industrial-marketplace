const User = require("../models/User.js");
const bcrypt = require("bcryptjs");

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        phone1: phone, // map correctly
      },
      { new: true }
    );

    res.json({
      success: true,
      data: updatedUser,
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// Update Business
exports.updateBusiness = async (req, res) => {
  try {
    const userId = req.user.id;
    const { businessName, vat, warranty, address } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        business_name: businessName,
        vat_number: vat,
        warranty,
        address,
        
      },
      { new: true }
    );
    res.json({
      success: true,
      data: updatedUser,
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to update business" });
  }
};

// ✅ Change Password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to change password" });
  }
};
const User = require("../models/User");
const Website = require("../models/Website");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      business_name,
      phone1,
      phone2,
      warranty,
      vat_number,
      role,
    } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Basic fields missing" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ================= SUPER ADMIN =================
    if (role === "super_admin") {
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "super_admin",
      });

      return res.status(201).json({
        message: "Super admin created",
        data: user,
      });
    }

    // ================= NORMAL USER =================
    if (!business_name || !phone1 || !warranty) {
      return res.status(400).json({
        message: "Business fields required",
      });
    }

    const website = await Website.create({
      name: business_name,
    });

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      business_name,
      phone1,
      phone2,
      warranty,
      vat_number,
      role: role || "admin",
      website_id: website._id,
    });

    website.owner = user._id;
    await website.save();

    res.status(201).json({
      message: "Business account created",
      data: user,
      website_id: website._id,
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isActive === false) {
      return res.status(403).json({ message: "Account deactivated" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔐 EMAIL VERIFICATION TOKEN
    const verifyToken = crypto.randomBytes(32).toString("hex");

    user.loginVerifyToken = verifyToken;
    user.loginVerifyExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    const verifyLink = `http://localhost:3000/verify-login?token=${verifyToken}`;

    await sendEmail(
      user.email,
      "Verify your login",
      `Click to verify login:\n${verifyLink}`
    );

    res.json({
      message: "Verification email sent",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= VERIFY LOGIN =================
exports.verifyLogin = async (req, res) => {
  try {
    const { token } = req.body;

    let user = await User.findOne({
      loginVerifyToken: token,
      loginVerifyExpires: { $gt: Date.now() },
    });

    // If token not found, check if already verified (optional improvement)
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const jwtToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        website_id: user.website_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Clear token after success
    user.loginVerifyToken = undefined;
    user.loginVerifyExpires = undefined;

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      message: "Login successful",
      token: jwtToken,
      data: userObj,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    // 🔥 Send email with frontend link
    const resetLink = `http://localhost:3000/login?token=${resetToken}`;

    await sendEmail(
      user.email,
      "Reset Password",
      `Click to reset your password:\n${resetLink}`
    );

    res.json({
      message: "Reset link sent to email",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and password required" });
    }

    // 🔍 find user
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // 🔐 hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // ❌ clear token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({
      message: "Password reset successful",
    });

  } catch (error) {
    console.error("RESET ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= FORGOT USERNAME =================
exports.forgotUsername = async (req, res) => {
  try {
    const { phone1 } = req.body;

    const user = await User.findOne({ phone1 });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await sendEmail(
      user.email,
      "Your Username",
      `Your username is: ${user.email}`
    );

    res.json({ message: "Username sent to email" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// 

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      data: user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
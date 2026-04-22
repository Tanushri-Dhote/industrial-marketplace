const User = require("../models/User");
const Website = require("../models/Website");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

exports.register = async (request, reply) => {
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
      site_id, // The ID of the existing Website/Tenant the user is registering for
    } = request.body;

    if (!name || !email || !password || !confirmPassword)
      return reply.status(400).send({ message: "Basic fields missing" });
    if (password !== confirmPassword)
      return reply.status(400).send({ message: "Passwords do not match" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return reply.status(409).send({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // SuperAdmin registration (no site required)
    if (role === "super_admin") {
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "super_admin",
      });
      return reply.status(201).send({ message: "Super admin created", data: user });
    }

    // Regular registration — must have business fields
    if (!business_name || !phone1 || !warranty)
      return reply.status(400).send({ message: "Business fields required" });

    // Resolve the site: use provided site_id, or fall back to the env-configured default site
    const resolvedSiteId = site_id || process.env.DEFAULT_SITE_ID;

    let websiteId = null;
    if (resolvedSiteId) {
      const website = await Website.findById(resolvedSiteId);
      if (!website)
        return reply.status(404).send({ message: "The specified site was not found" });
      websiteId = website._id;
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      business_name,
      phone1,
      phone2,
      warranty,
      vat_number,
      role: "viewer", // Default role is always viewer
      website_id: websiteId,
    });

    return reply.status(201).send({
      message: "Business account created",
      data: user,
      website_id: websiteId,
    });
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};


exports.login = async (request, reply) => {
  try {
    const { email, password } = request.body;
    const user = await User.findOne({ email });
    if (!user) return reply.status(404).send({ message: "User not found" });
    if (user.isActive === false)
      return reply.status(403).send({ message: "Account deactivated" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return reply.status(401).send({ message: "Invalid credentials" });
    const verifyToken = crypto.randomBytes(32).toString("hex");
    user.loginVerifyToken = verifyToken;
    user.loginVerifyExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    const verifyLink = `${process.env.CORS_ORIGIN}/verify-login?token=${verifyToken}`;
    await sendEmail(
      user.email,
      "Verify your login",
      `Click to verify login:\n${verifyLink}`,
    );
    return { message: "Verification email sent" };
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

exports.verifyLogin = async (request, reply) => {
  try {
    const { token } = request.body;
    let user = await User.findOne({
      loginVerifyToken: token,
      loginVerifyExpires: { $gt: Date.now() },
    });
    if (!user)
      return reply.status(400).send({ message: "Invalid or expired token" });
    const jwtToken = reply.jwtSign({
      id: user._id,
      role: user.role,
      website_id: user.website_id,
    });
    user.loginVerifyToken = undefined;
    user.loginVerifyExpires = undefined;
    await user.save();
    const userObj = user.toObject();
    delete userObj.password;
    return {
      message: "Login successful",
      token: await jwtToken,
      data: userObj,
    };
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

exports.forgotPassword = async (request, reply) => {
  try {
    const { email } = request.body;
    const user = await User.findOne({ email });
    if (!user) return reply.status(404).send({ message: "User not found" });

    // Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token and set to resetPasswordToken field
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Increased to 15 mins
    await user.save();

    // Send the UNHASHED token in the link
    const resetLink = `${process.env.CORS_ORIGIN}/reset-password?token=${resetToken}`;
    
    await sendEmail(
      user.email,
      "Reset Password",
      `Click to reset password:\n${resetLink}\n\nThis link will expire in 15 minutes.`
    );

    return { message: "Reset link sent to email" };
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

exports.resetPassword = async (request, reply) => {
  try {
    const { token, newPassword } = request.body;

    // Hash the token from the URL to compare with the one in the DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return reply.status(400).send({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: "Password reset successful" };
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

exports.forgotUsername = async (request, reply) => {
	try {
		const { phone1 } = request.body;
		const user = await User.findOne({ phone1 });
		if (!user) return reply.status(404).send({ message: "User not found" });
		await sendEmail(user.email, "Your Username", `Your username is: ${user.email}`);
		return { message: "Username sent to email" };
	} catch (error) {
		reply.status(500).send({ message: error.message });
	}
};

exports.getMyProfile = async (request, reply) => {
	try {
		const user = await User.findById(request.user.id).select("-password");
		if (!user) return reply.status(404).send({ message: "User not found" });
		return { success: true, data: user };
	} catch (error) {
		reply.status(500).send({ message: error.message });
	}
};

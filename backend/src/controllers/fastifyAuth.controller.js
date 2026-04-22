const User = require("../models/User");
const Website = require("../models/Website");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

exports.register = async (request, reply) => {
	try {
		const { name, email, password, confirmPassword, business_name, phone1, phone2, warranty, vat_number, role } = request.body;
		if (!name || !email || !password || !confirmPassword) return reply.status(400).send({ message: "Basic fields missing" });
		if (password !== confirmPassword) return reply.status(400).send({ message: "Passwords do not match" });
		const existingUser = await User.findOne({ email });
		if (existingUser) return reply.status(409).send({ message: "User already exists" });
		const hashedPassword = await bcrypt.hash(password, 10);
		if (role === "super_admin") {
			const user = await User.create({ name, email, password: hashedPassword, role: "super_admin" });
			return reply.status(201).send({ message: "Super admin created", data: user });
		}
		if (!business_name || !phone1 || !warranty) return reply.status(400).send({ message: "Business fields required" });
		const website = await Website.create({ name: business_name });
		const user = await User.create({ name, email, password: hashedPassword, business_name, phone1, phone2, warranty, vat_number, role: role || "admin", website_id: website._id });
		website.owner = user._id;
		await website.save();
		return reply.status(201).send({ message: "Business account created", data: user, website_id: website._id });
	} catch (error) {
		reply.status(500).send({ message: error.message });
	}
};

exports.login = async (request, reply) => {
	try {
		const { email, password } = request.body;
		const user = await User.findOne({ email });
		if (!user) return reply.status(404).send({ message: "User not found" });
		if (user.isActive === false) return reply.status(403).send({ message: "Account deactivated" });
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return reply.status(401).send({ message: "Invalid credentials" });
		const verifyToken = crypto.randomBytes(32).toString("hex");
		user.loginVerifyToken = verifyToken;
		user.loginVerifyExpires = Date.now() + 10 * 60 * 1000;
		await user.save();
		const verifyLink = `http://localhost:3000/verify-login?token=${verifyToken}`;
		await sendEmail(user.email, "Verify your login", `Click to verify login:\n${verifyLink}`);
		return { message: "Verification email sent" };
	} catch (error) {
		reply.status(500).send({ message: error.message });
	}
};

exports.verifyLogin = async (request, reply) => {
	try {
		const { token } = request.body;
		let user = await User.findOne({ loginVerifyToken: token, loginVerifyExpires: { $gt: Date.now() } });
		if (!user) return reply.status(400).send({ message: "Invalid or expired token" });
		const jwtToken = reply.jwtSign({ id: user._id, role: user.role, website_id: user.website_id });
		user.loginVerifyToken = undefined;
		user.loginVerifyExpires = undefined;
		await user.save();
		const userObj = user.toObject();
		delete userObj.password;
		return { message: "Login successful", token: await jwtToken, data: userObj };
	} catch (error) {
		reply.status(500).send({ message: error.message });
	}
};

exports.forgotPassword = async (request, reply) => {
	try {
		const { email } = request.body;
		const user = await User.findOne({ email });
		if (!user) return reply.status(404).send({ message: "User not found" });
		const resetToken = crypto.randomBytes(32).toString("hex");
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
		await user.save();
		const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
		await sendEmail(user.email, "Reset Password", `Click to reset password:\n${resetLink}`);
		return { message: "Reset link sent to email" };
	} catch (error) {
		reply.status(500).send({ message: error.message });
	}
};

exports.resetPassword = async (request, reply) => {
	try {
		const { token, newPassword } = request.body;
		const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
		if (!user) return reply.status(400).send({ message: "Invalid or expired token" });
		user.password = await bcrypt.hash(newPassword, 10);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save();
		return { message: "Password reset successful" };
	} catch (error) {
		reply.status(500).send({ message: error.message });
	}
};

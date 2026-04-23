const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ================= RESET PASSWORD (ADMIN ACTION) =================
exports.resetPasswordAdmin = async (request, reply) => {
	try {
		const { userId, newPassword } = request.body;

		// Only allow super_admin to reset others' passwords
		if (request.user.role !== "super_admin") {
			return reply.status(403).send({ message: "Only Super Admins can reset passwords" });
		}

		if (!newPassword || newPassword.length < 6) {
			return reply.status(400).send({ message: "Password must be at least 6 characters" });
		}

		const user = await User.findById(userId);
		if (!user) {
			return reply.status(404).send({ message: "User not found" });
		}

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(newPassword, salt);
		await user.save();

		return reply.send({ message: `Password reset successfully for ${user.name}` });
	} catch (error) {
		reply.status(500).send({ message: error.message });
	}
};

// ================= INVITE STAFF =================
exports.inviteStaff = async (request, reply) => {
	try {
		const { email, role, website_id } = request.body;

		// Simulating invitation logic (In a real app, this would send an email with a setup token)
		// For now, we'll just check if user exists or show success
		const exists = await User.findOne({ email });
		if (exists) {
			return reply.status(400).send({ message: "A user with this email already exists" });
		}

		return reply.send({
			message: `Invitation email sent to ${email}.`,
			note: "In production, this would trigger sendEmail.js with a registration link.",
		});
	} catch (error) {
		reply.status(500).send({ message: error.message });
	}
};

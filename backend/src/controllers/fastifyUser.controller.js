const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Update Profile
exports.updateProfile = async (request, reply) => {
	try {
		const userId = request.user.id;
		const { name, phone } = request.body;
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{
				name,
				phone1: phone, // map correctly
			},
			{ new: true }
		).select("-password");

		return {
			success: true,
			data: updatedUser,
		};
	} catch (error) {
		reply.status(500).send({ message: "Failed to update profile" });
	}
};

// Update Business
exports.updateBusiness = async (request, reply) => {
	try {
		const userId = request.user.id;
		const { businessName, vat, warranty, address } = request.body;
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{
				business_name: businessName,
				vat_number: vat,
				warranty,
				address,
			},
			{ new: true }
		).select("-password");
		
		return {
			success: true,
			data: updatedUser,
		};
	} catch (error) {
		reply.status(500).send({ message: "Failed to update business" });
	}
};

// Change Password
exports.changePassword = async (request, reply) => {
	try {
		const userId = request.user.id;
		const { currentPassword, newPassword } = request.body;

		const user = await User.findById(userId);
		if (!user) return reply.status(404).send({ message: "User not found" });

		const isMatch = await bcrypt.compare(currentPassword, user.password);
		if (!isMatch) {
			return reply.status(400).send({ message: "Current password is incorrect" });
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);
		user.password = hashedPassword;
		await user.save();

		return {
			success: true,
			message: "Password updated successfully",
		};
	} catch (error) {
		reply.status(500).send({ message: "Failed to change password" });
	}
};

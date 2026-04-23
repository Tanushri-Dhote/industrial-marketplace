const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET ALL EMPLOYEES
exports.getEmployees = async (request, reply) => {
	try {
		const { search, role, status } = request.query;
		let filter = {};

		// Enforce tenant scoping for non-super_admins
		if (request.tenantId) {
			filter.website_id = request.tenantId;
		}

		// Search
		if (search) {
			filter.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } },
			];
		}

		// Role filter
		if (role && role !== "All") {
			const roleMap = {
				"Super Admin": "super_admin",
				Admin: "admin",
				"Website Admin": "website_manager",
				"Sales Manager": "sales_manager",
				Viewer: "viewer",
			};
			const dbRole = roleMap[role];
			if (dbRole) {
				filter.role = dbRole;
			}
		}

		// Status filter
		if (status && status !== "All") {
			filter.isActive = status === "Active";
		}

		const users = await User.find(filter).select("-password").populate("website_id", "name domain");

		return {
			success: true,
			data: users,
		};
	} catch (err) {
		reply.status(500).send({ message: err.message });
	}
};

// CREATE EMPLOYEE
exports.createEmployee = async (request, reply) => {
	try {
		const { name, email, password, role, website_id, business_name, phone1 } = request.body;

		let targetWebsiteId = website_id;
		let targetRole = role;

		// Prevent super_admin creation from this endpoint
		if (targetRole === "super_admin") {
			return reply.status(403).send({ message: "Cannot create super admin" });
		}

		if (request.tenantId) {
			// Regular admin creating a user
			targetWebsiteId = request.tenantId; // Force their own website

			// Non-super admins can't create "admin" or "super_admin" roles
			if (["admin", "super_admin"].includes(targetRole)) {
				return reply.status(403).send({ message: "Not allowed to create this role" });
			}
		}

		// Check if user exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return reply.status(400).send({ message: "Email already exists" });
		}

		const hashedPassword = await bcrypt.hash(password || "password123", 10);

		const newUser = await User.create({
			name,
			email,
			password: hashedPassword,
			role: targetRole || "viewer",
			website_id: targetWebsiteId,
			business_name: business_name || "Employee",
			phone1: phone1 || "0000000000",
			warranty: "3 months", // Default required field
			loginVerified: true, // Auto verify employee creation
		});

		return {
			success: true,
			message: "Employee created",
			data: newUser,
		};
	} catch (err) {
		reply.status(500).send({ message: err.message });
	}
};

// UPDATE EMPLOYEE
exports.updateEmployee = async (request, reply) => {
	try {
		const { id } = request.params;

		const filter = { _id: id };
		if (request.tenantId) {
			filter.website_id = request.tenantId;
		}

		const targetUser = await User.findOne(filter);
		if (!targetUser) {
			return reply.status(404).send({ message: "Employee not found or unauthorized" });
		}

		// Prevent privilege escalation by normal admin
		if (
			request.tenantId &&
			request.body.role &&
			["admin", "super_admin"].includes(request.body.role)
		) {
			return reply.status(403).send({ message: "Not allowed to set this role" });
		}

		// If updating password
		if (request.body.password) {
			request.body.password = await bcrypt.hash(request.body.password, 10);
		}

		const updated = await User.findOneAndUpdate(filter, request.body, { new: true }).select(
			"-password",
		);

		return {
			message: "Employee updated",
			data: updated,
		};
	} catch (err) {
		reply.status(500).send({ message: err.message });
	}
};

// DELETE EMPLOYEE
exports.deleteEmployee = async (request, reply) => {
	try {
		const { id } = request.params;
		const filter = { _id: id };
		if (request.tenantId) {
			filter.website_id = request.tenantId;
		}

		const deletedUser = await User.findOneAndDelete(filter);
		if (!deletedUser) {
			return reply.status(404).send({ message: "Employee not found or unauthorized" });
		}

		return {
			message: "Employee deleted",
		};
	} catch (err) {
		reply.status(500).send({ message: err.message });
	}
};

// TOGGLE STATUS
exports.toggleStatus = async (request, reply) => {
	try {
		const { id } = request.params;
		const filter = { _id: id };
		if (request.tenantId) {
			filter.website_id = request.tenantId;
		}

		const user = await User.findOne(filter);
		if (!user) return reply.status(404).send({ message: "User not found or unauthorized" });

		user.isActive = !user.isActive;
		await user.save();
		return { data: user };
	} catch (err) {
		reply.status(500).send({ message: err.message });
	}
};

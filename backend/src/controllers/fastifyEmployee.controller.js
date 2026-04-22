const User = require("../models/User");

// GET ALL EMPLOYEES
exports.getEmployees = async (request, reply) => {
	try {
		const { search, role, status } = request.query;
		let filter = {};

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
				"Admin": "admin",
				"Website Admin": "website_manager",
				"Sales Manager": "sales_manager",
				"Viewer": "viewer",
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

		const users = await User.find(filter).select("-password");

		return {
			success: true,
			data: users,
		};
	} catch (err) {
		reply.status(500).send({ message: err.message });
	}
};

// UPDATE EMPLOYEE
exports.updateEmployee = async (request, reply) => {
	try {
		const { id } = request.params;
		const updated = await User.findByIdAndUpdate(
			id,
			request.body,
			{ new: true }
		).select("-password");

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
		await User.findByIdAndDelete(id);
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
		const user = await User.findById(request.params.id);
		if (!user) return reply.status(404).send({ message: "User not found" });
		user.isActive = !user.isActive;
		await user.save();
		return { data: user };
	} catch (err) {
		reply.status(500).send({ message: err.message });
	}
};

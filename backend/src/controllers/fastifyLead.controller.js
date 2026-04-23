const Lead = require("../models/Lead");

// GET ALL LEADS
exports.getLeads = async (request, reply) => {
	try {
		const { status, assigned_to } = request.query;
		let filter = {};

		// Enforce tenant scoping
		if (request.tenantId) {
			filter.website_id = request.tenantId;

			// If the user's role is specifically "sales_manager", optionally restrict them to their assigned leads only
			// (Depending on your exact workflow logic, you might let sales managers see all leads for their company,
			// or only their own. Commonly they only see their own, or unassigned ones. Let's enforce assigned_to filtering properly)
			if (request.user && request.user.role === "sales_manager") {
				// Either unassigned or assigned specifically to them
				filter.$or = [
					{ assigned_to: request.user._id },
					{ assigned_to: null },
					{ assigned_to: { $exists: false } },
				];
			}
		}

		if (status && status !== "All") filter.status = status;
		if (assigned_to) filter.assigned_to = assigned_to;

		const leads = await Lead.find(filter)
			.populate("website_id", "name domain")
			.populate("assigned_to", "name email")
			.sort({ createdAt: -1 });

		return { success: true, data: leads };
	} catch (err) {
		reply.status(500).send({ message: err.message });
	}
};

// GET SINGLE LEAD
exports.getLead = async (request, reply) => {
	try {
		const { id } = request.params;
		const filter = { _id: id };
		if (request.tenantId) filter.website_id = request.tenantId;

		const lead = await Lead.findOne(filter)
			.populate("website_id", "name domain")
			.populate("assigned_to", "name email");

		if (!lead) return reply.status(404).send({ message: "Lead not found" });

		return { success: true, data: lead };
	} catch (err) {
		reply.status(500).send({ message: err.message });
	}
};

// CREATE LEAD (Usually from public website form submission)
exports.createLead = async (request, reply) => {
	try {
		// A lead can be submitted publicly. If so, a website_id needs to be identified from headers, API keys, or payload.
		// We'll trust request.body.website_id here, but in production, you might map it by origin domain.
		const leadData = {
			...request.body,
		};

		// If created by an authenticated user via admin dashboard
		if (request.tenantId && !leadData.website_id) {
			leadData.website_id = request.tenantId;
		}

		if (!leadData.website_id) {
			return reply.status(400).send({ message: "website_id is required" });
		}

		const newLead = await Lead.create(leadData);

		return {
			success: true,
			message: "Lead created successfully",
			data: newLead,
		};
	} catch (err) {
		reply.status(500).send({ message: err.message });
	}
};

// UPDATE LEAD (Assigning, advancing status, etc.)
exports.updateLead = async (request, reply) => {
	try {
		const { id } = request.params;
		const filter = { _id: id };
		if (request.tenantId) filter.website_id = request.tenantId;

		// Find the lead first
		const lead = await Lead.findOne(filter);
		if (!lead) return reply.status(404).send({ message: "Lead not found" });

		// If a sales_manager tries to re-assign or steal a lead assigned to someone else
		if (
			request.tenantId &&
			request.user.role === "sales_manager" &&
			lead.assigned_to &&
			lead.assigned_to.toString() !== request.user._id.toString()
		) {
			return reply.status(403).send({ message: "Lead is already assigned to someone else" });
		}

		// Prevent unauthorized privilege modifications (a viewer updating leads, etc is handled by permissionHook)

		const updatedLead = await Lead.findOneAndUpdate(filter, request.body, { new: true });

		return {
			success: true,
			message: "Lead updated",
			data: updatedLead,
		};
	} catch (err) {
		reply.status(500).send({ message: err.message });
	}
};

// DELETE LEAD
exports.deleteLead = async (request, reply) => {
	try {
		const { id } = request.params;
		const filter = { _id: id };
		if (request.tenantId) filter.website_id = request.tenantId;

		const deletedLead = await Lead.findOneAndDelete(filter);
		if (!deletedLead) return reply.status(404).send({ message: "Lead not found" });

		return { message: "Lead deleted successfully" };
	} catch (err) {
		reply.status(500).send({ message: err.message });
	}
};

const Product = require("../models/Product");
const Lead = require("../models/Lead");
const Website = require("../models/Website");
const Registration = require("../models/Registration"); // if registrations differ from leads
const User = require("../models/User");
const Blog = require("../models/Blog");
const Inquiry = require("../models/Inquiry");

// GET DASHBOARD STATS
exports.getStats = async (request, reply) => {
	try {
		const result = {
			products: 0,
			leads: 0,
			websites: 0,
			employees: 0,
			blogs: 0,
			inquiries: 0,
			statusCounts: {
				new: 0,
				contacted: 0,
				won: 0,
				lost: 0,
			},
		};

		if (!request.tenantId) {
			// Super Admin: Platform wide stats
			result.products = await Product.countDocuments();
			result.leads = await Lead.countDocuments();
			result.websites = await Website.countDocuments();
			result.employees = await User.countDocuments();
			result.blogs = await Blog.countDocuments();
			result.inquiries = await Inquiry.countDocuments();

			const leadStatuses = await Lead.aggregate([
				{ $group: { _id: "$status", count: { $sum: 1 } } },
			]);

			leadStatuses.forEach((st) => {
				if (st._id === "New") result.statusCounts.new = st.count;
				if (st._id === "Contacted") result.statusCounts.contacted = st.count;
				if (st._id === "Won") result.statusCounts.won = st.count;
				if (st._id === "Lost") result.statusCounts.lost = st.count;
			});
		} else {
			// Admin / Website Manager / Sales Manager stats scoped to their website
			const filter = { website_id: request.tenantId };

			result.products = await Product.countDocuments(filter);
			result.employees = await User.countDocuments(filter);
			result.websites = 1; // Since they only manage 1

			// For sales_manager, maybe scope the lead counts to just theirs
			let leadFilter = { website_id: request.tenantId };
			if (request.user.role === "sales_manager") {
				leadFilter.assigned_to = request.user.id;
			}

			result.leads = await Lead.countDocuments(leadFilter);
			result.blogs = await Blog.countDocuments(filter);
			// Inquiries do not currently carry website_id, so report the total count
			// instead of forcing an incorrect zero value for tenant dashboards.
			result.inquiries = await Inquiry.countDocuments();

			const leadStatuses = await Lead.aggregate([
				{ $match: leadFilter },
				{ $group: { _id: "$status", count: { $sum: 1 } } },
			]);

			leadStatuses.forEach((st) => {
				if (st._id === "New") result.statusCounts.new = st.count;
				if (st._id === "Contacted") result.statusCounts.contacted = st.count;
				if (st._id === "Won") result.statusCounts.won = st.count;
				if (st._id === "Lost") result.statusCounts.lost = st.count;
			});
		}

		return {
			success: true,
			data: result,
		};
	} catch (err) {
		reply.status(500).send({ message: err.message });
	}
};

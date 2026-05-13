const Quote = require("../models/Quote");

exports.getQuotes = async (request, reply) => {
	try {
		const filter = {};
		if (request.tenantId) {
			filter.website_id = request.tenantId;
		}

		if (request.query.status && request.query.status !== "All") {
			filter.status = request.query.status;
		}

		const quotes = await Quote.find(filter)
			.populate("createdBy", "name email")
			.populate("website_id", "name domain")
			.sort({ createdAt: -1 });

		return reply.send({ success: true, data: quotes });
	} catch (error) {
		return reply.status(500).send({ success: false, message: error.message });
	}
};

exports.getQuote = async (request, reply) => {
	try {
		const filter = { _id: request.params.id };
		if (request.tenantId) {
			filter.website_id = request.tenantId;
		}

		const quote = await Quote.findOne(filter)
			.populate("createdBy", "name email")
			.populate("website_id", "name domain");

		if (!quote) {
			return reply.status(404).send({ success: false, message: "Quote not found" });
		}

		return reply.send({ success: true, data: quote });
	} catch (error) {
		return reply.status(500).send({ success: false, message: error.message });
	}
};

exports.createQuote = async (request, reply) => {
	try {
		const payload = request.body || {};

		if (!payload.customer?.name) {
			return reply.status(400).send({ success: false, message: "Customer name is required" });
		}

		const websiteId = request.tenantId || payload.website_id;

		if (!websiteId) {
			return reply
				.status(400)
				.send({ success: false, message: "website_id is required for this user" });
		}

		const quote = await Quote.create({
			...payload,
			website_id: websiteId,
			createdBy: request.user?.id,
			status: payload.status || "Sent",
		});

		return reply.status(201).send({
			success: true,
			message: "Quote created successfully",
			data: quote,
		});
	} catch (error) {
		return reply.status(500).send({ success: false, message: error.message });
	}
};

exports.updateQuote = async (request, reply) => {
	try {
		const filter = { _id: request.params.id };
		if (request.tenantId) {
			filter.website_id = request.tenantId;
		}

		// Load the quote first so we can enforce status-based restrictions
		const existing = await Quote.findOne(filter);
		if (!existing) {
			return reply.status(404).send({ success: false, message: "Quote not found" });
		}

		// Prevent editing of quotes that have been sent
		if (existing.status && existing.status.toLowerCase() === "sent") {
			return reply.status(403).send({ success: false, message: "Sent quotes cannot be edited" });
		}

		const quote = await Quote.findOneAndUpdate(filter, request.body, {
			new: true,
			runValidators: true,
		});

		return reply.send({ success: true, message: "Quote updated", data: quote });
	} catch (error) {
		return reply.status(500).send({ success: false, message: error.message });
	}
};

exports.deleteQuote = async (request, reply) => {
	try {
		const filter = { _id: request.params.id };
		if (request.tenantId) {
			filter.website_id = request.tenantId;
		}

		const quote = await Quote.findOneAndDelete(filter);
		if (!quote) {
			return reply.status(404).send({ success: false, message: "Quote not found" });
		}

		return reply.send({ success: true, message: "Quote deleted successfully" });
	} catch (error) {
		return reply.status(500).send({ success: false, message: error.message });
	}
};

const Quote = require("../models/Quote");
const sendEmail = require("../utils/sendEmail");

const sendQuoteProposalEmail = async (quote) => {
	if (!quote.customer?.email) return;

	const { refNumber, customer, vehicle, pricing, warranty, condition, mileage, notes } = quote;

	const subject = `Your Engine Quote Proposal - Ref: ${refNumber}`;
	const text = `Hello ${customer.name},

Here is your detailed quote proposal for your replacement engine request.

Quote Reference: ${refNumber}
Vehicle Description: ${vehicle?.vehicleDesc || "N/A"}
VRM: ${vehicle?.vrm || "N/A"}
Engine Code: ${vehicle?.engineCode || "N/A"}
Condition: ${condition || "Reconditioned"}
Warranty: ${warranty || "6 Months"}
Mileage: ${mileage || "N/A"}

Pricing Details:
- Engine Price: £${pricing?.engine || 0}
- Exchange Charge: £${pricing?.exchange || 0}
- Delivery: £${pricing?.delivery || 0}
- Recovery: £${pricing?.recovery || 0}
- Fitting: £${pricing?.fitting || 0}
- VAT: £${pricing?.vat || 0}

Total Price: £${pricing?.total || 0}

${notes ? `Additional Notes:\n${notes}\n` : ""}
If you would like to proceed with this quote, please contact our team directly at 02071129397.

Best regards,
The Engines Team
`;

	try {
		await sendEmail(customer.email, subject, text);
		console.log(`Quote email sent successfully to ${customer.email} for ref: ${refNumber}`);
	} catch (err) {
		console.error("Failed to send quote proposal email:", err);
	}
};

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

		if (quote.status === "Sent") {
			await sendQuoteProposalEmail(quote);
		}

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

		if (quote.status === "Sent") {
			await sendQuoteProposalEmail(quote);
		}

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

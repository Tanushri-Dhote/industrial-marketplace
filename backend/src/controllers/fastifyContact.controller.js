const ContactSubmission = require("../models/ContactSubmission");
const sendEmail = require("../utils/sendEmail");

const buildFilter = (request) => {
	const filter = {};

	if (request.tenantId) {
		filter.website_id = request.tenantId;
	}

	return filter;
};

exports.submitContact = async (request, reply) => {
	try {
		const { name, email, subject, message, website_id, sourcePath } = request.body || {};

		if (!name || !email || !subject || !message) {
			return reply.status(400).send({ message: "All contact fields are required" });
		}

		const resolvedWebsiteId = website_id || process.env.DEFAULT_SITE_ID;
		if (!resolvedWebsiteId) {
			return reply.status(400).send({ message: "Website context is missing" });
		}

		const submission = await ContactSubmission.create({
			name,
			email,
			subject,
			message,
			website_id: resolvedWebsiteId,
			sourcePath: sourcePath || "/contact",
			ipAddress: request.ip || "",
			userAgent: request.headers["user-agent"] || "",
		});

		// Send emails asynchronously
		try {
			const adminSubject = `New Contact Submission: ${subject}`;
			const adminText = `
You have received a new contact submission:

Name: ${name}
Email: ${email}
Subject: ${subject}
Message:
${message}
`;
			await sendEmail(process.env.EMAIL_USER, adminSubject, adminText);

			const customerSubject = `Thank you for contacting us`;
			const customerText = `
Hello ${name},

Thank you for reaching out to us. We have received your message regarding "${subject}" and our team will get back to you as soon as possible.

Here is a copy of your message:
----------------------------------------
${message}
----------------------------------------

Best regards,
The Engines Team
`;
			await sendEmail(email, customerSubject, customerText);
		} catch (emailErr) {
			console.error("Failed to send contact emails:", emailErr);
		}

		return {
			success: true,
			message: "Contact request received",
			data: submission,
		};
	} catch (err) {
		reply.status(500).send({ message: err.message });
	}
};

exports.getContacts = async (request, reply) => {
	try {
		const { status, search } = request.query || {};
		const filter = buildFilter(request);

		if (status && status !== "All") {
			filter.status = status;
		}

		if (search) {
			filter.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } },
				{ subject: { $regex: search, $options: "i" } },
				{ message: { $regex: search, $options: "i" } },
			];
		}

		const contacts = await ContactSubmission.find(filter)
			.populate("website_id", "name domain")
			.sort({ createdAt: -1 });

		return { success: true, data: contacts };
	} catch (err) {
		reply.status(500).send({ message: err.message });
	}
};

exports.getContact = async (request, reply) => {
	try {
		const { id } = request.params;
		const filter = { _id: id, ...buildFilter(request) };
		const contact = await ContactSubmission.findOne(filter).populate("website_id", "name domain");

		if (!contact) {
			return reply.status(404).send({ message: "Contact submission not found" });
		}

		return { success: true, data: contact };
	} catch (err) {
		reply.status(500).send({ message: err.message });
	}
};

exports.updateContact = async (request, reply) => {
	try {
		const { id } = request.params;
		const filter = { _id: id, ...buildFilter(request) };
		const updateData = {};

		if (request.body?.status) {
			updateData.status = request.body.status;
		}

		const contact = await ContactSubmission.findOneAndUpdate(filter, updateData, {
			new: true,
		}).populate("website_id", "name domain");

		if (!contact) {
			return reply.status(404).send({ message: "Contact submission not found" });
		}

		return { success: true, message: "Contact updated", data: contact };
	} catch (err) {
		reply.status(500).send({ message: err.message });
	}
};

exports.deleteContact = async (request, reply) => {
	try {
		const { id } = request.params;
		const filter = { _id: id, ...buildFilter(request) };
		const deleted = await ContactSubmission.findOneAndDelete(filter);

		if (!deleted) {
			return reply.status(404).send({ message: "Contact submission not found" });
		}

		return { success: true, message: "Contact deleted" };
	} catch (err) {
		reply.status(500).send({ message: err.message });
	}
};

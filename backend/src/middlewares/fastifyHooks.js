/**
 * Fastify Hooks (Middlewares)
 */

const authHook = async (request, reply) => {
	try {
		await request.jwtVerify();
	} catch (err) {
		reply.status(401).send({ message: "Unauthorized access" });
	}
};

const tenantHook = async (request, reply) => {
	try {
		if (!request.user) {
			return reply.status(401).send({ message: "Authentication required for tenant check" });
		}

		if (request.user.role === "super_admin") {
			let tenantId = request.headers["x-tenant-id"] || request.headers["x-website-id"] || request.body?.website_id || request.user.website_id;
			if (!tenantId) {
				const host = request.headers["x-forwarded-host"] || request.headers.host;
				if (host) {
					const cleanHost = host.split(":")[0].toLowerCase();
					const Website = require("../models/Website");
					let website = await Website.findOne({ domain: cleanHost });
					if (!website && cleanHost.includes("localhost")) {
						website = await Website.findOne({ status: "active" });
					} else if (!website) {
						const baseDomain = cleanHost.replace(/^(dev|www)\./, "");
						website = await Website.findOne({ domain: new RegExp(baseDomain, "i") });
					}
					if (website) {
						tenantId = website._id;
					}
				}
			}
			console.log(`[tenantHook] Resolved tenantId for super_admin: ${tenantId}`);
			request.tenantId = tenantId;
			return;
		}

		if (!request.user.website_id) {
			return reply.status(403).send({ message: "No tenant access assigned to user" });
		}

		request.tenantId = request.user.website_id;
	} catch (error) {
		reply.status(500).send({ message: error.message });
	}
};

const rolePermissions = {
	admin: {
		products: ["create", "read"],
		employees: ["create", "read"],
		leads: ["create", "read"],
		quotes: ["create", "read"],
		contacts: ["create", "read"],
		categories: ["create", "read"],
		websites: ["read"],
		blogs: ["create", "read"],
		inquiries: ["create", "read"],
		brands: ["create", "read", "update", "delete"],
		models: ["create", "read", "update", "delete"],
		"part-types": ["create", "read", "update", "delete"],
	},
	website_manager: {
		products: ["create", "read", "update", "delete"],
		employees: ["read"],
		leads: ["create", "read", "update"],
		quotes: ["create", "read", "update"],
		contacts: ["read"],
		categories: ["create", "read", "update", "delete"],
		websites: ["read"],
		blogs: ["create", "read", "update", "delete"],
		inquiries: ["create", "read", "update", "delete"],
		brands: ["create", "read", "update", "delete"],
		models: ["create", "read", "update", "delete"],
		"part-types": ["create", "read", "update", "delete"],
	},
	sales_manager: {
		products: ["read"],
		employees: ["read"],
		leads: ["create", "read", "update"],
		quotes: ["create", "read", "update"],
		contacts: ["read"],
		categories: ["read"],
		websites: ["read"],
		blogs: ["read"],
		inquiries: ["read", "update"],
		"part-types": ["read"],
	},
	viewer: {
		products: ["read"],
		employees: ["read"],
		leads: ["read"],
		quotes: ["read"],
		contacts: ["read"],
		categories: ["read"],
		websites: ["read"],
		blogs: ["read"],
		inquiries: ["read"],
		"part-types": ["read"],
	},
};

const permissionHook = (resource, action) => {
	return async (request, reply) => {
		if (!request.user || !request.user.role) {
			return reply.status(401).send({ message: "Role information missing" });
		}

		if (request.user.role === "super_admin") return;

		// Require a bound website_id for any other role
		if (!request.user.website_id) {
			return reply.status(403).send({ message: "Tenant access denied" });
		}

		const userRole = request.user.role;
		const allowedActions = rolePermissions[userRole] && rolePermissions[userRole][resource];

		if (!allowedActions || !allowedActions.includes(action)) {
			return reply.status(403).send({
				message: `Permission denied. Role '${userRole}' cannot '${action}' resource '${resource}'`,
			});
		}
	};
};

module.exports = {
	authHook,
	tenantHook,
	permissionHook,
};

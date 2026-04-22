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
			request.tenantId = null;
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

const permissionHook = (resource, action) => {
	return async (request, reply) => {
		// Simplified permission check for now
		// In a real app, you would check request.user.permissions
		if (request.user.role === "super_admin") return;
		
		// For now, allow if they have a website_id (tenant access)
		if (!request.user.website_id) {
			return reply.status(403).send({ message: "Permission denied" });
		}
	};
};

module.exports = {
	authHook,
	tenantHook,
	permissionHook,
};

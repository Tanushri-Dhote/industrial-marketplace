const fastify = require("fastify")({
	logger: {
		level: "info",
		transport: {
			target: "pino-pretty",
		},
	},
	routerOptions: {
		ignoreTrailingSlash: true,
	},
});

// Plugins
fastify.register(require("@fastify/helmet"), {
	contentSecurityPolicy: false,
});
fastify.register(require("@fastify/compress"));
fastify.register(require("@fastify/formbody"));
fastify.register(require("@fastify/cors"), {
	origin: process.env.CORS_ORIGIN || "*",
	credentials: true,
});
fastify.register(require("@fastify/jwt"), {
	secret: process.env.JWT_SECRET || "supersecret",
});

// Register Models (Mongoose)
require("./models/Category");
require("./models/Product");
require("./models/Website");
require("./models/User");
require("./models/Blog");
require("./models/Permission");
require("./models/Registration");
require("./models/Lead");
require("./models/PartType");
require("./models/Brand");
require("./models/ContactSubmission");
require("./models/Inquiry");

// Register Routes
fastify.register(require("./routes/fastify/auth.routes"), { prefix: "/api/auth" });
fastify.register(require("./routes/fastify/product.routes"), { prefix: "/api/products" });
fastify.register(require("./routes/fastify/blog.routes"), { prefix: "/api/blogs" });
fastify.register(require("./routes/fastify/employee.routes"), { prefix: "/api/employees" });
fastify.register(require("./routes/fastify/registration.routes"), { prefix: "/api" });
fastify.register(require("./routes/fastify/website.routes"), { prefix: "/api/websites" });
fastify.register(require("./routes/fastify/lead.routes"), { prefix: "/api/leads" });
fastify.register(require("./routes/fastify/contact.routes"), { prefix: "/api/contacts" });
fastify.register(require("./routes/fastify/stats.routes"), { prefix: "/api/stats" });
fastify.register(require("./routes/fastify/admin.routes"), { prefix: "/api" });
fastify.register(require("./routes/fastify/partType.routes"), { prefix: "/api/part-types" });
fastify.register(require("./routes/fastify/brand.routes"), { prefix: "/api/brands" });
fastify.register(require("./routes/fastify/inquiry.routes"), { prefix: "/api" });

// Root route
fastify.get("/", async (request, reply) => {
	return { message: "Fastify API is running..." };
});

// Global Error Handler
fastify.setErrorHandler((error, request, reply) => {
	fastify.log.error(error);
	console.error(error);
	reply.status(error.statusCode || 500).send({
		message: error.message || "Internal Server Error",
		error: process.env.NODE_ENV === "development" ? error.stack : undefined,
	});
});

module.exports = fastify;

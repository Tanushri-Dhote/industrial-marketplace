const fastify = require("fastify")({
	logger: process.env.NODE_ENV === "development" ? {
		level: "info",
		transport: {
			target: "pino-pretty",
		},
	} : true,
});
const path = require("path");

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

// Register Routes
fastify.register(require("./routes/fastify/auth.routes"), { prefix: "/api/auth" });
fastify.register(require("./routes/fastify/product.routes"), { prefix: "/api/products" });
fastify.register(require("./routes/fastify/blog.routes"), { prefix: "/api/blogs" });
fastify.register(require("./routes/fastify/employee.routes"), { prefix: "/api/employees" });

// Root route
fastify.get("/", async (request, reply) => {
	return { message: "Fastify API is running..." };
});

// Global Error Handler
fastify.setErrorHandler((error, request, reply) => {
	fastify.log.error(error);
	reply.status(error.statusCode || 500).send({
		message: error.message || "Internal Server Error",
		error: process.env.NODE_ENV === "development" ? error.stack : undefined,
	});
});

module.exports = fastify;

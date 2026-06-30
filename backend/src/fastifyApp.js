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
	methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
	allowedHeaders: ["Content-Type", "Authorization", "x-tenant-id", "Accept", "Origin", "X-Requested-With"],
	credentials: true,
});
fastify.register(require("@fastify/jwt"), {
	secret: process.env.JWT_SECRET || "supersecret",
});
fastify.register(require("@fastify/multipart"), {
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB limit
	},
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
require("./models/Model");
require("./models/Quote");

// Log all requests for debugging CORS/Network issues
fastify.addHook("onRequest", async (request, reply) => {
	fastify.log.info({
		method: request.method,
		url: request.url,
		headers: request.headers,
	}, "Incoming Request");
});

// Register Routes
fastify.register(require("./routes/fastify/admin.routes"), { prefix: "/api" });
fastify.register(require("./routes/fastify/upload.routes"), { prefix: "/api/upload" });
fastify.register(require("./routes/fastify/auth.routes"), { prefix: "/api/auth" });
fastify.register(require("./routes/fastify/blog.routes"), { prefix: "/api/blogs" });
fastify.register(require("./routes/fastify/brand.routes"), { prefix: "/api/brands" });
fastify.register(require("./routes/fastify/contact.routes"), { prefix: "/api/contacts" });
fastify.register(require("./routes/fastify/employee.routes"), { prefix: "/api/employees" });
fastify.register(require("./routes/fastify/filterRoutes"), { prefix: "/api" });
fastify.register(require("./routes/fastify/inquiry.routes"), { prefix: "/api" });
fastify.register(require("./routes/fastify/lead.routes"), { prefix: "/api/leads" });
fastify.register(require("./routes/fastify/model.routes"), { prefix: "/api/models" });
fastify.register(require("./routes/fastify/partType.routes"), { prefix: "/api/part-types" });
fastify.register(require("./routes/fastify/product.routes"), { prefix: "/api/products" });
fastify.register(require("./routes/fastify/quote.routes"), { prefix: "/api/quotes" });
fastify.register(require("./routes/fastify/registration.routes"), { prefix: "/api" });
fastify.register(require("./routes/fastify/stats.routes"), { prefix: "/api/stats" });
fastify.register(require("./routes/fastify/website.routes"), { prefix: "/api/websites" });
fastify.register(require("./routes/fastify/year.routes"), { prefix: "/api" });

// Root route
fastify.get("/", async (request, reply) => {
	return { message: "Fastify API is running..." };
});

// Global Error Handler
fastify.setErrorHandler((error, request, reply) => {
	fastify.log.error(error);
	console.error(error);

	// Ensure CORS headers are present even on error
	reply.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
	reply.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	reply.header("Access-Control-Allow-Credentials", "true");

	reply.status(error.statusCode || 500).send({
		success: false,
		message: error.message || "Internal Server Error",
		error: process.env.NODE_ENV === "development" ? error.stack : undefined,
	});
});

module.exports = fastify;

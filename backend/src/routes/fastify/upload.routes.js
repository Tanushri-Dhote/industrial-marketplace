const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream/promises");

async function uploadRoutes(fastify, options) {
	// POST /api/upload
	fastify.post("/", async (request, reply) => {
		try {
			const data = await request.file();
			if (!data) {
				return reply.code(400).send({ message: "No file uploaded" });
			}

			// Generate a unique filename
			const ext = path.extname(data.filename) || ".png";
			const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
			
			// Resolve frontend/public/uploads path
			const uploadDir = path.resolve(__dirname, "../../../../frontend/public/uploads");
			
			// Ensure uploads directory exists
			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir, { recursive: true });
			}

			const saveTo = path.join(uploadDir, filename);
			await pipeline(data.file, fs.createWriteStream(saveTo));

			return {
				success: true,
				url: `/uploads/${filename}`,
			};
		} catch (err) {
			return reply.code(500).send({ message: err.message });
		}
	});
}

module.exports = uploadRoutes;

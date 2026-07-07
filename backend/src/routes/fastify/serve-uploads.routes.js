const fs = require("fs");
const path = require("path");

async function serveUploadsRoutes(fastify, options) {
	fastify.get("/:filename", async (request, reply) => {
		const { filename } = request.params;
		
		// Paths to check
		const newUploadDir = path.resolve(__dirname, "../../../uploads");
		const legacyUploadDir = path.resolve(__dirname, "../../../../frontend/public/uploads");
		
		const newFilePath = path.join(newUploadDir, filename);
		const legacyFilePath = path.join(legacyUploadDir, filename);

		let filePath = null;

		// Prevent directory traversal attacks and resolve file path
		if (newFilePath.startsWith(newUploadDir) && fs.existsSync(newFilePath)) {
			filePath = newFilePath;
		} else if (legacyFilePath.startsWith(legacyUploadDir) && fs.existsSync(legacyFilePath)) {
			filePath = legacyFilePath;
		}

		try {
			if (!filePath) {
				return reply.code(404).send({ message: "File not found" });
			}

			const ext = path.extname(filename).toLowerCase();
			let contentType = "application/octet-stream";
			if (ext === ".png") contentType = "image/png";
			else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
			else if (ext === ".gif") contentType = "image/gif";
			else if (ext === ".webp") contentType = "image/webp";
			else if (ext === ".svg") contentType = "image/svg+xml";

			reply.header("Content-Type", contentType);
			reply.header("Cache-Control", "public, max-age=31536000, immutable");
			
			return fs.createReadStream(filePath);
		} catch (err) {
			return reply.code(500).send({ message: err.message });
		}
	});
}

module.exports = serveUploadsRoutes;

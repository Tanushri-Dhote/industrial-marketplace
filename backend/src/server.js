require("dotenv").config();
const fastify = require("./fastifyApp");
const connectDB = require("./config/db");

// connect database
connectDB();

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`🚀 Fastify Server running on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
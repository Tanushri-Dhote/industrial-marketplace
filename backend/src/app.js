const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// 🔥 ADD THIS (import routes)
const authRoutes = require("./routes/auth.routes");

// 🔥 ADD THIS (use routes)
app.use("/api/auth", authRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
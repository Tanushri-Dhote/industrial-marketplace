const express = require("express");
const router = express.Router();
const controller = require("../controllers/blog.controller");

// Public routes for blog
router.get("/", controller.getBlogs);
router.get("/:slug", controller.getBlogBySlug);

module.exports = router;

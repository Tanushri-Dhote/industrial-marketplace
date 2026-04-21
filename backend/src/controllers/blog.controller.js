const Blog = require("../models/Blog");

// ================= GET ALL BLOGS =================
exports.getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 6, category } = req.query;
    const filter = { isPublished: true };

    if (category) {
      filter.category = category;
    }

    const blogs = await Blog.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Blog.countDocuments(filter);

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET BLOG BY SLUG =================
exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug, isPublished: true });

    if (!blog) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(blog);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBlogs: exports.getBlogs,
  getBlogBySlug: exports.getBlogBySlug,
};

const Blog = require("../models/Blog");

exports.getBlogs = async (request, reply) => {
	try {
		const { page = 1, limit = 6, category } = request.query;
		const filter = { isPublished: true };
		if (category) filter.category = category;
		const blogs = await Blog.find(filter)
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await Blog.countDocuments(filter);
		return { blogs, totalPages: Math.ceil(total / limit), currentPage: parseInt(page) };
	} catch (error) {
		reply.status(500).send({ message: error.message });
	}
};

exports.getBlogBySlug = async (request, reply) => {
	try {
		const { slug } = request.params;
		const blog = await Blog.findOne({ slug, isPublished: true });
		if (!blog) return reply.status(404).send({ message: "Article not found" });
		return blog;
	} catch (error) {
		reply.status(500).send({ message: error.message });
	}
};

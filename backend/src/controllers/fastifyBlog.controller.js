const Blog = require("../models/Blog");

exports.getBlogs = async (request, reply) => {
  try {
    const { search, category, status, page = 1, limit = 10 } = request.query;
    let filter = {};

    // Multi-tenant filter
    if (request.tenantId) {
      filter.website_id = request.tenantId;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }
    if (category && category !== "All") {
      filter.category = category;
    }
    if (status && status !== "All") {
      filter.isPublished = status === "Published";
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return { 
      success: true, 
      data: blogs, // For dashboard consistency
      blogs: blogs, // For BlogPage compatibility
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    };
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

exports.getBlogBySlug = async (request, reply) => {
  try {
    const { slug } = request.params;
    const blog = await Blog.findOne({ slug });
    if (!blog) return reply.status(404).send({ message: "Article not found" });
    return { success: true, data: blog };
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

exports.createBlog = async (request, reply) => {
  try {
    const { title, content, excerpt, category, image, isPublished } = request.body;
    
    // Generate slug if not provided
    const slug = request.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const blog = await Blog.create({
      title,
      slug,
      content,
      excerpt,
      category,
      image,
      isPublished: isPublished !== undefined ? isPublished : true,
      website_id: request.tenantId,
      createdBy: request.user.id,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    });

    return reply.status(201).send({ success: true, data: blog });
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

exports.updateBlog = async (request, reply) => {
  try {
    const { id } = request.params;
    const blog = await Blog.findOneAndUpdate(
      { _id: id, website_id: request.tenantId },
      request.body,
      { new: true }
    );
    if (!blog) return reply.status(404).send({ message: "Blog not found" });
    return { success: true, data: blog };
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

exports.deleteBlog = async (request, reply) => {
  try {
    const { id } = request.params;
    const blog = await Blog.findOneAndDelete({ _id: id, website_id: request.tenantId });
    if (!blog) return reply.status(404).send({ message: "Blog not found" });
    return { success: true, message: "Blog deleted" };
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

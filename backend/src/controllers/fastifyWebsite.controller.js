const Website = require("../models/Website");
const User = require("../models/User");

// GET ALL WEBSITES
exports.getWebsites = async (request, reply) => {
  try {
    const { search, status } = request.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { domain: { $regex: search, $options: "i" } },
      ];
    }
    if (status && status !== "all") {
      filter.status = status;
    }

    const websites = await Website.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    // Attach user count to each website
    const websitesWithCount = await Promise.all(
      websites.map(async (site) => {
        const userCount = await User.countDocuments({ website_id: site._id });
        return { ...site.toObject(), userCount };
      })
    );

    return { success: true, data: websitesWithCount };
  } catch (err) {
    reply.status(500).send({ message: err.message });
  }
};

// GET SINGLE WEBSITE (public — used by register page to show site name)
exports.getWebsite = async (request, reply) => {
  try {
    const { id } = request.params;
    const website = await Website.findById(id).populate("owner", "name email");
    if (!website) return reply.status(404).send({ message: "Website not found" });
    return { success: true, data: website };
  } catch (err) {
    reply.status(500).send({ message: err.message });
  }
};

// CREATE WEBSITE (SuperAdmin only)
exports.createWebsite = async (request, reply) => {
  try {
    const { name, domain, description, status } = request.body;
    if (!name) return reply.status(400).send({ message: "Website name is required" });

    const existing = await Website.findOne({ domain });
    if (domain && existing)
      return reply.status(409).send({ message: "A website with this domain already exists" });

    const website = await Website.create({
      name,
      domain: domain || "",
      description: description || "",
      status: status || "active",
      owner: request.user.id,
    });

    return reply.status(201).send({ success: true, data: website });
  } catch (err) {
    reply.status(500).send({ message: err.message });
  }
};

// UPDATE WEBSITE (SuperAdmin only)
exports.updateWebsite = async (request, reply) => {
  try {
    const { id } = request.params;
    const { name, domain, description, status, owner } = request.body;

    const website = await Website.findByIdAndUpdate(
      id,
      { name, domain, description, status, owner },
      { new: true }
    ).populate("owner", "name email");

    if (!website) return reply.status(404).send({ message: "Website not found" });

    return { success: true, data: website };
  } catch (err) {
    reply.status(500).send({ message: err.message });
  }
};

// DELETE WEBSITE (SuperAdmin only)
exports.deleteWebsite = async (request, reply) => {
  try {
    const { id } = request.params;

    // Check if any users are still assigned to this site
    const userCount = await User.countDocuments({ website_id: id });
    if (userCount > 0) {
      return reply.status(400).send({
        message: `Cannot delete: ${userCount} user(s) are still assigned to this website. Reassign them first.`,
      });
    }

    await Website.findByIdAndDelete(id);
    return { success: true, message: "Website deleted" };
  } catch (err) {
    reply.status(500).send({ message: err.message });
  }
};

// GET USERS FOR A WEBSITE
exports.getWebsiteUsers = async (request, reply) => {
  try {
    const { id } = request.params;
    const users = await User.find({ website_id: id }).select("-password");
    return { success: true, data: users };
  } catch (err) {
    reply.status(500).send({ message: err.message });
  }
};

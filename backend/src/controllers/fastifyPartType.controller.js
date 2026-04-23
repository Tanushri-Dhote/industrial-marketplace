const PartType = require("../models/PartType");

// Helper (no dependency needed)
const generateSlug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// ================= CREATE =================
exports.createPartType = async (req, reply) => {
  try {
    const { name, description } = req.body;

    if (!name || typeof name !== "string") {
      return reply.code(400).send({ message: "Name is required" });
    }

    const slug = generateSlug(name);

    const exists = await PartType.findOne({ slug });
    if (exists) {
      return reply.code(400).send({ message: "Part type already exists" });
    }

    const data = await PartType.create({
      name,
      slug,
      description,
    });

    reply.code(201).send(data);
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};

// ================= GET ALL =================
exports.getPartTypes = async (req, reply) => {
  try {
    const data = await PartType.find().lean();

    console.log("PartTypes:", data); // 🔍 debug

    return reply.code(200).send(data); // ✅ IMPORTANT return
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: error.message });
  }
};

// ================= GET SINGLE =================
exports.getPartTypeById = async (req, reply) => {
  try {
    const data = await PartType.findById(req.params.id);

    if (!data) {
      return reply.code(404).send({ message: "Not found" });
    }

    reply.send(data);
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
};

// ================= UPDATE =================
exports.updatePartType = async (req, reply) => {
  try {
    const { name } = req.body;

    let updateData = { ...req.body };

    if (name) {
      updateData.slug = generateSlug(name);
    }

    const updated = await PartType.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return reply.code(404).send({ message: "Not found" });
    }

    reply.send(updated);
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
};

// ================= DELETE =================
exports.deletePartType = async (req, reply) => {
  try {
    const deleted = await PartType.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return reply.code(404).send({ message: "Not found" });
    }

    reply.send({ message: "Deleted successfully" });
  } catch (error) {
    reply.code(500).send({ error: error.message });
  }
};
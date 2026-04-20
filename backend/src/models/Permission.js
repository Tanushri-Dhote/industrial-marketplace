const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  role: String,
  module: String,
  actions: [String],
});

module.exports = mongoose.model("Permission", permissionSchema);
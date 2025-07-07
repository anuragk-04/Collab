const mongoose = require("mongoose");

const EditorContentSchema = new mongoose.Schema({
  roomId: String,
  code: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EditorContent", EditorContentSchema);

const mongoose = require('mongoose');

const boardContentSchema = new mongoose.Schema({
    roomId: mongoose.Schema.Types.ObjectId,
    boardElements: [mongoose.Schema.Types.Mixed]
})

module.exports = mongoose.model("BoardContent", boardContentSchema);

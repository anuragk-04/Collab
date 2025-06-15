const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomTitle: {
        type: String,
        required: [true, "room title is required"],
    },
    roomDescription: {
        type: String,
        required: [true, "room description is required"],
    },
    members: [{
        memberId: mongoose.Schema.Types.ObjectId,
        memberRole: {
            type: String,
            enum: ['OWNER', 'EDITOR', 'VIEWER']
        },
        lastAccessedAt: Date
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Room", roomSchema);
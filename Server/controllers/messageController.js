const Message = require("../models/messageModel");

module.exports.getRoomMessages = async (req, res, next) => {
    try {
        const roomId = String(req.params.roomId); // Convert to string explicitly
        console.log(`Fetching messages for roomId: ${roomId}`);
        
        let messages = await Message.find({ roomId });

        if (!messages.length) {
            console.log('No messages found for this room.');
            messages=[];
        }

        console.log(`Messages retrieved successfully: ${messages.length} messages`);
        return res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching room messages:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

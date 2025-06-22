const mongoose = require('mongoose');
const BoardContent = require("./../models/boardContentModel");

module.exports.addElementsToBoard = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const { boardElements } = req.body;

        console.log(`addElementsToBoard called with ${roomId} and ${boardElements}`);

        const boardContent = await BoardContent.findOne({ roomId: new mongoose.Types.ObjectId(roomId) });

        if (!boardContent) {
            return res.status(404).json({ "error": "BoardContent not found" });
        }

        boardContent.boardElements = boardElements;
        const updatedBoardContent = await boardContent.save();

        return res.status(200).json({
            "message": "boardElements updated successfully!!",
            updatedBoardContent
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            "error": "Something went wrong!!!"
        });
    }
}

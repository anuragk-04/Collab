const BoardContent = require('./../models/boardContentModel');

/*
    function to check if board exists with given roomId
*/
const doesBoardExist = async (roomId) => {
    try {
        const board = await BoardContent.findOne({ roomId });
        return !!board; // Convert the board object to a boolean value
    } catch (error) {
        throw new Error('Error checking if board exists: ' + error.message);
    }
};


/*
    function to create new board with empty content
*/
const createNewBoard = async (roomId, boardElements) => {
    try {
        const newBoardContent = new BoardContent({ roomId, boardElements });
        const savedBoardContent = await newBoardContent.save();
        return savedBoardContent;
    } catch (error) {
        throw new Error('Error creating board content: ' + error.message);
    }
};

/*
  function to get board content by roomId
*/
const getBoardContentById = async (roomId) => {
    try {
        const boardContent = await BoardContent.findOne({ roomId });
        return boardContent;
    } catch (error) {
        throw new Error('Error getting board content by ID: ' + error.message);
    }
};

module.exports = {
    createNewBoard,
    getBoardContentById,
    doesBoardExist
};

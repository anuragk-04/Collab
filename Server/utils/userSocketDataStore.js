const { doesBoardExist, getBoardContentById, createNewBoard } = require("../handler/boardDataHandler");

const userSessions = new Map();
const userBoards = new Map();
const boardUserMapping = new Map();
const boards = new Map();

const addUserSession = (userId, roomId, socketId) => {
    console.log(`addUserSession called with userId: ${userId} and socketId: ${socketId}`);
    userSessions.set(userId, socketId);
    userBoards.set(userId, roomId);
    console.log(userSessions);
};

const mapUserToBoard = (userId, roomId) => {
    console.log(`mapUserToBoard called with userId: ${userId} and boardId: ${roomId}`);
    if (!boardUserMapping.has(roomId)) {
        boardUserMapping.set(roomId, [userId]);
    } else {
        let boardMappedUsers = boardUserMapping.get(roomId);
        if (!boardMappedUsers.includes(userId)) {
            boardMappedUsers.push(userId);
            boardUserMapping.set(roomId, boardMappedUsers);
        }
    }
    console.log(boardUserMapping);
};

const getBoardElementDataElseIfRequireCreateNewBoard = async (roomId) => {
    console.log(`getBoardElementDataAndUpdateIfRequire called with ${roomId}`);
    if (boards.has(roomId)) {
        console.log(`boardId exists in cache`);
        console.log(boards);
        return boards.get(roomId);
    } else {
        console.log(`boardId not there in cache`);
        let boardContent = [];
        if (await doesBoardExist(roomId)) {
            console.log(`boardId available in database`);
            boardContent = await getBoardContentById(roomId);
            console.log(boardContent);
        } else {
            console.log(`boardId not available in database`);
            boardContent = await createNewBoard(roomId, []);
        }
        boards.set(roomId, boardContent['boardElements']);
        console.log(boards);
        return boards.get(roomId);
    }
};

const removeUserDisconnectData = (socketId, userId, roomId) => {
    console.log(`removeUserDisconnectData called with socketID: ${socketId}, userId: ${userId}, boardId: ${roomId}`);
    if (userId !== null) {
        let boardMappedUsers = boardUserMapping.get(roomId);
        console.log(`boardMappedUsers for roomID : ${boardMappedUsers}`);
        if (boardMappedUsers.includes(userId)) {
            let _boardMappedUsers = boardMappedUsers.filter((user_id) => user_id !== userId);
            console.log(`_boardMappedUsers : ${_boardMappedUsers}`);
            boardUserMapping.set(roomId, _boardMappedUsers);
        }

        userBoards.delete(userId);
        userSessions.delete(userId);
    }
};

const getBoardIdAndUserIdForSocketId = async (socketId) => {
    let userId = null;
    for (let [key, value] of userSessions.entries()) {
        if (value === socketId) {
            userId = key;
            break;
        }
    }
    console.log(`userID found : ${userId}`);
    return [userBoards.get(userId), userId];
};

const getBoardElementByBoardId = async (roomId) => {
    if(boards.has(roomId)){
        return boards.get(roomId);
    }else{
        console.log(`board with boardId: ${roomId} not exists in cache`);
        return null;
    }
}

const updateBoardElementWithBoardId = async (roomId, boardElements) => {
    boards.set(roomId, boardElements);
}

const setWhiteBoardClearWithBoardId = async (roomId) => {
    boards.set(roomId, []);

    // need to see to update in database in future
}

const getSocketIdFromUserId = (userId) => {
    return userSessions.get(userId);
}

const getCachedBoardContents = () => {
    return boards;
}

module.exports = {
    addUserSession,
    mapUserToBoard,
    getBoardElementDataElseIfRequireCreateNewBoard,
    removeUserDisconnectData,
    getBoardIdAndUserIdForSocketId,
    getBoardElementByBoardId,
    updateBoardElementWithBoardId,
    setWhiteBoardClearWithBoardId,
    getSocketIdFromUserId,
    getCachedBoardContents
};

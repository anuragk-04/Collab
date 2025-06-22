const { addUserSession, mapUserToBoard, getBoardElementDataElseIfRequireCreateNewBoard, removeUserDisconnectData, getBoardIdAndUserIdForSocketId, getBoardElementByBoardId, updateBoardElementWithBoardId, setWhiteBoardClearWithBoardId, getSocketIdFromUserId } = require("../utils/userSocketDataStore");
const User = require("./../models/userModel");

const userConnectHandler = async (io, socket, userId, roomId) => {
    console.log(`userConnectHandler called with ${userId}, ${roomId}`);
    
    // add socket_id with userId in userSessions map to maintain the data
    addUserSession(userId, roomId, socket.id)

    // add userId into room with roomId, if room not exists with roomId please create else join the same room
    socket.join(roomId)

    // update boardUserMapping map with roomId and userId to maintain the data
    mapUserToBoard(userId, roomId)

    // get boardElements from boards map if available else get elements data from DB and update boards map data and process with below notification
    let boardElements = await getBoardElementDataElseIfRequireCreateNewBoard(roomId);
    console.log(`board data: ${boardElements}`);

    // publish BOARD_ELEMENTS event with boardID and boardElements to connected user socket id - to provide initial board elements on the client
    io.to(socket.id).emit('BOARD_ELEMENTS', JSON.stringify(boardElements))

    // publish USER_BOARD_JOINED event with boardID and userId to the room with roomId - to provide user connected info to the other subscribed users.
    const user = await User.findById({_id: userId})
    io.to(roomId).except(socket.id).emit('USER_BOARD_JOINED', {roomId, user})
}

const userDisconnectHandler = async (io, socketId) => {
    console.log(`userDisconnectHandler called with ${socketId}`);

    let [roomId, userId] = await getBoardIdAndUserIdForSocketId(socketId);
    console.log(`boardID: ${roomId}, userId: ${userId} for socketId : ${socketId}`);

    // remove socket_id from userSessions map & update boardUserMapping to remove user from map users list
    removeUserDisconnectData(socketId, userId, roomId);

    // publish USER_BOARD_LEAVE event with boardID and userId to the room with roomId - to provide user disconnected info to the other subscribed users.
    const user = await User.findById({_id: userId})
    io.to(roomId).except(socketId).emit('USER_BOARD_LEAVE', {roomId, user})
}

const elementUpdateHandler = async (io, socket, eventData) => {
    // get roomId and boardElements from eventData
    const {roomId, boardElements } = eventData;
    // console.log(`elementUpdateHandler called with ${roomId} & ${boardElements}`);
    
    // get board elements from cache
    let boardElementsData = await getBoardElementByBoardId(roomId)
    // console.log(boardElementsData);

    // update element data on cache
    const index = boardElementsData.findIndex((element) => element.id === boardElements.id);
    if (index === -1) return boardElementsData.push(boardElements);

    boardElementsData[index] = boardElements;
    await updateBoardElementWithBoardId(roomId, boardElementsData);

    // emit ELEMENT-UPDATE to the room with roomId
    io.to(roomId).emit('ELEMENT-UPDATE', {roomId, boardElements})
}

const whiteboardClearHandler = async (io, roomId) => {
    console.log(`whiteboardClearHandler called with roomId: ${roomId}`);

    await setWhiteBoardClearWithBoardId(roomId);

    // trigger WHITEBOARD-CLEAR event for roomId room
    io.to(roomId).emit('WHITEBOARD-CLEAR')
}

const cursorPositionHandler = async (io, socket, eventData) => {
    console.log(`cursorPositionHandler called with ${eventData}`);

    const {x, y, userId, roomId, username} = eventData;

    // get the socket Id of user
    const socketId = getSocketIdFromUserId(userId);

    // publish event to the room with roomId except user's socketId
    io.to(roomId).except(socketId).emit("CURSOR-POSITION", {
        x,
        y,
        username,
        userId
    })
}

module.exports = {
    userConnectHandler, userDisconnectHandler, elementUpdateHandler, whiteboardClearHandler, cursorPositionHandler
};
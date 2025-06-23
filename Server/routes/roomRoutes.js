const { createRoom, assignUserToRoom, getRoomDetails, removeUserFromRoom, getRoomsForUser, deleteRoomById, createRoomWithMembers } = require("../controllers/roomController")
const { addElementsToBoard } = require('../controllers/boardElementController')
const { getRoomMessages } = require('../controllers/messageController')

const router = require("express").Router();


router.post('/createRoom', createRoom);


router.post('/createRoomWithMembers', createRoomWithMembers);


router.post('/assignUser', assignUserToRoom);


router.post('/removeUser', removeUserFromRoom);



router.get('/:roomId', getRoomDetails);


router.delete('/:roomId', deleteRoomById);


router.get('/getRoomsForUser/:userId', getRoomsForUser);


router.post('/addElementsToBoard/:roomId', addElementsToBoard);


router.get("/:roomId/messages", getRoomMessages);


// API for board element update via HTTP path with boardId
// router.post('/addElementsToBoard/:boardId', addElementsToBoard);

// TODO: update board API - future once required

module.exports = router;
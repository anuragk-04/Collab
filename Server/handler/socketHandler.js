const { Server } = require("socket.io");
const { addUserSession } = require("../utils/userSocketDataStore");
const { userConnectHandler, userDisconnectHandler, elementUpdateHandler, whiteboardClearHandler, cursorPositionHandler } = require("./socketEventHandler");
const Message = require("./../models/messageModel");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;
    const roomId = socket.handshake.query.roomId;
    console.log("Connection query params:", socket.handshake.query);
    console.log(`connect user called with User ID: ${userId}, roomId: ${roomId}`);

    await userConnectHandler(io, socket, userId, roomId)


    socket.on("disconnect", async () => {
      await userDisconnectHandler(io, socket.id);
    });

    socket.on("JOIN-CHAT", ({ user, roomId }) => {
      socket.join(roomId);
      console.log(`${user} joined chat room ${roomId}`);
      io.to(roomId).emit("CHAT-MESSAGE", { user: "Admin", text: `${user} has joined the chat!` });
    });
    // Chat: Send Message
    socket.on("SEND-MESSAGE",async ( {roomId, message} ) => {
      console.log(`Message from ${message.user} in ${roomId}: ${message.text}`);
      io.to(roomId).emit("CHAT-MESSAGE", message);
      const newMessage=new Message({
        roomId,
        text:message.text,
        user:message.user
      })
      await newMessage.save();
    });

    socket.on("JOIN-EDITOR", ({ user, roomId }) => {
      socket.join(roomId);
      console.log(`${user} joined EDITOR room ${roomId}`);
      socket.to(roomId).emit("JOINED_EDITOR", {
                user,
                socketId: socket.id,
            });
    });

    socket.on("CODE_CHANGE", ({ roomId, code }) => {
        socket.in(roomId).emit("CODE_CHANGE", { code });
    });

    socket.on("SYNC_CODE", ({code, socketId}) => {
      console.log("SYNC CODE")
        io.to(socketId).emit("CODE_CHANGE", { code });
    });

    // event for board element update / new element creation
    socket.on("ELEMENT-UPDATE", async (eventData) => {
      console.log(`ELEMENT-UPDATE called `);
      // console.log(eventData);
      await elementUpdateHandler(io, socket, eventData);
    });

    // event for board clean event
    socket.on("WHITEBOARD-CLEAR", async (roomId) => {
      console.log(`whiteboard clear event called with roomId: ${roomId}`);
      await whiteboardClearHandler(io, roomId);
    });

    // event for user cursor position change
    socket.on("CURSOR-POSITION", async (eventData) => {
      await cursorPositionHandler(io, socket, eventData);
    });

  });
};

module.exports = {
  initSocket,
};

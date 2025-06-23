import {io} from 'socket.io-client'
import { store } from '../store/store';
import { addActiveUserToBoard, removeActiveUserFromBoard, setElements, updateElement } from '../components/whiteboard/WhiteboardSlice';
import { removeCursorPosition, updateCursorPosition } from '../components/cursorOverlay/CursorSlice';

let socket;

    export const connectWithSocketServer = (boardId) => {
    return new Promise((resolve, reject) => {
        const userId = localStorage.getItem('userId');

        if (!userId || !boardId) {
            reject('Missing userId or boardId');
            return;
        }

        console.log(`userid:${userId} roomid:${boardId}`);

        // Create a new socket connection
        socket = io('http://localhost:5002', {
            query: {
                userId,
                boardId,
            },
        });

        // Set a timeout for the connection
        const timeout = setTimeout(() => {
            reject('Socket connection timed out');
        }, 5000); // 5 seconds

        socket.on('connect', () => {
            clearTimeout(timeout);
            console.log('Connected to socket io server');
            resolve();
        });

        socket.on('connect_error', (error) => {
            clearTimeout(timeout);
            reject(error);
        });

        // Clean up previous listeners
        socket.off('BOARD_ELEMENTS');
        socket.off('USER_BOARD_JOINED');
        socket.off('USER_BOARD_LEAVE');
        socket.off('ELEMENT-UPDATE');
        socket.off('WHITEBOARD-CLEAR');
        socket.off('CURSOR-POSITION');

        // Attach event listeners
        socket.on('BOARD_ELEMENTS', (element_data) => {
            console.log(`BOARD_ELEMENTS : ${element_data}`);
            store.dispatch(setElements(JSON.parse(element_data)));
        });

        socket.on('USER_BOARD_JOINED', (event_data) => {
            console.log('USER_BOARD_JOINED');
            store.dispatch(addActiveUserToBoard(event_data.user));
        });

        socket.on('USER_BOARD_LEAVE', (event_data) => {
            console.log('USER_BOARD_LEAVE');
            store.dispatch(removeActiveUserFromBoard(event_data.user));
            store.dispatch(removeCursorPosition(event_data.user._id));
        });

        socket.on('ELEMENT-UPDATE', (eventData) => {
            const { boardElements } = eventData;
            store.dispatch(updateElement(boardElements));
        });

        socket.on('WHITEBOARD-CLEAR', () => {
            console.log('WHITEBOARD-CLEAR received');
            store.dispatch(setElements([]));
        });

        socket.on('CURSOR-POSITION', (cursorData) => {
            store.dispatch(updateCursorPosition(cursorData));
        });
    });
};



    export const sendMessageToServer = (message, roomId) => {
    if (socket) {
        console.log(`user:${message.user}`)
        socket.emit("SEND-MESSAGE", {message,roomId});
    }
    };

    export const subscribeToChatMessages = (callback) => {
    if (socket) {
         // Remove any existing listeners for "CHAT-MESSAGE"
        socket.off("CHAT-MESSAGE");
        socket.on("CHAT-MESSAGE", (message) => {
        callback(message);
        });
    }
    };

  export const joinChat = (userName, roomId) => {
  if (socket) {
    console.log(`roomId:${roomId}`)
    socket.emit("JOIN-CHAT", { user: userName, roomId }, (response) => {
      if (response.error) {
        console.error("Error joining chat room:", response.error);
        return;
      }
      console.log("Chat room joined successfully:", response.success);
    });
  }
  else{
    console.log('No socket at join chat')
  }
};

export const emitElementUpdate = (elementData) => {
    const eventData = {
        "boardId": localStorage.getItem('boardId'),
        "boardElements": elementData 
    }
    socket.emit("ELEMENT-UPDATE", eventData);
}

export const emitClearWhiteboard = () => {
    const boardId = localStorage.getItem('boardId');
    socket.emit("WHITEBOARD-CLEAR", boardId);
}

export const emitCursorPosition = (cursorData) => {
    const {x, y} = cursorData;
    const eventData = {
        x,
        y,
        username: localStorage.getItem('username'),
        boardId: localStorage.getItem('boardId'),
        userId: localStorage.getItem('userId')
    }
    socket.emit("CURSOR-POSITION", eventData)
}

export const unsubscribeFromChatMessages = (callback) => {
    if (socket) {
        socket.off("CHAT-MESSAGE", callback);
    }
};


export const disconnectSocketConnection = () => {
    console.log(`disconnect socket connection called!!!`);
    socket.disconnect();
}
import {React, useState, useEffect } from "react";
import io from "socket.io-client";
import Messages from "./Messages";
import InfoBar from "./InfoBar";
import Input from "./Input";
// import './ChatApp.css'
import {sendMessageToServer, joinChat, subscribeToChatMessages, unsubscribeFromChatMessages } from "../../socketConn/socketConn";
import { fetchMessagesForRoom } from "../../services/apiService";
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';


const ChatApp = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState("");
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchDataAndSetup = async () => {
        try {
            const userName = localStorage.getItem("username");
            const room = localStorage.getItem("roomId");
            console.log(`room called with roomId: ${room}`);

            // Fetch previous messages
            const prevMessages = await fetchMessagesForRoom(room);
            setMessages(prevMessages);
            console.log(messages);
            // Join the chat room
            joinChat(userName, room);

            // Subscribe to chat messages
            const chatListener = (newMessage) => {
                console.log(newMessage);
                setMessages((prev) => [...prev, newMessage]);
            };
            subscribeToChatMessages(chatListener);

            // Set user and room info
            setUser(userName);
            setRoomId(room);

            console.log('Messages fetched:', prevMessages);
        } catch (error) {
            console.error("Error in useEffect:", error);
        }
    };

    fetchDataAndSetup();

    // Cleanup function to unsubscribe listeners
    return () => {
        console.log("Cleaning up chat listeners");
        unsubscribeFromChatMessages(); // Ensure you have this function defined
    };
}, [setMessages, setUser, setRoomId]); // Include necessary dependencies



  const sendMessage = (event) => {
    event.preventDefault();
    console.log('clicked');
    console.log(message);
    if(message.trim()){
        sendMessageToServer({text:message, user}, roomId);
        setMessage("");
    }
  };

  return (
    
  <Box
  sx={{
    width: '100%', // Make it responsive
    maxWidth: 400, // Optional: Limit max width
    height: '93vh', // Full height
    borderRadius: 2, // Slightly more rounded
    bgcolor: 'primary.main',
    display: 'flex', // Flexbox for layout
    marginTop:7,
    flexDirection: 'column', // Stack children vertically
    overflow: 'hidden', // Prevent overflow
    '&:hover': {
      bgcolor: 'primary.dark',
    },
  }}
>
  <Box sx={{ flexShrink: 0 }}>
    <InfoBar />
  </Box>

  <Box
    sx={{
      flexGrow: 1,
      overflowY: 'auto', // Scrollable messages area
    }}
    bgcolor={'white'}
  >
    <Messages messages={messages} user={user} />
  </Box>

  <Box
    sx={{
      flexShrink: 0,
      borderTop: 1, // Optional: Add a border for separation
      borderColor: 'divider', // Material-UI theme color
      padding: 1,
    }}
  >
    <Input
      message={message}
      setMessage={setMessage}
      sendMessage={sendMessage}
    />
  </Box>
</Box>

    
  );
};

export default ChatApp;

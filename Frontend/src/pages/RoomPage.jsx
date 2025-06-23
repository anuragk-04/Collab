import { useParams } from "react-router-dom";
import {React, useEffect, useState} from 'react';
import RoomNavbar from "../components/RoomNavbar";
import Whiteboard from "./../components/whiteboard/Whiteboard";
import CursorOverlay from "./../components/cursorOverlay/CursorOverlay"
import { connectWithSocketServer,disconnectSocketConnection } from "../socketConn/socketConn";
import { Box, AppBar,Toolbar, Container, Grid, Stack, CircularProgress } from '@mui/material';
import ChatApp from "../components/chatApp/ChatApp";

export const RoomPage = () => {

    const { roomId } = useParams()
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [isChatAppOpen, setIsChatAppOpen] = useState(false);

    useEffect(() => {
    console.log(`Connecting to socket server for roomId: ${roomId}`);
    connectWithSocketServer(roomId)
        .then(() => {
            console.log('Socket connected successfully');
            setIsSocketConnected(true);
        })
        .catch((err) => {
            console.error('Error connecting to socket:', err);
        });

    return () => {
        console.log('Disconnecting socket connection');
        disconnectSocketConnection();
    };
}, [roomId]);


  return (
    <div>
        <Box>
            <Box>
                <RoomNavbar setIsChatAppOpen={setIsChatAppOpen} isChatAppOpen={isChatAppOpen} />
            </Box>
            <Box bgcolor='#DDDDDD'
                sx={{
                position: "relative", // Ensures that the ChatApp can position itself relative to this container
                width: "100%",
                height: "100vh", // Adjust height to match your layout
                }}
            >
                <Box>
                    <Whiteboard />
                </Box>
                <Box 
                    sx={{
                    position: "absolute",       // Makes ChatApp overlay the Whiteboard
                    top: 0,                     // Position from the top
                    right: 0,                   // Position from the right
                    width: "26%",             // Adjust width as needed
                    height: "100%",             // Full height overlay
                    backgroundColor: "white",   // Background for ChatApp
                    boxShadow: "0 0 10px rgba(0,0,0,0.3)", // Optional shadow for better visibility
                    zIndex: 10,                 // Ensures it appears above other content
                    display: isChatAppOpen ? "block" : "none", // Toggle visibility
                }}
                >
                    {isSocketConnected ? (
                    isChatAppOpen&&<ChatApp />
                    ) : (
                        <CircularProgress />
                    )}
                </Box>
            </Box>
        </Box>
    </div>
  )
}


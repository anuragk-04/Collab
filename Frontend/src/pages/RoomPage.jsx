import { useParams } from "react-router-dom";
import {React, useEffect, useState} from 'react';
import RoomNavbar from "../components/RoomNavbar";
import Whiteboard from "./../components/whiteboard/Whiteboard";
import CursorOverlay from "./../components/cursorOverlay/CursorOverlay"
import { connectWithSocketServer,disconnectSocketConnection } from "../socketConn/socketConn";
import { Box, AppBar,Toolbar, Container, Grid, Stack, CircularProgress } from '@mui/material';
import ChatApp from "../components/chatApp/ChatApp";
import Editor from "../components/Editor/Editor";
import { useSelector } from "react-redux";

export const RoomPage = () => {

    const { roomId } = useParams()
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [isChatAppOpen, setIsChatAppOpen] = useState(false);
    const [isWhiteboard, setIsWhiteboard] = useState(true);

    const cursor = useSelector(state => state.cursor.cursors);

    // console.log(cursor);

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
                <RoomNavbar setIsChatAppOpen={setIsChatAppOpen} isChatAppOpen={isChatAppOpen} setIsWhiteboard={setIsWhiteboard} isWhiteboard={isWhiteboard} />
            </Box>
            <Box bgcolor='#DDDDDD'
                sx={{
                position: "relative", // Ensures that the ChatApp can position itself relative to this container
                width: "100%",
                height: "100vh", // Adjust height to match your layout
                }}
            >
                <Box>
                    {/* <Whiteboard /> */}
                    {isSocketConnected ? (
                        isWhiteboard?
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <Whiteboard />
                            <CursorOverlay />
                        </div>

                        :
                        <Editor />
                    ) : (
                        <CircularProgress />
                    )}
                </Box>
                <Box 
                    sx={{
                    position: "fixed",  
                    top: 0,          
                    right: 0,      
                    width: "26%",            
                    height: "100%",          
                    backgroundColor: "white",  
                    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                    zIndex: 10,                
                    display: isChatAppOpen ? "block" : "none",
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


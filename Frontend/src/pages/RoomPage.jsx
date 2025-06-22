import { useParams } from "react-router-dom";
import {React, useEffect} from 'react';
import RoomNavbar from "../components/RoomNavbar";
import Whiteboard from "./../components/whiteboard/Whiteboard";
import CursorOverlay from "./../components/cursorOverlay/CursorOverlay"
import { connectWithSocketServer } from "../socketConn/socketConn";
import { Box, AppBar,Toolbar, Container, Grid, Stack } from '@mui/material';

export const RoomPage = () => {

    const { roomId } = useParams()

    useEffect(() => {
        console.log(`room called with roomId : ${roomId}`);
        connectWithSocketServer(roomId);
    }, [roomId])

  return (
    <div>
        <Grid>
            <RoomNavbar />
        </Grid>
        <Grid bgcolor='#DDDDDD'>
            <Whiteboard />
        </Grid>
    </div>
  )
}


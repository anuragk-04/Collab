import React from "react";
import {AppBar, Toolbar, Typography} from '@mui/material';
// import './InfoBar.css'
const InfoBar = () => (
   <AppBar position="static">
    <Toolbar variant="dense">
    <Typography variant="h6" color="inherit" component="div">
      Room Chats
    </Typography>
    </Toolbar>
    </AppBar>
  
);

export default InfoBar;

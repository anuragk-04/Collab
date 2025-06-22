import React from 'react';
import { Grid, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DrawIcon from '@mui/icons-material/Draw';
import CodeIcon from '@mui/icons-material/Code';
import ChatIcon from '@mui/icons-material/Chat';
import CallIcon from '@mui/icons-material/Call';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const RoomNavbar = () => {
  const roomName = localStorage.getItem('roomTitle');
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    localStorage.removeItem('roomId');
    navigate('../../rooms');
  };

  const handleDrawButtonClick = () => {
    console.log('Draw clicked');
  };

  const handleCodeButtonClick = () => {
    console.log('Code clicked');
  };

  const handleChatButtonClick = () => {
    console.log('Chat clicked');
  };

  const handleCallButtonClick = () => {
    console.log('Call clicked');
  };

  return (
    <div >
      <Grid
        container
        spacing={2}
        height={60}
        bgcolor='#aecbeb'
        alignContent='center'
        paddingLeft={2}
        paddingRight={2}
        size={12}
      >
        {/* Left Section: Back Button and Room Name */}
        <Grid 
          container
          size={3} 
          alignItems="center"
          spacing={5}
        >
            <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={handleBackButtonClick}
            >
                Back
            </Button>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }} color='#1B4F72'>
                {roomName}
            </Typography>
        </Grid>

        {/* Center Section: Code and Draw */}
        <Grid
          container
          size={6}
          justifyContent='center'
        >
          <Button
            variant="contained"
            startIcon={<DrawIcon />}
            onClick={handleDrawButtonClick}
          >
            Draw
          </Button>
          <Button
            variant="contained"
            startIcon={<CodeIcon />}
            onClick={handleCodeButtonClick}
          >
            Code
          </Button>
        </Grid>

        {/* Right Section: Chat and Voice */}
        <Grid
          container
          size={3}
          justifyContent='center'
          spacing={5}
        >
          <Button
            variant="contained"
            startIcon={<ChatIcon />}
            onClick={handleChatButtonClick}
          >
            Chat
          </Button>
          <Button
            variant="contained"
            startIcon={<CallIcon />}
            onClick={handleCallButtonClick}
          >
            Voice
          </Button>
        </Grid>
      </Grid>
     </div>
  );
};

export default RoomNavbar;

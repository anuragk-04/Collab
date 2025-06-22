import {react, useState} from 'react';
import { Grid, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DrawIcon from '@mui/icons-material/Draw';
import CodeIcon from '@mui/icons-material/Code';
import ChatIcon from '@mui/icons-material/Chat';
import CallIcon from '@mui/icons-material/Call';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from "react-redux";
import {Info } from '@mui/icons-material';
import { fetchRoomInfo } from "../services/apiService";

const RoomNavbar = () => {
  const roomName = localStorage.getItem('roomTitle');
  const boardMembers = useSelector((state) => state.whiteboard.activeUsers);
  const navigate = useNavigate();
  const [roomInfo, setRoomInfo] = useState(null);
  const [openActiveMembers, setOpenActiveMembers] = useState(false);
  const [openRoomDetails, setOpenRoomDetails] = useState(false);

  const handleClickOpenRoomInfo = async () => {
      try {
        const response = await fetchRoomInfo(localStorage.getItem('roomId'));
        console.log(response);
        setRoomInfo(response.room);
        setOpenRoomDetails(true);
      } catch (error) {
        console.log(error);
      }
    };
  
    const handleCloseRoomInfo = () => {
      setOpenRoomDetails(false);
    };

    const handleAvatarIconsClick = () => {
    setOpenActiveMembers(true);
  }

  const handleActiveIconsClose = () => {
    setOpenActiveMembers(false);
  }

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
    <div>
      <Grid
  container
  alignItems="center"
  justifyContent="space-between"
  sx={{
    position: "fixed", // Fixes the layout at the top
    top: 0,            // Aligns it to the top of the viewport
    left: 0,           // Ensures it spans the full width
    width: "100%",     // Full width
    zIndex: 1000,      // Keeps it above other elements
    height: 60,        // Fixed height
    bgcolor: "#aecbeb", // Background color
    paddingX: 1,       // Horizontal padding
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)", // Optional shadow for depth
  }}
>
  {/* Left Section: Back Button and Room Name */}
  <Grid
    item
    xs={12}
    sm={4}
    container
    alignItems="center"
    paddingLeft={1}
    spacing={2}
  >
    <Grid item>
      <Button
        variant="contained"
        startIcon={<ArrowBackIcon />}
        onClick={handleBackButtonClick}
      >
        Back
      </Button>
    </Grid>
    <Grid item>
      <Typography
        variant="h6"
        color="#1B4F72"
        sx={{ flexGrow: 1 }}
      >
        {roomName}
      </Typography>
    </Grid>
  </Grid>

  {/* Center Section: Tools */}
  <Grid
    item
    xs={12}
    sm={4}
    container
    justifyContent="center"
    spacing={2}
  >
    <Grid item>
      <Button
        variant="contained"
        startIcon={<DrawIcon />}
        onClick={handleDrawButtonClick}
      >
        Draw
      </Button>
    </Grid>
    <Grid item>
      <Button
        variant="contained"
        startIcon={<CodeIcon />}
        onClick={handleCodeButtonClick}
      >
        Code
      </Button>
    </Grid>
  </Grid>

  {/* Right Section: Chat and Info */}
  <Grid
    item
    xs={12}
    sm={4}
    container
    justifyContent="flex-end"
    spacing={2}
  >
    <Grid item>
      <Button
        variant="contained"
        startIcon={<ChatIcon />}
        onClick={handleChatButtonClick}
      >
        Chat
      </Button>
    </Grid>
    <Grid item>
      <Button
        variant="contained"
        startIcon={<CallIcon />}
        onClick={handleCallButtonClick}
      >
        Voice
      </Button>
    </Grid>
    <Grid item>
      <Button
        variant="contained"
        startIcon={<Info />}
        onClick={handleClickOpenRoomInfo}
      >
        Info
      </Button>
    </Grid>
  </Grid>
</Grid>



      {roomInfo && (
              <Dialog open={openRoomDetails} onClose={handleCloseRoomInfo} aria-labelledby="room-details-dialog-title">
                <DialogTitle id="room-details-dialog-title">Room Details</DialogTitle>
                <DialogContent>
                  <Typography variant="h6" component="div">
                    {roomInfo.roomTitle}
                  </Typography>
                  <Typography variant="body2" color="textPrimary" component="div" style={{ marginTop: 2 }}>
                    Description: {roomInfo.roomDescription}
                  </Typography>
                  <Typography variant="body2" color="textPrimary" component="div" style={{ marginTop: 15 }}>
                    Members: {roomInfo.members.length}
                  </Typography>
                  {roomInfo.members.map((member, index) => (
                    <Typography key={index} variant="body2" color="textPrimary" component="div" style={{ marginTop: 1 }}>
                      {member.memberId} | {member.memberRole} | {member.lastAccessedAt}
                    </Typography>
                  ))}
                  <Typography variant="body2" color="textPrimary" component="div" style={{ marginTop: 15 }}>
                    Created At: {roomInfo.createdAt}
                  </Typography>
                  <Typography variant="body2" color="textPrimary" component="div" style={{ marginTop: 1 }}>
                    Updated At: {roomInfo.updatedAt}
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseRoomInfo} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            )}
            <Dialog open={openActiveMembers} onClose={handleActiveIconsClose} aria-labelledby="active-members-dialog-title">
                <DialogTitle id="active-members-dialog-title">Active Members</DialogTitle>
                <DialogContent>
                    {boardMembers && boardMembers.map((member, index) => (
                    <Typography key={index} variant="body2" color="textPrimary" component="div" style={{ marginTop: 1 }}>
                        {member.email} | {member.username} | {member.firstName} | {member.lastName}
                    </Typography>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleActiveIconsClose} color="primary">
                    Close
                    </Button>
                </DialogActions>
                </Dialog>
     </div>
  );
};

export default RoomNavbar;

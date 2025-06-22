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
import { fetchBoardInfo } from "../services/apiService";

const RoomNavbar = () => {
  const roomName = localStorage.getItem('roomTitle');
  const boardMembers = useSelector((state) => state.whiteboard.activeUsers);
  const navigate = useNavigate();
  const [boardInfo, setBoardInfo] = useState(null);
  const [openActiveMembers, setOpenActiveMembers] = useState(false);

  const handleClickOpenBoardInfo = async () => {
      try {
        const response = await fetchBoardInfo(localStorage.getItem('boardId'));
        console.log(response);
        setBoardInfo(response.board);
        setOpenBoardDetails(true);
      } catch (error) {
        console.log(error);
      }
    };
  
    const handleCloseBoardInfo = () => {
      setOpenBoardDetails(false);
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
        onClick={handleClickOpenBoardInfo}
      >
        Info
      </Button>
    </Grid>
  </Grid>
</Grid>



      {boardInfo && (
              <Dialog open={openBoardDetails} onClose={handleCloseBoardInfo} aria-labelledby="board-details-dialog-title">
                <DialogTitle id="board-details-dialog-title">Board Details</DialogTitle>
                <DialogContent>
                  <Typography variant="h6" component="div">
                    {boardInfo.boardTitle}
                  </Typography>
                  <Typography variant="body2" color="textPrimary" component="div" style={{ marginTop: 2 }}>
                    Description: {boardInfo.boardDescription}
                  </Typography>
                  <Typography variant="body2" color="textPrimary" component="div" style={{ marginTop: 15 }}>
                    Members: {boardInfo.members.length}
                  </Typography>
                  {boardInfo.members.map((member, index) => (
                    <Typography key={index} variant="body2" color="textPrimary" component="div" style={{ marginTop: 1 }}>
                      {member.memberId} | {member.memberRole} | {member.lastAccessedAt}
                    </Typography>
                  ))}
                  <Typography variant="body2" color="textPrimary" component="div" style={{ marginTop: 15 }}>
                    Created At: {boardInfo.createdAt}
                  </Typography>
                  <Typography variant="body2" color="textPrimary" component="div" style={{ marginTop: 1 }}>
                    Updated At: {boardInfo.updatedAt}
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseBoardInfo} color="primary">
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

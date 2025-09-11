import { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DrawIcon from "@mui/icons-material/Draw";
import CodeIcon from "@mui/icons-material/Code";
import ChatIcon from "@mui/icons-material/Chat";
import CallIcon from "@mui/icons-material/Call";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSelector } from "react-redux";
import { Info } from "@mui/icons-material";
import axios from "axios";
import { fetchRoomInfo } from "../services/apiService";
import ConfirmModal from "./ConfirmModal";
import VoiceRoom from "./VoiceRoom/voiceRoom";

const RoomNavbar = ({
  setIsChatAppOpen,
  isChatAppOpen,
  setIsWhiteboard,
  isWhiteboard,
}) => {
  const roomName = localStorage.getItem("roomTitle");
  const roomId = localStorage.getItem("roomId"); // Agora channel name
  const boardMembers = useSelector((state) => state.whiteboard.activeUsers);
  const navigate = useNavigate();

  const [roomInfo, setRoomInfo] = useState(null);
  const [openRoomDetails, setOpenRoomDetails] = useState(false);
  const [openBackRoomConfirmDialog, setOpenBackRoomConfirmDialog] =
    useState(false);

  // 🎤 Voice Chat state
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [voiceToken, setVoiceToken] = useState(null);
  const [loadingToken, setLoadingToken] = useState(false);

  // Fetch token whenever voice is toggled ON
  useEffect(() => {
    const fetchToken = async () => {
      if (isVoiceOpen) {
        try {
          setLoadingToken(true);
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/agora/token`,
            { params: { channelName: roomId } }
          );
          setVoiceToken(res.data.token);
        } catch (err) {
          console.error("Failed to fetch Agora token", err);
          setIsVoiceOpen(false); // Close if token fails
        } finally {
          setLoadingToken(false);
        }
      } else {
        setVoiceToken(null);
      }
    };

    fetchToken();
  }, [isVoiceOpen, roomId]);

  const handleClickOpenRoomInfo = async () => {
    try {
      const response = await fetchRoomInfo(localStorage.getItem("roomId"));
      setRoomInfo(response.room);
      setOpenRoomDetails(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBackButtonClick = () => {
    setOpenBackRoomConfirmDialog(true);
  };

  const handleBackRoomConfirm = () => {
    localStorage.removeItem("roomId");
    navigate("../../rooms");
  };

  const handleDrawButtonClick = () => setIsWhiteboard(true);
  const handleCodeButtonClick = () => setIsWhiteboard(false);
  const handleChatButtonClick = () => setIsChatAppOpen((x) => !x);

  // 🎤 Voice toggle
  const handleCallButtonClick = () => {
    setIsVoiceOpen((prev) => !prev);
  };

  return (
    <div>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          height: 60,
          bgcolor: "#aecbeb",
          paddingX: 1,
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Left Section: Back Button + Room Name */}
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
            <Typography variant="h6" color="#1B4F72" sx={{ flexGrow: 1 }}>
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
              sx={{
                backgroundColor: isWhiteboard ? "#0d47a1" : "#1976d2",
              }}
              startIcon={<DrawIcon />}
              onClick={handleDrawButtonClick}
            >
              Draw
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              sx={{
                backgroundColor: !isWhiteboard ? "#0d47a1" : "#1976d2",
              }}
              startIcon={<CodeIcon />}
              onClick={handleCodeButtonClick}
            >
              Code
            </Button>
          </Grid>
        </Grid>

        {/* Right Section: Chat, Info, Voice */}
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
              sx={{
                backgroundColor: openRoomDetails ? "#0d47a1" : "#1976d2",
              }}
              startIcon={<Info />}
              onClick={handleClickOpenRoomInfo}
            >
              Info
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              sx={{
                backgroundColor: isChatAppOpen ? "#0d47a1" : "#1976d2",
              }}
              startIcon={<ChatIcon />}
              onClick={handleChatButtonClick}
            >
              Chat
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              disabled={loadingToken}
              sx={{
                backgroundColor: isVoiceOpen ? "red" : "#1976d2",
              }}
              startIcon={<CallIcon />}
              onClick={handleCallButtonClick}
            >
              {isVoiceOpen ? "Leave" : loadingToken ? "..." : "Voice"}
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {/* 🎤 Mount VoiceRoom only when active and token available */}
      {isVoiceOpen && voiceToken && (
        <VoiceRoom
          channelName={roomId}
          appId={import.meta.env.VITE_AGORA_APP_ID}
          token={voiceToken}
          uid={null}
          onLeave={() => setIsVoiceOpen(false)}
        />
      )}

      {/* Room Info Modal */}
      {roomInfo && (
        <Dialog
          open={openRoomDetails}
          onClose={() => setOpenRoomDetails(false)}
        >
          <DialogTitle>Room Details</DialogTitle>
          <DialogContent>
            <Typography variant="h6">{roomInfo.roomTitle}</Typography>
            <Typography>Description: {roomInfo.roomDescription}</Typography>
            <Typography>Members: {roomInfo.members.length}</Typography>
            {roomInfo.members.map((m, i) => (
              <Typography key={i}>
                {m.memberId} | {m.memberRole}
              </Typography>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRoomDetails(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Back Confirmation Modal */}
      <ConfirmModal
        open={openBackRoomConfirmDialog}
        title="Back to Rooms Page"
        content="Are you sure you want to go back?"
        onConfirm={handleBackRoomConfirm}
        onClose={() => setOpenBackRoomConfirmDialog(false)}
      />
    </div>
  );
};

export default RoomNavbar;

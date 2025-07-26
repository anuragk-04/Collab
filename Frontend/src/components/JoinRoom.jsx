import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Stack,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { JoinUserToRoom } from '../services/apiService';

const JoinRoom = ({ canBtnHandler}) => {
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const handleSnackbarClose = () => {
    setOpenSnackbar(false);
    };

  const handleJoin = async () => {
    // backend req to join room
    const reqBody = {
        roomId,
        userId,
        role: "EDITOR"
    };
    console.log(reqBody);
    try {
            const responseData = await JoinUserToRoom(reqBody); 
            console.log(responseData);
        
            setSnackbarMessage('Joined Room successfully!!');
            setOpenSnackbar(true);
            canBtnHandler();

        } catch (error) {
            console.log(`error while Joining room : ${error}`);
            
            setSnackbarMessage('Error while Joining room!!');
            setOpenSnackbar(true);
        }

  };

  return (
    <>
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper elevation={4} sx={{ p: 5, minWidth: 400, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          Join Room
        </Typography>

        <TextField
          fullWidth
          label="Room ID"
          variant="outlined"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          sx={{ mt: 2 }}
        />

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Stack spacing={2} direction="column" sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={!roomId}
            fullWidth
            onClick={handleJoin}
          >
            Join Room
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={canBtnHandler}
          >
            Cancel
          </Button>
        </Stack>
      </Paper>
    </Box>
    <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
        }}
    />
    </>
  );
};

export default JoinRoom;

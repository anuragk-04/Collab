import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Box,
  Stack
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ShareRoomDialog = ({ open, handleClose, roomId, roomName, roomDescription }) => {
  const [tooltipText, setTooltipText] = useState('Copy Room ID');

  const handleCopyId = () => {
    navigator.clipboard.writeText(roomId);
    setTooltipText('Copied!');
    setTimeout(() => {
      setTooltipText('Copy Room ID');
    }, 1000); // Reset tooltip text after 1 second
  };

  const handleShareLink = () => {
    const shareUrl = `${window.location.origin}/join/${roomId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Room link copied to clipboard!');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{
    sx: {
      borderRadius: 3, 
    }
  }}>
      <DialogTitle color='primary'>
        <Typography variant='h4' sx={{fontWeight: 'bold'}}>
        Share Room
        </Typography>
      </DialogTitle>
      <DialogContent >
        <Stack spacing={2} sx={{pt:1}}>
          <TextField
            label="Room Name"
            value={roomName || ''}
            fullWidth
            InputProps={{ readOnly: true }}
          />

          <TextField
            label="Description"
            value={roomDescription || ''}
            multiline
            fullWidth
            InputProps={{ readOnly: true }}
          />

          <Box display="flex" alignItems="center">
            <TextField
              label="Room ID"
              value={roomId}
              fullWidth
              InputProps={{ readOnly: true }}
            />
            <Tooltip title={tooltipText}>
              <IconButton onClick={handleCopyId} sx={{ ml: 1 }}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box display="flex" justifyContent="flex-end" mt={1}>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={handleClose}
            >
              Back
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ShareRoomDialog;

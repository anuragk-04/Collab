import React from 'react';
// import './Message.css'
import { Box, Typography } from "@mui/material";
import ReactEmoji from 'react-emoji';

const Message = ({ message, user }) => {
  let isSentByCurrentUser = false;

  if(user === message.user) {
    isSentByCurrentUser = true;
  }

  return (
     <Box
      width="100%"
      display="flex"
      flexDirection="row"
      alignItems='center'
      justifyContent={isSentByCurrentUser ? "flex-end" : "flex-start"}
      sx={{
        gap: 1,
        // paddingRight: 2,
        // marginRight:1,
        borderRadius: 2,
        marginY: 1, // Add vertical spacing between messages
        
      }}
    >
      {/* Conditional Rendering */}
      {isSentByCurrentUser ? (
        <>
          <Typography variant="body2" sx={{ color: "gray" }}>
            {user}
          </Typography>
          <Box
            sx={{
              fontSize: "1.1em",
              borderRadius: 2,
              padding: 1,
              bgcolor:'#2979FF',
              color: "White",
              wordBreak: "break-word",
            }}
          >
            {ReactEmoji.emojify(message.text)}
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{
              fontSize: "1.1em",
              borderRadius: 2,
              bgcolor: "#CCCCCC",
              padding: 1,
              color: "black",
              wordBreak: "break-word",
            }}
          >
            {ReactEmoji.emojify(message.text)}
          </Box>
          <Typography variant="body2" sx={{ color: "#2979FF" }}>
            {message.user}
          </Typography>
        </>
      )}
    </Box>
  );
}

export default Message;
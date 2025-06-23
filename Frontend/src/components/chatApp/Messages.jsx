import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import ScrollToBottom from "react-scroll-to-bottom";

import Message from "./Message";

const Messages = ({ messages = [], user }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        
      }}
    >
      <ScrollToBottom
        style={{
          width: "100%",
          height: "100%",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px", // Optional spacing between messages
          backgroundColor: "none",
          
        }}
      >
        {messages.map((message, i) => (
          <Box
        key={i}
        sx={{
            marginBottom: 1,
            "&:focus": {
            outline: "none", // Removes blue border on focus
            },
            "&:hover": {
            backgroundColor: "transparent", // Ensures no hover background
            },
        }}
        >
    < Message message={message} user={user} />
    </Box>
        ))}
        {/* Invisible element to ensure smooth scrolling */}
        <div ref={scrollRef}></div>
      </ScrollToBottom>
    </Box>
  );
};

export default Messages;

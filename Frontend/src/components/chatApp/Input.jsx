import React from "react";
// import './Input.css'
import { Box } from "@mui/material";

const Input = ({ setMessage, sendMessage, message }) => (
    <Box
    sx={{
    width: "100%", // Make the box span the full width of its parent container
    display: "flex", // Use flexbox to layout the children
    flexDirection: "column", // Arrange the input and button vertically if needed
    alignItems: "center", // Center align the items horizontally
  }}
>
  <form
    style={{
      width: "100%", // Ensure the form spans the full width
      display: "flex", // Use flexbox for proper alignment
      alignItems: "center", // Vertically align children
    }}
    onSubmit={(event) => {
      event.preventDefault(); // Prevent default submission
      sendMessage(event); // Call the sendMessage function
    }}
  >
    <input
      style={{
        width:'100%',
        height:'100%',
        flex: 1, // Make input grow to fill available space
        padding: "10px", // Add padding for better appearance
        border: "1px solid #AAAAAA", // Add a light border
        borderRadius: "5px", // Round corners
        marginRight: "10px", // Space between input and button
        border:"none"
      }}
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyDown={(event) =>
        event.key === "Enter" ? sendMessage(event) : null
      }
    />
    <button
      style={{
        padding: "10px 20px", // Padding for the button
        backgroundColor: "#009BFF", // Button background color
        color: "#fff", // Button text color
        border: "none", // Remove border
        borderRadius: "5px", // Round corners
        cursor: "pointer", // Change cursor to pointer
      }}
      onClick={(e) => {
        console.log("Clicked !");
        sendMessage(e);
      }}
    >
      Send
    </button>
  </form>
</Box>

);

export default Input;

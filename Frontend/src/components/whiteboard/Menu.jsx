import React, { useState } from "react";
import rectangleIcon from "./../../resources/icons/rectangle.svg";
import lineIcon from './../../resources/icons/line.svg';
import rubberIcon from './../../resources/icons/rubber.svg';
import pencilIcon from './../../resources/icons/pencil.svg';
import textIcon from './../../resources/icons/text.svg';
import selectionIcon from './../../resources/icons/selection.svg';
import circleIcon from './../../resources/icons/circle.svg';
import undoIcon from './../../resources/icons/undo.svg';
import { toolTypes } from "./../../constants";
import { useDispatch, useSelector } from "react-redux";
import { setElements, setToolType } from "./WhiteboardSlice";
import { disconnectSocketConnection, emitClearWhiteboard,emitWhiteboardUndo } from "./../../socketConn/socketConn";

import { Button } from '@mui/material';
import { ArrowBack, Info } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Grid } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { fetchRoomInfo } from "../../services/apiService";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const CustomIconButton = ({ src, type, isRubber, isUndo }) => {
  const dispatch = useDispatch();
  const selectedToolType = useSelector((state) => state.whiteboard.tool);
  const elements = useSelector((state) => state.whiteboard.elements);

  const handleToolChange = () => {
    dispatch(setToolType(type));
  };

  const handleClearCanvas = () => {
    dispatch(setElements([]));
    emitClearWhiteboard();
  };
  const handleUndo = () => {
    if (elements.length === 0) return;
    dispatch(setElements(elements.slice(0, -1)));
    emitWhiteboardUndo();
  };

  return (
    <button
      onClick={isRubber ? handleClearCanvas : isUndo? handleUndo : handleToolChange}
      className={
        selectedToolType === type ? "menu_button_active" : "menu_button"
      }
    >
      <img width="80%" height="80%" src={src} alt={`${type} icon`} />
    </button>
  );
};

const Menu = ({canvasRef}) => {
  const navigate = useNavigate();
  const boardMembers = useSelector((state) => state.whiteboard.activeUsers);

  

  // Function to export canvas to an image
  const exportToImage = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'canvas-image.png';
    link.click();
  };

  // Function to export canvas to a PDF
  const exportToPDF = () => {
    const canvas = canvasRef.current;
    html2canvas(canvas).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('canvas.pdf');
    });
  };

  return (
    <>   
      <div className="menu_container">
        <Grid 
            container 
            display='flex'
            justifyContent='flex-start'
            spacing={3}
            paddingLeft={3}
            alignItems='center'
            // bgcolor='#FFFFFF'
            height={60}
        >
            
                <CustomIconButton className='ml-20' src={rectangleIcon} type={toolTypes.RECTANGLE} />
                <CustomIconButton src={circleIcon} type={toolTypes.CIRCLE} />
                <CustomIconButton src={lineIcon} type={toolTypes.LINE} />
                <CustomIconButton src={pencilIcon} type={toolTypes.PENCIL} />
                <CustomIconButton src={textIcon} type={toolTypes.TEXT} />
                <CustomIconButton src={selectionIcon} type={toolTypes.SELECTION} />
                <CustomIconButton src={undoIcon} isUndo />
                <CustomIconButton src={rubberIcon} isRubber />
            
                <IconButton onClick={exportToImage} color="primary" aria-label="export to image">
                <ImageIcon />
                </IconButton>
                <IconButton onClick={exportToPDF} color="secondary" aria-label="export to pdf">
                <PictureAsPdfIcon />
                </IconButton>
            
        </Grid>

        
      </div>
      
      
    </>
  );
};

export default Menu;

import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import EditRoomDialog from './EditRoomDialog';
import ConfirmModal from './ConfirmModal';
import { useNavigate } from 'react-router-dom';
import { deleteRoomById } from '../services/apiService';

const RoomItem = ({ roomId, name, description, role, memberCnt, lastAccessedAt }) => {

    const navigate = useNavigate();

    const [openEditDialog, setOpenEditDialog] = useState(false); 
    const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
    const [openOpenRoomConfirmDialog, setOpenOpenRoomConfirmDialog] = useState(false);

    const handleEditClick = () => {
        setOpenEditDialog(true); 
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    const handleOpenRoom = () => {
        console.log(`handleOpenRoom called... for ${roomId}`)
        setOpenOpenRoomConfirmDialog(true);
    };

    const handleOpenRoomConfirm = () => {
        console.log(`handleOpenRoomConfirm called...`);
        localStorage.setItem('roomId', roomId)
        navigate(`../room/${roomId}`)
    }

    const handleDeleteRoom = () => {
        console.log(`handleDeleteRoom called...`);
        setOpenDeleteConfirmDialog(true);
    };
    
    const handleDeleteClose = () => {
        console.log(`handleDeleteClose called...`);
        setOpenDeleteConfirmDialog(false);
    };

    const handleDeleteRoomConfirm = async () => {
        console.log(`handleDeleteRoomConfirm called...`);

        try {
            const responseData = await deleteRoomById(roomId); 
            console.log(responseData);

            window.location.reload();
            setOpenDeleteConfirmDialog(false)
        } catch (error) {
            console.log(`error while deleting room : ${error}`);
        }
    }

    const handleCloseOpenRoomDialog = () => {
        console.log(`handleCloseOpenRoomDialog called...`);
        setOpenOpenRoomConfirmDialog(false);
    };

    return (
        <Grid item xs={4}>
            <Card>
                <CardContent>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography variant="h6" component="div">
                                {name}
                            </Typography>
                            <Typography variant="body2">{description}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Stack direction="row" spacing={1}>
                                {(role === 'EDITOR' || role === 'OWNER') && 
                                    <Button variant="outlined" color='error' startIcon={<DeleteIcon />} onClick={handleDeleteRoom}>
                                        Delete
                                    </Button>}
                                <Button variant="outlined" startIcon={<VisibilityIcon />} onClick={handleOpenRoom}>
                                    Open
                                </Button>
                                {(role === 'EDITOR' || role === 'OWNER') && 
                                    <Button variant="outlined" startIcon={<EditIcon />}  onClick={handleEditClick}>
                                        Edit
                                    </Button>}
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" className='mt-5'>
                                <Typography variant="body3"> 
                                    <span className='f-bold'>Role: </span> {role} 
                                </Typography>
                                <Typography variant="body3"> 
                                    <span className='f-bold ml-20'>Members: </span> {memberCnt} 
                                </Typography>
                                <Typography variant="body3"> 
                                    <span className='f-bold ml-20'>Last accessed at:</span> { lastAccessedAt === null ? 'you haven\'t accessed yet.' : new Date().toDateString()} 
                                </Typography>
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <EditRoomDialog open={openEditDialog} handleClose={handleCloseEditDialog} /> 
            <ConfirmModal
                open={openDeleteConfirmDialog}
                title="Delete Confirmation"
                content="Are you sure you want to delete this item?"
                onConfirm={handleDeleteRoomConfirm}
                onClose={handleDeleteClose}
            />
            <ConfirmModal
                open={openOpenRoomConfirmDialog}
                title="Open Room Confirmation"
                content="Are you sure you want to open this room?"
                onConfirm={handleOpenRoomConfirm}
                onClose={handleCloseOpenRoomDialog}
            />
        </Grid>
    );      
};

export default RoomItem;

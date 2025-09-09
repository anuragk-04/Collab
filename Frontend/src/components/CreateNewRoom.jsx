import React, { useEffect, useRef, useState } from 'react';
import { Button, Grid, TextField, Typography, Avatar, CardContent, Card, Paper, Select, MenuItem} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { createRoomWithMembers, fetchAllUsersForSystem } from '../services/apiService';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';

const CreateNewRoom = ({canBtnHandler}) => {

    const userId = localStorage.getItem('userId');

    const formRef = useRef(null);
    const navigate = useNavigate();

    const [allUsers, setAllUsers] = useState([]);
    const [roomTitle, setRoomTitle] = useState('');
    const [roomDescription, setRoomDescription] = useState('');
    const [addedMembers, setAddedMembers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
        
    const handleSnackbarClose = () => {
      setOpenSnackbar(false);
    };

    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                const responseData = await fetchAllUsersForSystem(userId);
                console.log(responseData);
                setAllUsers(responseData.users);
            } catch (error) {
                console.log(`error while loading rooms for user : ${error}`);
            }
        };
      
        fetchDataAsync();
    }, [])

    const handleRoomTitleChange = (event) => {
        setRoomTitle(event.target.value);
    };

    const handleRoomDescriptionChange = (event) => {
        setRoomDescription(event.target.value);
    };

    const handleRoleChange = (userId, role) => {
        const user = allUsers.find(user => user._id === userId);
        setSelectedUser({ ...user, role });
    };

    const handleAddMember = () => {
        if (selectedUser) {
            setAddedMembers(prevMembers => [...prevMembers, selectedUser]);
            setAllUsers(prevUsers => prevUsers.filter(user => user._id !== selectedUser._id));
            setSelectedUser(null);
        }
    };

    const handleRemoveMember = (userId) => {
        const removedUser = addedMembers.find(member => member._id === userId);
        if (removedUser) {
            setAddedMembers(prevMembers => prevMembers.filter(member => member._id !== userId));
            setAllUsers(prevUsers => [...prevUsers, removedUser]);
        }
    };

    const handleSubmit = async (event) => {
    event.preventDefault();

    const members = [
        { memberId: userId, role: 'OWNER' },
        ...addedMembers.map(addedMember => ({ memberId: addedMember._id, role: addedMember.role }))
    ];

    const reqBody = {
        roomTitle,
        roomDescription,
        members
    };
    console.log(reqBody);

    try {
        const responseData = await createRoomWithMembers(reqBody); 
        console.log(responseData);

        setSnackbarMessage('Room created successfully!!');
        setOpenSnackbar(true);

        // reset state instead of formRef.reset()
        setRoomTitle('');
        setRoomDescription('');
        setAddedMembers([]);

        // navigate after a short delay
        setTimeout(() => {
            canBtnHandler();
        }, 1000);
    } catch (error) {
        console.log(`error while creating room : ${error}`);
        setSnackbarMessage('Error while creating room!!');
        setOpenSnackbar(true);
    }
};


    return (
        <>
            <Grid sx={{ padding: '10px'}}>
                <Typography variant="h5">Create New Room</Typography>
            </Grid>
            <Grid container spacing={2} sx={{ padding: '20px' }}>
                <Grid item xs={6} md={6}>
                    <form onSubmit={handleSubmit} ref={formRef}>
                        <TextField
                            fullWidth
                            label="Room Title"
                            variant="outlined"
                            value={roomTitle}
                            onChange={handleRoomTitleChange}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Room Description"
                            variant="outlined"
                            value={roomDescription}
                            onChange={handleRoomDescriptionChange}
                            sx={{ marginTop: 2 }}
                        />
                        <Button variant="outlined" color="error" onClick={canBtnHandler} sx={{ marginTop: 2 }}>
                            Cancel
                        </Button>
                        <Button className='ml-20' type="submit" variant="contained" sx={{ marginTop: 2, marginLeft: 1.5 }}>
                            Create New Room
                        </Button>
                    </form>

                    <div>
                        <Typography variant="h5" style={{ marginTop: 10, marginBottom: 10 }}>
                            Added Members
                        </Typography>
                        <Paper elevation={3} style={{ padding: '20px', marginTop: '10px' }}>
                            {addedMembers.map(member => (
                                <Card key={member._id} variant="outlined" style={{ marginBottom: '10px' }}>
                                    <CardContent>
                                        <Grid container alignItems="center">
                                            <Grid item>
                                                <Avatar style={{ backgroundColor: '#3f51b5', marginRight: '10px' }}>
                                                    {member.firstName && member.firstName[0] ? member.firstName[0] : <PersonIcon />}
                                                </Avatar>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="h6" component="div">
                                                    {member.firstName && member.lastName ? `${member.firstName} ${member.lastName}` : 'Unknown User'}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {member.email || 'No email available'}
                                                </Typography>
                                            </Grid>
                                            <Grid item style={{ marginLeft: 30 }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Role: {member.role}
                                                </Typography>
                                            </Grid>
                                            <Grid item style={{ marginLeft: 30 }}>
                                                <Button variant='contained' color='error' onClick={() => handleRemoveMember(member._id)}>Remove Member</Button>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))}
                        </Paper>
                    </div>
                </Grid>
                <Grid item xs={6} md={6}>
                    <div>
                        <Typography variant="h5" gutterBottom>
                            All Users
                        </Typography>
                        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
                        {allUsers.map(user => (
                            <Card key={user._id} variant="outlined" style={{ marginBottom: '10px' }}>
                                <CardContent>
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <Avatar style={{ backgroundColor: '#3f51b5', marginRight: '10px' }}>
                                                {user.firstName && user.firstName[0] ? user.firstName[0] : <PersonIcon />}
                                            </Avatar>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h6" component="div">
                                                {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Unknown User'}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {user.email || 'No email available'}
                                            </Typography>
                                        </Grid>
                                        <Grid item style={{ marginLeft: 30 }}>
                                            <Select
                                                value={selectedUser && selectedUser._id === user._id ? selectedUser.role : ''}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                variant="outlined"
                                            >
                                                <MenuItem value="EDITOR">Editor</MenuItem>
                                                <MenuItem value="VIEWER">Viewer</MenuItem>
                                            </Select>
                                        </Grid>
                                        <Grid item style={{ marginLeft: 30 }}>
                                            <Button variant='contained' onClick={handleAddMember}>Add Member</Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                        </Paper>
                    </div>
                </Grid>
            </Grid>

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
    )
}

export default CreateNewRoom;

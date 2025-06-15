import React, { useEffect, useState } from 'react';
import { Button, Grid } from '@mui/material';
import { fetchRoomsForUser } from '../services/apiService';
import RoomItem from '../components/RoomItem';
import CreateNewRoom from '../components/CreateNewRoom';
import AppHeader from '../components/AppHeader';
import { Box } from '@mui/material';

export const RoomsPage = () => {
  const userId = localStorage.getItem('userId');
  
  const [isCreateNewRoomPage, setIsCreateNewRoomPage] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const responseData = await fetchRoomsForUser(userId);
        console.log(responseData);
        setRooms(responseData.respRoom || []);
      } catch (error) {
        // setError(error.message);
        console.log(`error while loading rooms for user : ${error}`);
      }
    };
    
    fetchDataAsync();
  }, []);

  function handleToggleNewRoom() {
    setIsCreateNewRoomPage(!isCreateNewRoomPage);
  }
  
  return (
  <div>
    <AppHeader />
    <Box sx={{ padding: '20px' }}>
      {/* Button Section */}
      {!isCreateNewRoomPage && (
        <Box sx={{ marginBottom: '20px', textAlign: 'center' }}>
          <Button variant="contained" onClick={handleToggleNewRoom}>
            Create New Room
          </Button>
        </Box>
      )}

      {/* Rooms Grid Section */}
      {!isCreateNewRoomPage && rooms.length > 0 && (
        <Grid container spacing={3}>
          {rooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={room._id}>
              <Box
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                  backgroundColor: '#fff',
                }}
              >
                <Box
                  sx={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  <RoomItem
                    roomId={room._id}
                    name={room.roomTitle}
                    description={room.roomDescription}
                    role={room.role}
                    memberCnt={room.members.length}
                    lastAccessedAt={room.lastAccessedAt}
                  />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* No Rooms Message */}
      {!isCreateNewRoomPage && rooms.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'text.secondary',
          }}
        >
          <p>No rooms found. Create your first room to get started!</p>
        </Box>
      )}

      {/* Create New Room Section */}
      {isCreateNewRoomPage && (
        <Box>
          <CreateNewRoom canBtnHandler={handleToggleNewRoom} />
        </Box>
      )}
    </Box>
  </div>
);

};
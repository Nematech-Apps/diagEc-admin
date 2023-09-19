import { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';

import { useAuth } from 'src/hooks/use-auth';
import { auth as firebaseAuth } from '../../firebase/firebaseConfig';

const user = {
  avatar: '/assets/avatars/avatar-anika-visser.png',
  city: 'Los Angeles',
  country: 'USA',
  jobTitle: 'Senior Developer',
  name: 'Anika Visser',
  timezone: 'GTM-7'
};

export const AccountProfile = () => {
  const auth = useAuth();
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userSnapshot = await auth.getUser(firebaseAuth.currentUser?.uid);
        setUserData(userSnapshot);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchUserData();
  }, []);

  return(
    <Card>
    <CardContent>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Avatar
          src='/assets/avatars/user.png'
          sx={{
            height: 80,
            mb: 2,
            width: 80
          }}
        />
        <Typography
          gutterBottom
          variant="h5"
        >
          {userData?.identifiant}
        </Typography>
        {/* <Typography
          color="text.secondary"
          variant="body2"
        >
          {user.city} {user.country}
        </Typography> */}
        {/* <Typography
          color="text.secondary"
          variant="body2"
        >
          {user.timezone}
        </Typography> */}
      </Box>
    </CardContent>
    <Divider />
    {/* <CardActions>
      <Button
        fullWidth
        variant="text"
      >
        Upload picture
      </Button>
    </CardActions> */}
  </Card>
  );
  
};

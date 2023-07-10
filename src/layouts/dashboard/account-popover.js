import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';

import { auth as firebaseAuth } from '../../firebase/firebaseConfig'

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open } = props;
  const router = useRouter();
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


  const handleSignOut = useCallback(
    () => {
      onClose?.();
      auth.signOut();
      //router.push('/auth/login');
    },
    [onClose, auth, router]
  );


  const handleAccount = useCallback(
    () => {
      onClose?.();
      router.push('/account');
    },
    [onClose]
  );

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2
        }}
      >
        <Typography variant="overline" onClick={handleAccount} style={{ cursor: 'pointer' }}>
          Mon compte
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {userData?.identifiant}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: '8px',
          '& > *': {
            borderRadius: 1
          }
        }}
      >
        <MenuItem onClick={handleSignOut}>
          Déconnexion
        </MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};

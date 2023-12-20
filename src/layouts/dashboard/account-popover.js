import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { Box, Divider, MenuItem, MenuList, Popover, Typography, Stack, SvgIcon } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';

import { auth as firebaseAuth } from '../../firebase/firebaseConfig'

import UserIcon from '@heroicons/react/24/solid/UserIcon';
import Cog6ToothIcon from '@heroicons/react/24/solid/Cog6ToothIcon';

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


  const handleSettings = useCallback(
    () => {
      onClose?.();
      router.push('/settings');
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
          px: 2,
          color: 'white',
          backgroundColor: '#077c93'
        }}
      >
        <Typography variant="subtitle2">
          {userData?.identifiant}
        </Typography>
        {/* <Typography variant="overline" >
          Mon compte
        </Typography> */}
        {/* <Typography
          color="text.secondary"
          variant="body2"
        >
          {userData?.identifiant}
        </Typography> */}
      </Box>
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Stack direction={'column'} spacing={1}>
          <Stack direction={'row'} spacing={1}>
            <SvgIcon>
              <UserIcon />
            </SvgIcon>
            <Typography variant="overline" onClick={handleAccount} style={{ cursor: 'pointer' }}>
              Mon compte
            </Typography>
          </Stack>
          {/* {
            userData?.role == "SUPER-ADMIN" &&
            <>
              <Divider />
              <Stack direction={'row'} spacing={1}>
                <SvgIcon>
                  <Cog6ToothIcon />
                </SvgIcon>
                <Typography variant="overline" onClick={handleSettings} style={{ cursor: 'pointer' }}>
                  Paramètres
                </Typography>
              </Stack>
            </>
          } */}


        </Stack>

      </Box>

      {/* <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {userData?.identifiant}
        </Typography>
      </Box> */}
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

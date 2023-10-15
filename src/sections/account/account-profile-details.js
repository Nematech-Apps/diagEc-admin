import { useCallback, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Chip,
  TextField,
  Unstable_Grid2 as Grid,
  Typography
} from '@mui/material';

import EnvelopeIcon from '@heroicons/react/24/solid/EnvelopeIcon';
import { SvgIcon } from '@mui/material';

import { useAuth } from 'src/hooks/use-auth';
import { auth as firebaseAuth } from '../../firebase/firebaseConfig';

import ToastComponent from 'src/components/toast';

const states = [
  {
    value: 'alabama',
    label: 'Alabama'
  },
  {
    value: 'new-york',
    label: 'New York'
  },
  {
    value: 'san-francisco',
    label: 'San Francisco'
  },
  {
    value: 'los-angeles',
    label: 'Los Angeles'
  }
];

export const AccountProfileDetails = () => {
  const [values, setValues] = useState({
    firstName: 'Anika',
    lastName: 'Visser',
    email: 'demo@devias.io',
    phone: '',
    state: 'los-angeles',
    country: 'USA'
  });

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

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

  const [pwd, setPwd] = useState('')

  const handleSendResetPwdLink = async () => {
    try {
      await auth.resetUserPassword(userData?.email);
      return ToastComponent({ message: 'Lien envoyé avec succès! Veuillez vérifier votre boîte mail.', type: 'success' });
    }
    catch (error) {
      return ToastComponent({ message: error.message, type: 'error' });
    }
  }


  function convertTimestampToDateFormat(timestamp) {
    // Create a new Date object using the timestamp
    const date = new Date(timestamp);
  
    // Extract the date components
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    // Format the components into the desired string
    const formattedDate = `${day}/${month}/${year} à ${hours}h${minutes}`;
  
    return formattedDate;
  }

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader
          subheader="Seul le mot de passe peut être modifié"
          title="Infos"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  //helperText="Please specify the first name"
                  label="Email"
                  name="email"
                  required
                  value={userData?.email}
                  disabled
                  sx={{ paddingTop: 2 }}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Identifiant"
                  name="identifiant"
                  required
                  value={userData?.identifiant}
                  disabled
                  sx={{ paddingTop: 2 }}
                />
              </Grid>


              <Grid
                xs={12}
                md={12}
              >
                <Stack direction={'row'} spacing={2}>
                  <Typography variant='body1' style={{ fontWeight: 'bold' }}>
                    Date de dernière connexion :
                  </Typography>
                  <Typography>
                    {userData?.lastDateAuthentication}
                  </Typography>
                </Stack>

              </Grid>


              <Grid
                xs={12}
                md={12}
              >
                <Divider>
                  <Chip label="Mise à jour du mot de passe" />
                </Divider>
              </Grid>

              <Grid
                xs={12}
                md={12}
              >
                <Button
                  variant="contained"
                  endIcon={
                    <SvgIcon>
                      <EnvelopeIcon />
                    </SvgIcon>
                  }
                  fullWidth
                  onClick={handleSendResetPwdLink}
                >
                  Envoyer un lien de rénitialisation de mot de passe
                </Button>
                {/* <TextField
                  fullWidth
                  label="Mot de passe"
                  name="mot de passe"
                  type='password'
                  onChange={(e) => setPwd(e.target.value)}
                  required
                  value={pwd}
                /> */}
              </Grid>
              {/* <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  onChange={handleChange}
                  type="number"
                  value={values.phone}
                />
              </Grid> */}
              {/* <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  onChange={handleChange}
                  required
                  value={values.country}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Select State"
                  name="state"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.state}
                >
                  {states.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid> */}
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        {/* <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleEditPwd}>
            Enregistrer
          </Button>
        </CardActions> */}
      </Card>
    </form>
  );
};

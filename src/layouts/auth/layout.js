import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { Box, Typography, Unstable_Grid2 as Grid, Paper } from '@mui/material';
import { Logo } from 'src/components/logo';

import LottieAnimation from 'src/components/lottieAnimation';
import animationData from 'src/animations/w4.json';

// TODO: Change subtitle text

export const Layout = (props) => {
  const { children } = props;

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flex: '1 1 auto'
      }}
    >
      
      <Grid
        container
        sx={{ flex: '1 1 auto' }}
      >
        
        <Grid
          xs={12}
          lg={6}
          sx={{
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          <Box
            component="header"
            sx={{
              left: 0,
              p: 3,
              position: 'absolute',
              top: 0,
              width: '100%'
            }}
          >
             <Paper elevation={16} sx={{width: '20%', height: '100%', borderRadius: 2}} variant='elevation' >
              <Box
                component={NextLink}
                href="/"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 4,
                  height: 100,
                  width: 100,
                }}
              >
                <Logo />
              </Box>
            </Paper>
          
          </Box>
         
          <div style={{marginTop: 100}}>
          {children}
          </div>
        </Grid>
        <Grid
          xs={12}
          lg={6}
          sx={{
            alignItems: 'center',
            backgroundColor: '#077c93',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            '& img': {
              maxWidth: '100%'
            }
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography
              align="center"
              color="inherit"
              sx={{
                fontSize: '16px',
                lineHeight: '32px',
                mb: 1
              }}
              variant="h2"
            >
              Bienvenue sur la plateforme admin de DiagEc
              <Box
                component="a"
                sx={{ color: '#15B79E' }}
                target="_blank"
              >

              </Box>
            </Typography>
            <Typography
              align="center"
              sx={{
                mb: 3,
                fontSize: '10px',
                lineHeight: '32px',
              }}
              variant="h4"
            >
              {/* Cette plateforme permet de créer des données qui seront utilisées par l'application mobile et 
              l'application web Diag'Ec, d'administrer les données produites par ces deux applications. */}
            </Typography>
            {/* <img
              alt=""
              src="/assets/ecologie-industrielle_terre.png"
            /> */}
            <LottieAnimation animationData={animationData} />

            <Typography
              align="center"
              sx={{
                mb: 3,
                fontSize: '10px',
                lineHeight: '32px',
              }}
              variant="h4"
            >
              Développé par Ohana Entreprise &copy; {new Date().getFullYear()}, Tous droits réservés.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

Layout.prototypes = {
  children: PropTypes.node
};
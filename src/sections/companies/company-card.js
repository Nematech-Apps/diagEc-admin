import { useState } from 'react';
import PropTypes from 'prop-types';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ClockIcon from '@heroicons/react/24/solid/ClockIcon';
import InformationCircleIcon from '@heroicons/react/24/solid/InformationCircleIcon';
import { Avatar, Box, Card, CardContent, Divider, Stack, SvgIcon, Typography, Button, Fab, FormControlLabel } from '@mui/material';
import { IOSSwitch } from 'src/components/ios-switch';


import { CompanyModalDetails } from './companies-modal-details';

export const CompanyCard = (props) => {
  const { company } = props;

  function formatDate(timeStamp) {
    const date = timeStamp.toDate();
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'UTC',
      timeZoneName: 'short',
    };

    const formatted = date.toLocaleString('fr-FR', options);
    const str = formatted.replace('à', 'à ');
    return str.replace('UTC', '');
  }


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const handleDetailsClick = (event, company) => {
    setModalData(company);
    setIsModalOpen(true);
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pb: 3
          }}
        >
          <Avatar
            src={company.logo}
            variant="square"
          />
        </Box>
        <Typography
          align="center"
          gutterBottom
          variant="h5"
        >
          {company.raisonSociale}
        </Typography>
        <Typography
          align="center"
          gutterBottom
          variant="h5"
        >
          <IOSSwitch sx={{ m: 1 }} defaultChecked />
        </Typography>

        <Typography
          align="center"
          variant="body1"
        >
          {company.adresse}
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: 2 }}
      >
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <SvgIcon
            color="action"
            fontSize="small"
          >
            <ClockIcon />
          </SvgIcon>
          <Typography
            color="text.secondary"
            display="inline"
            variant="body2"
          >
            {formatDate(company.createdAt)}
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
        >
          <Fab
            variant="extended"
            size="small"
            color="warning"
            aria-label="info"
            onClick={(event) => handleDetailsClick(event, company)}
          >
            <SvgIcon fontSize="small">
              <InformationCircleIcon />
            </SvgIcon>
          </Fab>

          {isModalOpen && modalData && <CompanyModalDetails data={modalData}
            isOpen={isModalOpen}
            handleClose={() => setIsModalOpen(false)} />}
          {/* <Button variant="outlined" startIcon={<SvgIcon
            color="info"
            fontSize="small"
          ><InformationCircleIcon /></SvgIcon>}>

          </Button> */}
          {/* <SvgIcon
            color="action"
            fontSize="small"
          >
            <ArrowDownOnSquareIcon />
          </SvgIcon>
          <Typography
            color="text.secondary"
            display="inline"
            variant="body2"
          >

          </Typography> */}
        </Stack>
      </Stack>
    </Card>
  );
};

CompanyCard.propTypes = {
  company: PropTypes.object.isRequired
};

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ArrowDownIcon from '@heroicons/react/24/solid/ArrowDownIcon';
import ArrowUpIcon from '@heroicons/react/24/solid/ArrowUpIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import BuildingOfficeIcon from '@heroicons/react/24/solid/BuildingOfficeIcon';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography, Skeleton, Box } from '@mui/material';

import { getCompanyList } from 'src/firebase/firebaseServices';
import { OnSnapshot } from 'src/firebase/firebaseConfig';


export const OverviewTotalCustomers = (props) => {
  const { difference, positive = false, sx, value } = props;

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const unsubscribe = OnSnapshot(
      getCompanyList(),
      (snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setData(fetchedData);
        setIsLoading(false);
      },
      (error) => {
        console.log('Error fetching data:', error);
        setIsLoading(false);
      }
    );

    return () => {
      // Clean up the listener when the component unmounts
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ width: 200 }}>
        <Skeleton variant="rectangular" width={210} height={118} />
      </Box>
    );
  }

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              variant="overline"
            >
              Entreprises
            </Typography>
            <Typography variant="h4">
              {data.length}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'success.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <BuildingOfficeIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        
      </CardContent>
    </Card>
  );
};

OverviewTotalCustomers.propTypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  value: PropTypes.string,
  sx: PropTypes.object
};


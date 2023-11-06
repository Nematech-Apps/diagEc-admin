import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CurrencyDollarIcon from '@heroicons/react/24/solid/CurrencyDollarIcon';
import LifebuoyIcon from '@heroicons/react/24/solid/LifebuoyIcon';
import PaperClipIcon from '@heroicons/react/24/solid/PaperClipIcon';
import LightBulbIcon from '@heroicons/react/24/solid/LightBulbIcon';
import SunIcon from '@heroicons/react/24/solid/SunIcon';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography, Box, Skeleton } from '@mui/material';

import { getDefisList } from 'src/firebase/firebaseServices';
import { OnSnapshot } from 'src/firebase/firebaseConfig';

export const OverviewTotalProfit = (props) => {
  const { value, sx } = props;

  const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = OnSnapshot(
            getDefisList(),
            (snapshot) => {
                const fetchedData = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
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
              Défis
            </Typography>
            <Typography variant="h4">
              {data.length}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <LightBulbIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTotalProfit.propTypes = {
  value: PropTypes.string,
  sx: PropTypes.object
};

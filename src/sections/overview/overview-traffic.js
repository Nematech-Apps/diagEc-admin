import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ComputerDesktopIcon from '@heroicons/react/24/solid/ComputerDesktopIcon';
import DeviceTabletIcon from '@heroicons/react/24/solid/DeviceTabletIcon';
import PhoneIcon from '@heroicons/react/24/solid/PhoneIcon';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  SvgIcon,
  Typography,
  Skeleton,
  useTheme
} from '@mui/material';
import { Chart } from 'src/components/chart';

import { getCompanyListByNiveau } from 'src/firebase/firebaseServices';
import { OnSnapshot, Query } from 'src/firebase/firebaseConfig';

const useChartOptions = (labels,theme) => {
  //const theme = useTheme();

  return {
    chart: {
      background: 'transparent'
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main
    ],
    dataLabels: {
      enabled: true
    },
    labels,
    legend: {
      show: true
    },
    plotOptions: {
      pie: {
        expandOnClick: false
      }
    },
    states: {
      active: {
        filter: {
          type: 'none'
        }
      },
      hover: {
        filter: {
          type: 'none'
        }
      }
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    },
    tooltip: {
      fillSeriesColor: false
    }
  };
};

const iconMap = {
  Desktop: (
    <SvgIcon>
      <ComputerDesktopIcon />
    </SvgIcon>
  ),
  Tablet: (
    <SvgIcon>
      <DeviceTabletIcon />
    </SvgIcon>
  ),
  Phone: (
    <SvgIcon>
      <PhoneIcon />
    </SvgIcon>
  )
};

export const OverviewTraffic = (props) => {
  const { labels, sx } = props;
  //var chartOptions = useChartOptions(labels);

  const theme = useTheme();

  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupedData = await getCompanyListByNiveau();
        const keysArray = Object.keys(groupedData);
        const options = useChartOptions(keysArray,theme);
        setChartOptions(options)
        const valuesArray = Object.values(groupedData);
        const arr = [];
        valuesArray.forEach((elt) => {
          arr.push(elt.length)
        });
        setChartSeries(arr);
        setData(groupedData);
        setIsLoading(false);
      } catch (error) {
        console.log('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
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
      <CardHeader title="Pourcentage d'entreprises par niveau" />
      <CardContent>
        <Chart
          height={300}
          options={chartOptions}
          series={chartSeries}
          type="donut"
          width="100%"
        />
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="center"
          spacing={2}
          sx={{ mt: 2 }}
        >
          {/* {chartSeries.map((item, index) => {
            const label = labels[index];

            return (
              <Box
                key={label}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                {iconMap[label]}
                <Typography
                  sx={{ my: 1 }}
                  variant="h6"
                >
                  {label}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="subtitle2"
                >
                  {item}%
                </Typography>
              </Box>
            );
          })} */}
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTraffic.propTypes = {
  chartSeries: PropTypes.array,
  labels: PropTypes.array,
  sx: PropTypes.object
};

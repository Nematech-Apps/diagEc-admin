import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  SvgIcon,
  Skeleton,
  Box
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Chart } from 'src/components/chart';

import { getCompanyListByMonth } from 'src/firebase/firebaseServices';
import { OnSnapshot, Query } from 'src/firebase/firebaseConfig';

const useChartOptions = (labels, theme) => {
  //const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    colors: [theme.palette?.primary.main],
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1,
      type: 'solid'
    },
    grid: {
      borderColor: theme.palette?.divider,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    legend: {
      show: false
    },
    plotOptions: {
      bar: {
        columnWidth: '40px'
      }
    },
    stroke: {
      colors: ['transparent'],
      show: true,
      width: 2
    },
    theme: {
      mode: theme.palette?.mode
    },
    xaxis: {
      axisBorder: {
        color: theme.palette?.divider,
        show: true
      },
      axisTicks: {
        color: theme.palette?.divider,
        show: true
      },
      categories: labels,
      labels: {
        offsetY: 5,
        style: {
          colors: theme.palette?.text.secondary
        }
      }
    },
    yaxis: {
      labels: {
        formatter: (value) => (value > 0 ? `${value}` : `${value}`),
        offsetX: -10,
        style: {
          colors: theme.palette?.text.secondary
        }
      }
    }
  };
};

export const OverviewSales = (props) => {
  const { sx } = props;
  const theme = useTheme();

  // const chartOptions = useChartOptions(theme);


  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupedData = await getCompanyListByMonth();
        console.clear();
        console.log(`groupedDataByMonth : ${JSON.stringify(groupedData)}`);
        const keysArray = Object.keys(groupedData);
        console.log(`keysArray : ${keysArray}`);
        const options = useChartOptions(keysArray, theme);
        setChartOptions(options);

  
        const valuesArray = Object.values(groupedData);
        const arr = [];
        valuesArray.forEach((elt) => {
          arr.push(elt.length);
        });
        console.log(`arr : ${JSON.stringify(arr)}`);
        setChartSeries([{ data: arr}]);
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
        <Skeleton variant="rectangular" width={210} height={318} />
      </Box>
    );
  }

  return (
    <Card sx={sx}>
      <CardHeader
        // action={(
        //   <Button
        //     color="inherit"
        //     size="small"
        //     startIcon={(
        //       <SvgIcon fontSize="small">
        //         <ArrowPathIcon />
        //       </SvgIcon>
        //     )}
        //   >
        //     Recharger
        //   </Button>
        // )}
        title="Entreprises inscrites aucours du temps"
      />
      <CardContent>
        <Chart
          height={350}
          options={chartOptions}
          series={chartSeries}
          type="bar"
          width="100%"
        />
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        {/* <Button
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
        >
          Overview
        </Button> */}
      </CardActions>
    </Card>
  );
};

OverviewSales.protoTypes = {
  chartSeries: PropTypes.array.isRequired,
  sx: PropTypes.object
};

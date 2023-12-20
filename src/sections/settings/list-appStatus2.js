import { useCallback, useState, useEffect } from 'react';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Checkbox,
    Divider,
    FormControlLabel,
    Stack,
    Skeleton,
    Chip,
    SvgIcon,
    Typography,
    Unstable_Grid2 as Grid
} from '@mui/material';

import { getSettingsList } from 'src/firebase/firebaseServices';
import { OnSnapshot } from 'src/firebase/firebaseConfig';



import WrenchScrewdriverIcon from '@heroicons/react/24/solid/WrenchScrewdriverIcon';

export const ListStatusApp2 = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = OnSnapshot(
            getSettingsList(),
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
            <Stack spacing={1}>
                {/* For variant="text", adjust the height via font-size */}
                <Skeleton variant="text"
                    sx={{ fontSize: '1rem' }} />
                {/* For other variants, adjust the size with `width` and `height` */}
                <Skeleton variant="circular"
                    width={40}
                    height={40} />
                <Skeleton variant="rectangular"
                    width={210}
                    height={60} />
                <Skeleton variant="rounded"
                    width={210}
                    height={60} />
            </Stack>
        );
    }

    return (
        <Card>
            <CardHeader
                // subheader="Manage the notifications"
                title="L'app web"
            />
            <Divider />
            <CardContent>
                <Grid
                    container
                    spacing={6}
                    wrap="wrap"
                >
                    {
                        data.map((elt, index) => {
                            return (
                                <>
                                    <Grid
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        key={index}
                                    >
                                        <Stack spacing={1}>
                                            <Typography variant="h6">
                                                Mode actuel
                                            </Typography>
                                            <Stack>
                                                <Typography variant="subtitle1" color={'cornflowerblue'}>
                                                    {elt.maintenanceMode2 == "1" ? "maintenance" : "Production"}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                    <Grid
                                        item
                                        md={4}
                                        sm={6}
                                        xs={12}
                                    >
                                        <Stack spacing={1}>
                                            <Typography variant="h6">
                                                Version minimale
                                            </Typography>
                                            <Stack>
                                                <Typography variant="subtitle1" color={'cornflowerblue'}>
                                                    {elt.minimumVersion}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                </>
                            )
                        })
                    }

                </Grid>
            </CardContent>
            <Divider />

        </Card>
    );
};

import { useState, useEffect } from 'react';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
    Box,
    Button,
    Container,
    Pagination,
    Stack,
    SvgIcon,
    Typography,
    Unstable_Grid2 as Grid,
    LinearProgress
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CompanyCard } from './company-card';
import { CompaniesSearch } from './companies-search';

import { getCompanyList } from 'src/firebase/firebaseServices';
import { OnSnapshot } from 'src/firebase/firebaseConfig';


export const DisplayCompanyListCard = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);

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
            <Stack sx={{ width: '100%', color: 'grey.500' }}
                spacing={2}>
                <LinearProgress color="secondary" />
                <LinearProgress color="success" />
                <LinearProgress color="inherit" />
            </Stack>
        );
    }

    const itemsPerPage = 6;
    const pageCount = Math.ceil(data.length / itemsPerPage);

    const getPaginatedItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    }

    const handlePagechange = () => {
        if (currentPage < pageCount) {
            setCurrentPage(currentPage + 1);
        }
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    return (
        <>
            <Grid container
                spacing={3}>
                {getPaginatedItems().map((company) => (
                    <Grid xs={12}
                        md={6}
                        lg={4}
                        key={company.id}>
                        <CompanyCard company={company} />
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination count={pageCount}
                    size="small"
                    onChange={handlePagechange} />
            </Box>
        </>
    );
};

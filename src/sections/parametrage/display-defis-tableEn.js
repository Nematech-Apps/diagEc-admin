import { useSelection } from 'src/hooks/use-selection';
import { applyPagination } from 'src/utils/apply-pagination';

import { useCallback, useMemo, useState, useEffect } from 'react';

import { DefisTable } from './defis-table';
import { DefisTableEn } from './defis-tableEn';

import { getDefisList } from 'src/firebase/firebaseServices';
import { OnSnapshot } from 'src/firebase/firebaseConfig';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';


import { DefiEnSearchBar } from 'src/components/searchBar/defiEnSearchBar';

export const DisplayDefisTableEn = () => {
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

    const [searchTerm, setSearchTerm] = useState('');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(2);

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
    };

    const useDefis = useMemo(() => {
        const filteredData = data.filter(
            (defi) =>
                (defi.libelleEn?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (defi?.pilier?.libelleEn?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
        return applyPagination(filteredData, page, rowsPerPage);
    }, [data, searchTerm, page, rowsPerPage]);


    const useDefisIds = useMemo(() => {
        return useDefis?.map((defi) => defi.id);
    }, [useDefis]);



    const defis = useDefis;
    const defisIds = useDefisIds;
    const defisSelection = useSelection(defisIds);

    const handlePageChange = useCallback((event, value) => {
        setPage(value);
    }, []);

    const handleRowsPerPageChange = useCallback((event) => {
        setRowsPerPage(event.target.value);
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
        <Stack direction={'column'} spacing={2}>
            <DefiEnSearchBar onSearch={handleSearch} />
            <DefisTableEn
                count={data?.length}
                items={defis}
                onDeselectAll={defisSelection.handleDeselectAll}
                onDeselectOne={defisSelection.handleDeselectOne}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSelectAll={defisSelection.handleSelectAll}
                onSelectOne={defisSelection.handleSelectOne}
                page={page}
                rowsPerPage={rowsPerPage}
                selected={defisSelection.selected}
            />
        </Stack>
    )

}
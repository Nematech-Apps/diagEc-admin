import { useSelection } from 'src/hooks/use-selection';
import { applyPagination } from 'src/utils/apply-pagination';

import { useCallback, useMemo, useState, useEffect } from 'react';

import { NiveauTable } from './niveau-table';

import { getNiveauList } from 'src/firebase/firebaseServices';
import { OnSnapshot } from 'src/firebase/firebaseConfig';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';


import { NiveauSearchBar } from 'src/components/searchBar/niveauSearchBar';

export const DisplayNiveauTable = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = OnSnapshot(
            getNiveauList(),
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



    const useNiveaux = useMemo(() => {
        const filteredData = data.filter(
            (niveau) =>
                (niveau.libelleFr?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (niveau.libelleEn?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (niveau.libelleIt?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
        return applyPagination(filteredData, page, rowsPerPage);
    }, [data, searchTerm, page, rowsPerPage]);


    const useNiveauIds = useMemo(() => {
        return useNiveaux?.map((niveau) => niveau.id);
    }, [useNiveaux]);



    const niveaux = useNiveaux;
    const niveauxIds = useNiveauIds;
    const niveauxSelection = useSelection(niveauxIds);

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
            <NiveauSearchBar onSearch={handleSearch} />
            <NiveauTable
                count={data?.length}
                items={niveaux}
                onDeselectAll={niveauxSelection.handleDeselectAll}
                onDeselectOne={niveauxSelection.handleDeselectOne}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSelectAll={niveauxSelection.handleSelectAll}
                onSelectOne={niveauxSelection.handleSelectOne}
                page={page}
                rowsPerPage={rowsPerPage}
                selected={niveauxSelection.selected}
            />
        </Stack>
    )

}
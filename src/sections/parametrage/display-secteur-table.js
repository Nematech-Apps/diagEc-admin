import { useSelection } from 'src/hooks/use-selection';
import { applyPagination } from 'src/utils/apply-pagination';

import { useCallback, useMemo, useState, useEffect } from 'react';

import { SecteurTable } from './secteur-table';

import { getSecteurList } from 'src/firebase/firebaseServices';
import { OnSnapshot } from 'src/firebase/firebaseConfig';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';


import { SecteurSearchBar } from 'src/components/searchBar/secteurSearchBar';


export const DisplaySecteurTable = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = OnSnapshot(
            getSecteurList(),
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


    const useSecteurs = useMemo(() => {
        const filteredData = data.filter(
            (secteur) =>
                (secteur.libelleFr?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (secteur.libelleEn?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (secteur.libelleIt?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
        return applyPagination(filteredData, page, rowsPerPage);
    }, [data, searchTerm, page, rowsPerPage]);


    const useSecteurIds = useMemo(() => {
        return useSecteurs?.map((secteur) => secteur.id);
    }, [useSecteurs]);


    
    const secteurs = useSecteurs;
    const secteursIds = useSecteurIds;
    const secteursSelection = useSelection(secteursIds);

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
            <SecteurSearchBar onSearch={handleSearch}/>
            <SecteurTable
            count={data?.length}
            items={secteurs}
            onDeselectAll={secteursSelection.handleDeselectAll}
            onDeselectOne={secteursSelection.handleDeselectOne}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onSelectAll={secteursSelection.handleSelectAll}
            onSelectOne={secteursSelection.handleSelectOne}
            page={page}
            rowsPerPage={rowsPerPage}
            selected={secteursSelection.selected}
        />
        </Stack>
    );
};

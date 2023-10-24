import { useSelection } from 'src/hooks/use-selection';
import { applyPagination } from 'src/utils/apply-pagination';

import { useCallback, useMemo, useState, useEffect } from 'react';

import { UserTable } from './user-table';

import { getUserList } from 'src/firebase/firebaseServices';
import { OnSnapshot } from 'src/firebase/firebaseConfig';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';


import { UserSearchBar } from 'src/components/searchBar/userSearchBar';


export const DisplayUserTable = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = OnSnapshot(
            getUserList(),
            (snapshot) => {
                const fetchedData = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }));
                const filteredData = fetchedData.filter(elt => elt.role == "ADMIN");
                setData(filteredData);
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


    const useUsers = useMemo(() => {
        const filteredData = data.filter(
            (user) =>
                (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (user.identifiant?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (user.role?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
        return applyPagination(filteredData, page, rowsPerPage);
    }, [data, searchTerm, page, rowsPerPage]);


    const useUsersIds = useMemo(() => {
        return useUsers?.map((user) => user.id);
    }, [useUsers]);



    const users = useUsers;
    const usersIds = useUsersIds;
    const usersSelection = useSelection(usersIds);

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
            <UserSearchBar onSearch={handleSearch} />
            <UserTable
                count={data?.length}
                items={users}
                onDeselectAll={usersSelection.handleDeselectAll}
                onDeselectOne={usersSelection.handleDeselectOne}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSelectAll={usersSelection.handleSelectAll}
                onSelectOne={usersSelection.handleSelectOne}
                page={page}
                rowsPerPage={rowsPerPage}
                selected={usersSelection.selected}
            />
        </Stack>
    );
};

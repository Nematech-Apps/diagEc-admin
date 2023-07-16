import { useSelection } from 'src/hooks/use-selection';
import { applyPagination } from 'src/utils/apply-pagination';

import { useCallback, useMemo, useState, useEffect } from 'react';

import { AnswerTable } from './answer-table';

import { getAnswerList } from 'src/firebase/firebaseServices';
import { OnSnapshot } from 'src/firebase/firebaseConfig';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';




export const DisplayAnswerTable = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = OnSnapshot(
            getAnswerList(),
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


    const useAnswers = (page, rowsPerPage) => {
        return useMemo(
            () => {
                return applyPagination(data, page, rowsPerPage);
            },
            [data, page, rowsPerPage]
        );
    };
    
    const useAnswerIds = (answers) => {
        return useMemo(
            () => {
                return answers?.map((answer) => answer.id);
            },
            [answers]
        );
    };


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(2);
    const answers = useAnswers(page, rowsPerPage);
    const answersIds = useAnswerIds(answers);
    const answersSelection = useSelection(answersIds);

    const handlePageChange = useCallback(
        (event, value) => {
            setPage(value);
        },
        []
    );

    const handleRowsPerPageChange = useCallback(
        (event) => {
            setRowsPerPage(event.target.value);
        },
        []
    );

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
        <AnswerTable
            count={data?.length}
            items={answers}
            onDeselectAll={answersSelection.handleDeselectAll}
            onDeselectOne={answersSelection.handleDeselectOne}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onSelectAll={answersSelection.handleSelectAll}
            onSelectOne={answersSelection.handleSelectOne}
            page={page}
            rowsPerPage={rowsPerPage}
            selected={answersSelection.selected}
        />
    )

}
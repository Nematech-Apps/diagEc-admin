import { useSelection } from 'src/hooks/use-selection';
import { applyPagination } from 'src/utils/apply-pagination';

import { useCallback, useMemo, useState, useEffect } from 'react';

import { QuestionTable } from './question-table';

import { getQuestionList } from 'src/firebase/firebaseServices';
import { OnSnapshot } from 'src/firebase/firebaseConfig';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';


import { QuestionFrSearchBar } from 'src/components/searchBar/questionFrSearchBar';


export const DisplayQuestionTable = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = OnSnapshot(
            getQuestionList(),
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


    const useQuestions = useMemo(() => {
        const filteredData = data.filter(
            (question) =>
                (question.libelleFr?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (question?.pilier?.libelleFr?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
        return applyPagination(filteredData, page, rowsPerPage);
    }, [data, searchTerm, page, rowsPerPage]);


    const useQuestionIds = useMemo(() => {
        return useQuestions?.map((question) => question.id);
    }, [useQuestions]);



    const questions = useQuestions;
    const questionsIds = useQuestionIds;
    const questionsSelection = useSelection(questionsIds);

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
            <QuestionFrSearchBar onSearch={handleSearch} />
            <QuestionTable
                count={data?.length}
                items={questions}
                onDeselectAll={questionsSelection.handleDeselectAll}
                onDeselectOne={questionsSelection.handleDeselectOne}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSelectAll={questionsSelection.handleSelectAll}
                onSelectOne={questionsSelection.handleSelectOne}
                page={page}
                rowsPerPage={rowsPerPage}
                selected={questionsSelection.selected}
            />
        </Stack>
    )

}
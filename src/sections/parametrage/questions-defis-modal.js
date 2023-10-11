import { useState, useEffect } from 'react';

import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import FolderIcon from '@heroicons/react/24/solid/FolderIcon';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardActions,
    CardHeader,
    Divider,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Stack,
    Modal,
    Fab,
    SvgIcon,
    List,
    ListItem,
    ListItemText
} from '@mui/material';

import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import ChevronLeftIcon from '@heroicons/react/24/solid/ChevronLeftIcon';
import ChevronRightIcon from '@heroicons/react/24/solid/ChevronRightIcon';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { addCategorie } from 'src/firebase/firebaseServices';
import { db, GetDoc, Doc, UpdateDoc } from 'src/firebase/firebaseConfig';
import ToastComponent from '../../components/toast';

import { updateSecteur } from 'src/firebase/firebaseServices';


const initialModalStyle = {
    position: 'fixed',
    bottom: '-40%', // Updated to take up 40% of the screen height
    left: 0,
    height: '55%', // Updated to take up 40% of the screen height
    width: '100%',
    backgroundColor: 'white',
    zIndex: 9999,
    transition: 'bottom 0.3s ease-in-out', // Update transition property
};

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9998,
};

export const QuestionsDefisModal = ({ handleClose, isOpen, data }) => {
    const [modalStyle, setModalStyle] = useState(initialModalStyle);

    const handleModalClose = () => {
        // Pour fermer le modal, faites glisser le modal vers la droite
        setModalStyle({ ...modalStyle, right: '-400px' });
        handleClose();
    };

    const handleModalOpen = () => {
        // For opening the modal, slide the modal up from the bottom
        setModalStyle({ ...modalStyle, bottom: '0' });
    };

    useEffect(() => {
        if (isOpen) {
            handleModalOpen();
        }
    }, [isOpen]);




    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(2);
    const [totalPage, setTotalPage] = useState(Math.ceil(data?.defis?.length / itemsPerPage));
    const [isFirstPage, setIsFirstPage] = useState(false);
    const [isLastPage, setIsLastPage] = useState(false);

    const getPaginatedItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data?.defis?.slice(startIndex, endIndex);
    }


    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setIsFirstPage(false);
            setIsLastPage(false);
        }
    }

    const handleNextPage = () => {
        const totalPages = Math.ceil(data?.defis?.length / itemsPerPage);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            setIsFirstPage(currentPage == 1);
        }
        setIsLastPage(currentPage == totalPage);
    }

    return (
        <div>
            {isOpen && <div style={overlayStyle} onClick={handleModalClose} />}
            <div style={modalStyle}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                    {/* <Button
                        variant="contained"
                        color="error"
                        type="button"
                        onClick={handleModalClose}
                    >
                        Fermer
                    </Button> */}
                    <Fab
                        variant="extended"
                        size="small"
                        color="default"
                        aria-label="info"
                        onClick={handleModalClose}
                    >
                        <SvgIcon fontSize="small">
                            <XCircleIcon />
                        </SvgIcon>
                    </Fab>
                </Box>
                <Card>
                    <CardHeader title={`${data?.defis?.length} défis`} />

                    <List sx={{}}>
                        {getPaginatedItems()?.map((defi, index) => {
                            const hasDivider = index < getPaginatedItems().length - 1;

                            return (
                                <ListItem
                                    divider={hasDivider}
                                    key={index}
                                >

                                    <ListItemText
                                        primary={defi.libelleFr}
                                        primaryTypographyProps={{ variant: 'subtitle1' }}
                                    />
                                    <Divider/>
                                </ListItem>

                            );

                        })}
                    </List>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Stack direction={'row'}
                            spacing={3} >
                            <Button
                                color="inherit"
                                endIcon={(
                                    <SvgIcon fontSize="small">
                                        <ChevronLeftIcon />
                                    </SvgIcon>
                                )}
                                size="small"
                                variant="outlined"
                                onClick={handlePreviousPage}
                                disabled={!isFirstPage}
                            >
                            </Button>
                            <Typography>{`${currentPage}/${totalPage}`}</Typography>
                            <Button
                                color="primary"
                                endIcon={(
                                    <SvgIcon fontSize="small">
                                        <ChevronRightIcon />
                                    </SvgIcon>
                                )}
                                size="small"
                                variant="outlined"
                                onClick={handleNextPage}
                                disabled={isLastPage}
                            >
                            </Button>


                        </Stack>
                    </CardActions>

                </Card>
            </div>
        </div>
    );
};
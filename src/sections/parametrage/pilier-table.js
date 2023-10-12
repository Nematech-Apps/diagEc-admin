import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';
import {
    Box,
    Button,
    Stack,
    Typography,
    Card,
    CardActions,
    CardHeader,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TableContainer,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Checkbox,
    Fab,
    Paper,
    Chip
} from '@mui/material';

import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';

import { SvgIcon } from '@mui/material';

import { EditPilier } from './edit-pilier';
import { deletePilier } from 'src/firebase/firebaseServices';
import { checkQuestionsInPilier } from 'src/firebase/firebaseServices';
import { AddMotCle } from './add-motCle';
import { deleteMotCle } from 'src/firebase/firebaseServices';
import ToastComponent from '../../components/toast';


import swal from 'sweetalert';

import * as emoji from 'node-emoji';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export const PilierTable = (props) => {
    const {
        count = 0,
        items = [],
        onDeselectAll,
        onDeselectOne,
        onPageChange = () => { },
        onRowsPerPageChange,
        onSelectAll,
        onSelectOne,
        page = 0,
        rowsPerPage = 0,
        selected = []
    } = props;

    const selectedSome = (selected.length > 0) && (selected.length < items.length);
    const selectedAll = (items.length > 0) && (selected.length === items.length);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    const [isAddMotCleOpen, setIsAddMotCleOpen] = useState(false);
    const [addMotCleData, setAddMotCle] = useState(null);

    const handleEditClick = (event, pilier) => {
        setModalData(pilier);
        setIsModalOpen(true);
    };

    const handleAddMotcleClick = (event, pilier) => {
        setAddMotCle(pilier);
        setIsAddMotCleOpen(true);
    }

    const handleDeleteMotCleclick = (event, pilier) => {
        confirmAlert({
            title: 'Attention⚠',
            message: 'Voulez-vous vraiment effectuer cette suppression ?',
            buttons: [
                {
                    label: 'Non',
                    style: {
                        backgroundColor: 'red'
                    }
                },
                {
                    label: 'Oui',
                    style: {
                        backgroundColor: 'white',
                        borderStyle: 'solid',
                        borderWidth: 2,
                        borderColor: 'limegreen',
                        color: 'black'
                    },
                    onClick: async () => {
                        deleteMotCle(pilier.id)
                            .then(() => {
                                return ToastComponent({ message: 'Opération effectué avec succès', type: 'success' });
                            })
                            .catch((err) => {
                                return ToastComponent({ message: err.message, type: 'error' });
                            });
                    }
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: false
        });
    }

    const handleDeleteClick = async (event, pilier) => {
        confirmAlert({
            title: 'Attention⚠',
            message: 'Voulez-vous vraiment effectuer cette suppression ?',
            buttons: [
                {
                    label: 'Non',
                    style: {
                        backgroundColor: 'red'
                    }
                },
                {
                    label: 'Oui',
                    style: {
                        backgroundColor: 'white',
                        borderStyle: 'solid',
                        borderWidth: 2,
                        borderColor: 'limegreen',
                        color: 'black'
                    },
                    onClick: async () => {
                        const hasQuestions = await checkQuestionsInPilier(pilier.id);
                        if (hasQuestions) {
                            return ToastComponent({ message: "Ce pilier est déjà lié à une ou des question(s). Vous devez d'abord supprimer cette(ces) question(s)", type: 'error' });
                        }
                        else {
                            deletePilier(pilier.id)
                                .then(() => {
                                    return ToastComponent({ message: 'Opération effectué avec succès', type: 'success' });
                                })
                                .catch((err) => {
                                    return ToastComponent({ message: err.message, type: 'error' });
                                });
                        }
                    }
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: false
        });


    };


    return (
        <Card elevation={20}>
        <CardHeader title="Piliers" />
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {/* <TableCell padding="checkbox">
                        <Checkbox
                            checked={selectedAll}
                            indeterminate={selectedSome}
                            onChange={(event) => {
                                if (event.target.checked) {
                                    onSelectAll?.();
                                } else {
                                    onDeselectAll?.();
                                }
                            }}
                        />
                    </TableCell> */}


                        <TableCell>
                            Libellé
                        </TableCell>

                        <TableCell>
                            Définition
                        </TableCell>

                        <TableCell>
                            Mots-clés
                        </TableCell>

                        <TableCell>
                            Actions
                        </TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        items.length != 0 ? 
                        items.map((pilier) => {
                            const isSelected = selected.includes(pilier.id);
                            //const createdAt = format(customer.createdAt, 'dd/MM/yyyy');

                            return (
                                <TableRow
                                    hover
                                    key={pilier.id}
                                    selected={isSelected}
                                >
                                    {/* <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={isSelected}
                                        onChange={(event) => {
                                            if (event.target.checked) {
                                                onSelectOne?.(secteur.id);
                                            } else {
                                                onDeselectOne?.(secteur.id);
                                            }
                                        }}
                                    />
                                </TableCell> */}

                                    <TableCell>
                                        <Stack
                                            alignItems="flex-start"
                                            direction="column"
                                            spacing={2}
                                        >
                                            {/* <Avatar src={customer.avatar}>
                                            {getInitials(customer.name)}
                                        </Avatar> */}

                                            <Typography variant="subtitle2">
                                                {pilier.libelleFr}
                                            </Typography>
                                            {/* <Typography variant="subtitle2">
                                            {pilier.libelleEn}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            {pilier.libelleIt}
                                        </Typography> */}
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack
                                            alignItems="flex-start"
                                            direction="column"
                                            spacing={2}
                                        >
                                            {/* <Avatar src={customer.avatar}>
                                            {getInitials(customer.name)}
                                        </Avatar> */}
                                            <Typography variant="subtitle2">
                                                {pilier.definitionFr}
                                            </Typography>
                                            {/* <Typography variant="subtitle2">
                                            {pilier.definitionEn}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            {pilier.definitionIt}
                                        </Typography> */}
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack
                                            alignItems="flex-start"
                                            direction="column"
                                            spacing={2}
                                        >

                                            <ul>
                                                {
                                                    pilier.motClesFr != null ? pilier.motClesFr.map((mot, index) => {
                                                        return (
                                                            <Chip label={mot} variant="outlined" key={index} />
                                                        )
                                                    }) : <Typography variant="subtitle2">
                                                        Aucun mot clé en français ajouté
                                                    </Typography>
                                                }

                                            </ul>



                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack
                                            alignItems="flex-start"
                                            direction={'row'}
                                            spacing={2}>
                                            <Stack direction={'column'}
                                                spacing={2}>
                                                <Button variant="outlined"
                                                    size="small"
                                                    color='success'
                                                    sx={{paddingX: 5}}
                                                    onClick={(event) => handleAddMotcleClick(event, pilier)}>
                                                    Ajouter
                                                    mot-clés
                                                </Button>
                                                {/* <Fab variant="extended" color='success' sx={{paddingX: 5}}
                                                onClick={(event) => handleAddMotcleClick(event, pilier)}>
                                                    <SvgIcon>
                                                        <PlusIcon/>
                                                    </SvgIcon>
                                                    mot-clés
                                                </Fab> */}
                                                <Button variant="outlined" size="small" color='error' sx={{paddingX: 5}}
                                                    onClick={(event) => handleDeleteMotCleclick(event, pilier)}>
                                                    Supprimer
                                                    mot-clés
                                                </Button>
                                                {/* <Fab variant="extended" color='error' sx={{paddingX: 5}}
                                                onClick={(event) => handleDeleteMotCleclick(event, pilier)}>
                                                    <SvgIcon>
                                                        <XCircleIcon/>
                                                    </SvgIcon>
                                                    mot-clés
                                                </Fab> */}
                                            </Stack>

                                            <Stack direction={'column'}
                                                spacing={2}>
                                                <Fab size="small"
                                                    //color="secondary"
                                                    aria-label="edit"
                                                    onClick={(event) => handleEditClick(event, pilier)}>
                                                    <SvgIcon fontSize="small">
                                                        <PencilIcon />
                                                    </SvgIcon>
                                                </Fab>
                                                <Fab size="small" color="error" aria-label="delete"
                                                    onClick={(event) => handleDeleteClick(event, pilier)}>
                                                    <SvgIcon fontSize="small">
                                                        <TrashIcon />
                                                    </SvgIcon>
                                                </Fab>
                                            </Stack>

                                        </Stack>
                                    </TableCell>

                                    {isModalOpen && modalData && <EditPilier data={modalData}
                                        isOpen={isModalOpen}
                                        handleClose={() => setIsModalOpen(false)} />}
                                    {isAddMotCleOpen && addMotCleData && <AddMotCle data={addMotCleData}
                                        isOpen={isAddMotCleOpen}
                                        handleClose={() => setIsAddMotCleOpen(false)} />}
                                </TableRow>
                            );
                        }) :
                            <TableRow
                                hover
                            >
                                <TableCell>
                                    <Stack
                                        alignItems="center"
                                        direction="row"
                                        spacing={2}
                                    >
                                        <Typography variant="subtitle2">
                                            Aucun élément à afficher
                                        </Typography>
                                    </Stack>
                                </TableCell>

                            </TableRow>
                    }

                </TableBody>
            </Table>
        </TableContainer>

        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
            <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                labelDisplayedRows={
                    ({ from, to, count }) => {
                        return '' + from + '-' + to + ' sur ' + count
                    }
                }
                labelRowsPerPage="Eléments par page"
            />
        </CardActions>
    </Card>
    );
};

PilierTable.propTypes = {
    count: PropTypes.number,
    items: PropTypes.array,
    onDeselectAll: PropTypes.func,
    onDeselectOne: PropTypes.func,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    onSelectAll: PropTypes.func,
    onSelectOne: PropTypes.func,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    selected: PropTypes.array
};

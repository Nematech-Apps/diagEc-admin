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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Checkbox,
    Fab
} from '@mui/material';

import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import EyeIcon from '@heroicons/react/24/solid/EyeIcon';

import { SvgIcon } from '@mui/material';

import { EditDefis } from './edit-defis';
import { DisplayFicheReflexe } from './display-fiche-reflexe';
import { deleteDefis, deleteFicheReflexeInStorage } from 'src/firebase/firebaseServices';
import { checkQuestionsInDefi } from 'src/firebase/firebaseServices';
import { ReplaceFiche } from './replaceFiche';
import ToastComponent from '../../components/toast';

import swal from 'sweetalert';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export const DefisTable = (props) => {
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

    const [isDisplayFileModalOpen, setIsDisplayFileModalOpen] = useState(false);
    const [displayFileModalData, setDisplayFileModalData] = useState(null);

    const [isReplaceFicheModalOpen, setIsReplaceFicheModalOpen] = useState(false);
    const [replaceFicheModalData, setReplaceFicheModalData] = useState(null);


    const handleEditClick = (event, defis) => {
        setModalData(defis);
        setIsModalOpen(true);
    };

    const handleShowFicheFr = (event, defis) => {
        setDisplayFileModalData(defis.ficheReflexeFr);
        setIsDisplayFileModalOpen(true);
    }

    const handleReplaceFicheClick = (event, defis) => {
        setReplaceFicheModalData(defis);
        setIsReplaceFicheModalOpen(true);
    };

    const handleDeleteClick = async (event, defis) => {
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
                        const hasQuestions = await checkQuestionsInDefi(defis.id);
                        if (hasQuestions) {
                            return ToastComponent({ message: "Ce défi est déjà lié à une ou des question(s). Vous devez d'abord supprimer cette(ces) question(s)", type: 'error' });
                        }
                        deleteDefis(defis.id)
                            .then(() => {
                                deleteFicheReflexeInStorage(defis.id, 'Fr')
                                    .then(() => {
                                        return ToastComponent({ message: 'Opération effectué avec succès', type: 'success' });
                                    })
                                    .catch((err) => {
                                        return ToastComponent({ message: err.message, type: 'error' });
                                    })

                                deleteFicheReflexeInStorage(defis.id, 'En')
                                    .then(() => {
                                        return ToastComponent({ message: 'Opération effectué avec succès', type: 'success' });
                                    })
                                    .catch((err) => {
                                        return ToastComponent({ message: err.message, type: 'error' });
                                    })

                                deleteFicheReflexeInStorage(defis.id, 'It')
                                    .then(() => {
                                        return ToastComponent({ message: 'Opération effectué avec succès', type: 'success' });
                                    })
                                    .catch((err) => {
                                        return ToastComponent({ message: err.message, type: 'error' });
                                    })
                            })
                            .catch((err) => {
                                return ToastComponent({ message: err.message, type: 'error' });
                            })
                    }
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: false
        });


    };

    return (
        <Card elevation={20}>
            <CardHeader title="Défis" />
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
                            Fiche réflexe
                        </TableCell>

                        <TableCell>
                            Actions
                        </TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        items.length != 0 ? items.map((defis) => {
                            const isSelected = selected.includes(defis.id);
                            //const createdAt = format(customer.createdAt, 'dd/MM/yyyy');

                            return (
                                <TableRow
                                    hover
                                    key={defis.id}
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
                                                {defis.libelleFr}
                                            </Typography>
                                            {/* <Typography variant="subtitle2">
                                                {defis.libelleEn}
                                            </Typography>
                                            <Typography variant="subtitle2">
                                                {defis.libelleIt}
                                            </Typography> */}

                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack
                                            alignItems="flex-start"
                                            direction="column"
                                            spacing={2}
                                        >
                                            {
                                                defis.ficheReflexeFr &&
                                                <Fab variant="extended" color="primary" size="medium"
                                                    onClick={(event) => handleShowFicheFr(event, defis)}>
                                                    
                                                    Fiche 
                                                    <SvgIcon sx={{ ml: 1 }}>
                                                        <EyeIcon />
                                                    </SvgIcon>
                                                </Fab>
                                                // <Button variant="text"
                                                //     onClick={(event) => handleShowFicheFr(event, defis)}>Voir fiche en français</Button>
                                            }

                                            
                                            {
                                                defis.ficheReflexeFr &&
                                                <Button variant="outlined"
                                                    onClick={(event) => handleReplaceFicheClick(event, defis)}>Remplacer</Button>
                                            }
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction={'row'}
                                            spacing={2}>
                                            <Fab size="small"
                                                //color="secondary"
                                                aria-label="edit"
                                                onClick={(event) => handleEditClick(event, defis)}>
                                                <SvgIcon fontSize="small">
                                                    <PencilIcon />
                                                </SvgIcon>
                                            </Fab>
                                            <Fab size="small" color="error" aria-label="delete"
                                                onClick={(event) => handleDeleteClick(event, defis)}>
                                                <SvgIcon fontSize="small">
                                                    <TrashIcon />
                                                </SvgIcon>
                                            </Fab>
                                        </Stack>
                                    </TableCell>
                                    {/* <TableCell>
                                        {customer.address.city}, {customer.address.state}, {customer.address.country}
                                    </TableCell>
                                    <TableCell>
                                        {customer.phone}
                                    </TableCell>
                                    <TableCell>
                                        {createdAt}
                                    </TableCell> */}
                                    {isModalOpen && modalData && <EditDefis data={modalData}
                                        isOpen={isModalOpen}
                                        handleClose={() => setIsModalOpen(false)} />}
                                    
                                    {isDisplayFileModalOpen && displayFileModalData && <DisplayFicheReflexe fileUrl={displayFileModalData}
                                        isOpen={isDisplayFileModalOpen}
                                        handleClose={() => setIsDisplayFileModalOpen(false)} />}
                                    
                                    {isReplaceFicheModalOpen && replaceFicheModalData && <ReplaceFiche data={replaceFicheModalData}
                                        isOpen={isReplaceFicheModalOpen}
                                        handleClose={() => setIsReplaceFicheModalOpen(false)} />}
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

DefisTable.propTypes = {
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

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
import DocumentIcon from '@heroicons/react/24/solid/DocumentIcon';

import { SvgIcon } from '@mui/material';

import { EditDefis } from './edit-defis';
import { DisplayFicheReflexe } from './display-fiche-reflexe';
import { deleteDefis, deleteFicheReflexeInStorage } from 'src/firebase/firebaseServices';
import { checkQuestionsInDefi } from 'src/firebase/firebaseServices';
import ToastComponent from '../../components/toast';



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


    const handleEditClick = (event, defis) => {
        setModalData(defis);
        setIsModalOpen(true);
    };

    const handleShowFicheFr = (event, defis) => {
        setDisplayFileModalData(defis.ficheReflexeFr);
        setIsDisplayFileModalOpen(true);
    }

    const handleShowFicheEn = (event, defis) => {
        setDisplayFileModalData(defis.ficheReflexeEn);
        setIsDisplayFileModalOpen(true);
    }

    const handleShowFicheIt = (event, defis) => {
        setDisplayFileModalData(defis.ficheReflexeIt);
        setIsDisplayFileModalOpen(true);
    }

    const handleDeleteClick = async(event, defis) => {
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
                            Libellés
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
                                                <ul>
                                                    <li>{defis.libelleFr}</li>
                                                    <li>{defis.libelleEn}</li>
                                                    <li>{defis.libelleIt}</li>
                                                </ul>
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
                                                <Button variant="outlined"
                                                    onClick={(event) => handleShowFicheFr(event, defis)}>Voir fiche en français</Button>
                                            }
                                            {
                                                defis.ficheReflexeEn &&
                                                <Button variant="outlined"
                                                    onClick={(event) => handleShowFicheEn(event, defis)}>Voir fiche en anglais</Button>
                                            }
                                            {
                                                defis.ficheReflexeIt &&
                                                <Button variant="outlined"
                                                    onClick={(event) => handleShowFicheIt(event, defis)}>Voir fiche en italien</Button>
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

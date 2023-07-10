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

import { SvgIcon } from '@mui/material';

import { EditPilier } from './edit-pilier';
import { deletePilier } from 'src/firebase/firebaseServices';
import { AddMotCle } from './add-motCle';
import ToastComponent from '../../components/toast';



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

    const handleDeleteClick = (event, pilier) => {
        deletePilier(pilier.id)
            .then(() => {
                return ToastComponent({ message: 'Opération effectué avec succès', type: 'success' });
            })
            .catch((err) => {
                return ToastComponent({ message: err.message, type: 'error' });
            })
    };

    return (
        <Card >
            <CardHeader title="Piliers" />
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
                        items.length != 0 ? items.map((pilier) => {
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
                                            alignItems="center"
                                            direction="row"
                                            spacing={2}
                                        >
                                            {/* <Avatar src={customer.avatar}>
                                                {getInitials(customer.name)}
                                            </Avatar> */}
                                            <Typography variant="subtitle2">
                                                {pilier.libelle}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack
                                            alignItems="center"
                                            direction="row"
                                            spacing={2}
                                        >
                                            {/* <Avatar src={customer.avatar}>
                                                {getInitials(customer.name)}
                                            </Avatar> */}
                                            <Typography variant="subtitle2">
                                                {pilier.definition}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack
                                            alignItems="center"
                                            direction="row"
                                            spacing={2}
                                        >

                                            <ul>
                                                {
                                                    pilier.motCles != null ? pilier.motCles.map((mot, index) => {
                                                        return (
                                                            <li key={index}>{mot}</li>
                                                        )
                                                    }) : <Typography variant="subtitle2">
                                                        Aucun mot clé ajouté
                                                    </Typography>
                                                }

                                            </ul>

                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction={'row'} spacing={2}>
                                            <Stack direction={'column'} spacing={2}>
                                                <Button variant="outlined" size="small" color='success'
                                                    onClick={(event) => handleAddMotcleClick(event, pilier)}>
                                                    Ajouter mot-clés
                                                </Button>
                                                {/* <Button variant="outlined" size="small" color='warning'
                                                    onClick={(event) => handleAddMotcleClick(event, pilier)}>
                                                    Modifier mot-clés
                                                </Button> */}
                                            </Stack>

                                            <Stack direction={'column'} spacing={2}>
                                                <Fab size="small" color="secondary" aria-label="edit"
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

                                    {isModalOpen && modalData && <EditPilier data={modalData} isOpen={isModalOpen} handleClose={() => setIsModalOpen(false)} />}
                                    {isAddMotCleOpen && addMotCleData && <AddMotCle data={addMotCleData} isOpen={isAddMotCleOpen} handleClose={() => setIsAddMotCleOpen(false)} />}
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

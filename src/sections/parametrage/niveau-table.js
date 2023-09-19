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

import { EditNiveau } from './edit-niveau';
import { deleteNiveau } from 'src/firebase/firebaseServices';
import { checkCategoriesInNiveau } from 'src/firebase/firebaseServices';
import { checkCompaniesInNiveau } from 'src/firebase/firebaseServices';
import ToastComponent from '../../components/toast';



export const NiveauTable = (props) => {
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

    const handleEditClick = (event, niveau) => {
        setModalData(niveau);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (event, niveau) => {
        const hasCategories = await checkCategoriesInNiveau(niveau.id);
        const hasCompanies = await checkCompaniesInNiveau(niveau.id);
        if (hasCategories) {
            return ToastComponent({ message: "Ce niveau est déjà lié à une ou des catégorie(s). Vous devez d'abord supprimer cette(ces) catégorie(s)", type: 'error' });
        }
        else if (hasCompanies) {
            return ToastComponent({ message: "Ce niveau contient déjà une ou des entreprise(s). Vous devez d'abord supprimer cette(ces) entreprise(s)", type: 'error' });
        }
        else {
            deleteNiveau(niveau.id)
                .then(() => {
                    return ToastComponent({ message: 'Opération effectué avec succès', type: 'success' });
                })
                .catch((err) => {
                    return ToastComponent({ message: err.message, type: 'error' });
                })
        }

    };

    return (
        <Card elevation={20}>
            <CardHeader title="Niveaux" />
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
                            Libellé(Français)
                        </TableCell>

                        <TableCell>
                            Libellé(Anglais)
                        </TableCell>

                        <TableCell>
                            Libellé(Italien)
                        </TableCell>

                        <TableCell>
                            Actions
                        </TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        items.length != 0 ? items.map((niveau) => {
                            const isSelected = selected.includes(niveau.id);
                            //const createdAt = format(customer.createdAt, 'dd/MM/yyyy');

                            return (
                                <TableRow
                                    hover
                                    key={niveau.id}
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
                                                {niveau.libelleFr}
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
                                                {niveau.libelleEn}
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
                                                {niveau.libelleIt}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction={'row'}
                                            spacing={2}>
                                            <Fab size="small"
                                                //color="secondary"
                                                aria-label="edit"
                                                onClick={(event) => handleEditClick(event, niveau)}>
                                                <SvgIcon fontSize="small">
                                                    <PencilIcon />
                                                </SvgIcon>
                                            </Fab>
                                            <Fab size="small" color="error" aria-label="delete"
                                                onClick={(event) => handleDeleteClick(event, niveau)}>
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
                                    {isModalOpen && modalData && <EditNiveau data={modalData}
                                        isOpen={isModalOpen}
                                        handleClose={() => setIsModalOpen(false)} />}
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

NiveauTable.propTypes = {
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

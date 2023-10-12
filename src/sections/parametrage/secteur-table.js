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
    TableContainer,
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

import { EditSecteur } from './edit-secteur';
import { deleteSecteur } from 'src/firebase/firebaseServices';
import { checkCategoriesInSecteur } from 'src/firebase/firebaseServices';
import { checkCompaniesInSecteur } from 'src/firebase/firebaseServices';
import ToastComponent from '../../components/toast';


import SweetAlert from 'src/components/SweetAlert';

import swal from 'sweetalert';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export const SecteurTable = (props) => {
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

    const handleEditClick = (event, secteur) => {
        setModalData(secteur);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (event, secteur) => {
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
                        const hasCategories = await checkCategoriesInSecteur(secteur.id);
                        const hasCompanies = await checkCompaniesInSecteur(secteur.id);
                        if (hasCategories) {
                            return ToastComponent({ message: "Ce secteur est déjà lié à une ou des catégorie(s). Vous devez d'abord supprimer cette(ces) catégorie(s)", type: 'error' });
                        }
                        else if (hasCompanies) {
                            return ToastComponent({ message: "Ce secteur contient déjà une ou des entreprise(s). Vous devez d'abord supprimer cette(ces) entreprise(s)", type: 'error' });
                        }
                        else {
                            deleteSecteur(secteur.id)
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
                <CardHeader title="Secteurs" />
                <Table >
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
                            items.length != 0 ?
                            items
                                    .sort((a, b) => a.libelleFr.localeCompare(b.libelleFr))
                                    .map((secteur) => {
                                        const isSelected = selected.includes(secteur.id);
                                        //const createdAt = format(customer.createdAt, 'dd/MM/yyyy');

                                        return (
                                            <TableRow
                                                hover
                                                key={secteur.id}
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
                                                <TableCell >
                                                    <Stack
                                                        alignItems="center"
                                                        direction="row"
                                                        spacing={2}
                                                    >
                                                        {/* <Avatar src={customer.avatar}>
                                                {getInitials(customer.name)}
                                            </Avatar> */}
                                                        <Typography variant="subtitle2">
                                                            {secteur.libelleFr}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell >
                                                    <Stack
                                                        alignItems="center"
                                                        direction="row"
                                                        spacing={2}
                                                    >
                                                        {/* <Avatar src={customer.avatar}>
                                                {getInitials(customer.name)}
                                            </Avatar> */}
                                                        <Typography variant="subtitle2">
                                                            {secteur.libelleEn}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell >
                                                    <Stack
                                                        alignItems="center"
                                                        direction="row"
                                                        spacing={2}
                                                    >
                                                        {/* <Avatar src={customer.avatar}>
                                                {getInitials(customer.name)}
                                            </Avatar> */}
                                                        <Typography variant="subtitle2">
                                                            {secteur.libelleIt}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction={'row'}
                                                        spacing={2}>
                                                        <Fab size="small"
                                                            //color="secondary"
                                                            aria-label="edit"
                                                            onClick={(event) => handleEditClick(event, secteur)}>
                                                            <SvgIcon fontSize="small">
                                                                <PencilIcon />
                                                            </SvgIcon>
                                                        </Fab>
                                                        <Fab size="small" color="error" aria-label="delete"
                                                            onClick={(event) => handleDeleteClick(event, secteur)}>
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
                                                {isModalOpen && modalData && <EditSecteur data={modalData}
                                                    isOpen={isModalOpen}
                                                    handleClose={() => setIsModalOpen(false)} />}
                                            </TableRow>
                                        );
                                    }) : (
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
                                )
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
                        rowsPerPageOptions={[2, 5, 10]}
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

SecteurTable.propTypes = {
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

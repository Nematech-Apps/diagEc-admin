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

import { EditAnswer } from './edit-answer';
import { EditQuestion } from './edit-question';
import { deleteQuestion } from 'src/firebase/firebaseServices';
import ToastComponent from '../../components/toast';



export const QuestionTable = (props) => {
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

    const handleEditClick = (event, answer) => {
        setModalData(answer);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (event, question) => {
        deleteQuestion(question.id)
            .then(() => {
                return ToastComponent({ message: 'Opération effectué avec succès', type: 'success' });
            })
            .catch((err) => {
                return ToastComponent({ message: err.message, type: 'error' });
            })
    };

    return (
        <Card elevation={20}>
            <CardHeader title="Questions" />
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
                            Pilier
                        </TableCell>

                        <TableCell>
                            Actions
                        </TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        items.length != 0 ? items.map((question) => {
                            const isSelected = selected.includes(question.id);
                            //const createdAt = format(customer.createdAt, 'dd/MM/yyyy');

                            return (
                                <TableRow
                                    hover
                                    key={question.id}
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
                                                    <li>{question.libelleFr}</li>
                                                    <li>{question.libelleEn}</li>
                                                    <li>{question.libelleIt}</li>
                                                </ul>
                                            </Typography>
                                            {/* <Typography variant="subtitle2">
                                                {question.libelleEn}
                                            </Typography>
                                            <Typography variant="subtitle2">
                                                {question.libelleIt}
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
                                                {question.pilier.libelleFr}
                                            </Typography>
                                            {/* <Typography variant="subtitle2">
                                                {question.pilier.libelleEn}
                                            </Typography>
                                            <Typography variant="subtitle2">
                                                {question.pilier.libelleIt}
                                            </Typography> */}
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction={'row'}
                                            spacing={2}>
                                            <Fab size="small" color="secondary" aria-label="edit"
                                                onClick={(event) => handleEditClick(event, question)}>
                                                <SvgIcon fontSize="small">
                                                    <PencilIcon />
                                                </SvgIcon>
                                            </Fab>
                                            <Fab size="small" color="error" aria-label="delete"
                                                onClick={(event) => handleDeleteClick(event, question)}>
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
                                    {isModalOpen && modalData && <EditQuestion data={modalData}
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

QuestionTable.propTypes = {
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

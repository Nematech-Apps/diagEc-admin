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
import ArchiveBoxXMarkIcon from '@heroicons/react/24/solid/ArchiveBoxXMarkIcon';

import { SvgIcon } from '@mui/material';

import { EditAnswer } from './edit-answer';
import { QuestionsDefisModal } from './questions-defis-modal';
import { EditQuestion } from './edit-question';
import { deleteQuestion } from 'src/firebase/firebaseServices';
import ToastComponent from '../../components/toast';

import swal from 'sweetalert';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

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

    const handleEditClick = (event, question) => {
        setModalData(question);
        setIsModalOpen(true);
    };


    const [isModal2Open, setIsModal2Open] = useState(false);
    const [modal2Data, setModal2Data] = useState(null);

    const handleShowDefisClick = (event, answer) => {
        setModal2Data(answer);
        setIsModal2Open(true);
    };

    const handleDeleteClick = (event, question) => {
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
                        deleteQuestion(question.id)
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


    };

    return (
        <Card elevation={20}>
            <CardHeader title="Questions" />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
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
                        </TableCell>

                        <TableCell>
                            Libellé
                        </TableCell>

                        <TableCell>
                            Pilier
                        </TableCell>

                        <TableCell>
                            Défis
                        </TableCell>

                        <TableCell>
                            Poids
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
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={(event) => {
                                                if (event.target.checked) {
                                                    onSelectOne?.(question.id);
                                                } else {
                                                    onDeselectOne?.(question.id);
                                                }
                                            }}
                                        />
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
                                                {question.libelleFr}
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
                                        <Stack
                                            alignItems="flex-start"
                                            direction="column"
                                            spacing={2}
                                        >

                                            <Typography variant="subtitle2">
                                                {question?.defi?.libelleFr}
                                            </Typography>

                                            <Button variant="outlined"
                                                onClick={(event) => handleShowDefisClick(event, question)}>voir défis</Button>
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
                                                {question.poids}
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
                                            <Fab size="small" color="inherit" aria-label="edit"
                                                onClick={(event) => handleEditClick(event, question)} disabled={!isSelected}>
                                                <SvgIcon fontSize="small">
                                                    <PencilIcon />
                                                </SvgIcon>
                                            </Fab>
                                            <Fab size="small" color="error" aria-label="delete"
                                                onClick={(event) => handleDeleteClick(event, question)} disabled={!isSelected}>
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

                                    {isModal2Open && modal2Data && <QuestionsDefisModal data={modal2Data}
                                        isOpen={isModal2Open}
                                        handleClose={() => setIsModal2Open(false)} />}
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
                <Stack direction={'row'} spacing={3}>
                    {
                        (selected.length > 0 && selected.length > 1 && selected.length < items.length) &&
                        (
                            <Button variant='text' color='error' size='small' disabled={!(selected.length > 0 && selected.length < items.length)}>
                                <Stack direction={'row'} >
                                    <SvgIcon>
                                        <TrashIcon />
                                    </SvgIcon>
                                    <Typography>Supprimer {selected.length} éléments</Typography>
                                </Stack>
                            </Button>
                        )
                    }
                    <Button variant='text' color='error' size='small' disabled={!selectedAll}>
                        <Stack direction={'row'} spacing={1}>
                            <SvgIcon>
                                <ArchiveBoxXMarkIcon />
                            </SvgIcon>
                            <Typography>Vider</Typography>
                        </Stack>
                    </Button>
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
                </Stack>
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

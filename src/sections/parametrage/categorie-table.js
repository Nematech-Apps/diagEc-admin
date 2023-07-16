import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import ArrowLeftIcon from '@heroicons/react/24/solid/ArrowLeftIcon';
import ArrowLongLeftIcon from '@heroicons/react/24/solid/ArrowLongLeftIcon';
import ArrowLongRightIcon from '@heroicons/react/24/solid/ArrowLongRightIcon';
import ChevronLeftIcon from '@heroicons/react/24/solid/ChevronLeftIcon';
import ChevronRightIcon from '@heroicons/react/24/solid/ChevronRightIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import FolderIcon from '@heroicons/react/24/solid/FolderIcon';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardHeader,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    SvgIcon,
    Typography,
    Stack,
    Menu,
    MenuItem,
    ListItemIcon,
    Fab
} from '@mui/material';

import { EditCategorie } from './edit-categorie';
import { deleteCategorie } from 'src/firebase/firebaseServices';
import ToastComponent from '../../components/toast';

export const CategorieTable = (props) => {
    const { products = [], sx } = props;

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const [totalPage, setTotalPage] = useState(Math.ceil(products.length / itemsPerPage));
    const [isFirstPage, setIsFirstPage] = useState(false);
    const [isLastPage, setIsLastPage] = useState(false);

    const getPaginatedItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return products.slice(startIndex, endIndex);
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setIsFirstPage(false);
            setIsLastPage(false);
        }
    }

    const handleNextPage = () => {
        const totalPages = Math.ceil(products.length / itemsPerPage);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            setIsFirstPage(currentPage == 1);
        }
        setIsLastPage(currentPage == totalPage);
    }


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    const handleEditClick = (event, categorie) => {
        setModalData(categorie);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (event, categorie) => {
        deleteCategorie(categorie.id)
            .then(() => {
                return ToastComponent({ message: 'Opération effectué avec succès', type: 'success' });
            })
            .catch((err) => {
                return ToastComponent({ message: err.message, type: 'error' });
            })
    };


    return (
        <Card sx={sx} elevation={20}>
            <CardHeader title="Catégories" />
            <List>
                {getPaginatedItems().map((categorie, index) => {
                    const hasDivider = index < getPaginatedItems().length - 1;
                    //const ago = formatDistanceToNow(pro.updatedAt);


                    return (
                        <ListItem
                            divider={hasDivider}
                            key={index}
                        >
                            {/* <ListItemAvatar>
                                {
                                    product.image
                                        ? (
                                            <Box
                                                component="img"
                                                src={product.image}
                                                sx={{
                                                    borderRadius: 1,
                                                    height: 48,
                                                    width: 48
                                                }}
                                            />
                                        )
                                        : (
                                            <Box
                                                sx={{
                                                    borderRadius: 1,
                                                    backgroundColor: 'neutral.200',
                                                    height: 48,
                                                    width: 48
                                                }}
                                            />
                                        )
                                }
                            </ListItemAvatar> */}
                            <ListItemText
                                primary={categorie.libelle}
                                primaryTypographyProps={{ variant: 'subtitle1' }}
                                //secondary={`Updated ${ago} ago`}
                                secondaryTypographyProps={{ variant: 'body2' }}
                            />
                            <ListItemText
                                primary={categorie.secteurAppartenance.libelle}
                                primaryTypographyProps={{ variant: 'subtitle1' }}
                                //secondary={`Updated ${ago} ago`}
                                secondaryTypographyProps={{ variant: 'body2' }}
                            />
                            <ListItemText
                                primary={categorie.niveauAppartenance.libelle}
                                primaryTypographyProps={{ variant: 'subtitle1' }}
                                //secondary={`Updated ${ago} ago`}
                                secondaryTypographyProps={{ variant: 'body2' }}
                            />
                            <Fab size="small" color="secondary" aria-label="edit" sx={{ marginRight: 1 }}
                                onClick={(event) => handleEditClick(event, categorie)} >
                                <SvgIcon fontSize="small" >
                                    <PencilIcon />
                                </SvgIcon>
                            </Fab>

                            {/* <Fab size="small" color="error" aria-label="delete" sx={{ marginRight: 1 }}
                                onClick={(event) => handleDeleteClick(event, categorie)}>
                                <SvgIcon fontSize="small">
                                    <TrashIcon />
                                </SvgIcon>
                            </Fab> */}

                            {/* <Fab size="small" color="neutral" aria-label="load" sx={{ marginRight: 1 }}>
                                <SvgIcon fontSize="small">
                                    <FolderIcon />
                                </SvgIcon>
                            </Fab> */}

                            {/* <IconButton
                                edge="end"
                                onClick={handleClick}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <SvgIcon>
                                    <EllipsisVerticalIcon />
                                </SvgIcon>
                            </IconButton> */}

                            {/* <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >


                                <MenuItem onClick={(event) => handleEditClick(event, categorie)} >
                                    <Fab size="small" color="secondary" aria-label="edit" sx={{ marginRight: 1 }}
                                    >
                                        <SvgIcon fontSize="small" >
                                            <PencilIcon />
                                        </SvgIcon>
                                    </Fab>
                                    <Typography > Editer</Typography>
                                </MenuItem>

                                <MenuItem >
                                    <Fab size="small" color="warning" aria-label="delete" sx={{ marginRight: 1 }}>
                                        <SvgIcon fontSize="small">
                                            <TrashIcon />
                                        </SvgIcon>
                                    </Fab>
                                    <Typography >Supprimer</Typography>

                                </MenuItem>
                                <MenuItem >
                                    <Fab size="small" color="neutral" aria-label="load" sx={{ marginRight: 1 }}>
                                        <SvgIcon fontSize="small">
                                            <FolderIcon />
                                        </SvgIcon>
                                    </Fab>
                                    <Typography >Charger questions</Typography>
                                </MenuItem>
                            </Menu> */}

                            {isModalOpen && modalData && <EditCategorie data={modalData} isOpen={isModalOpen} handleClose={() => setIsModalOpen(false)} />}
                        </ListItem>

                    );

                })}
            </List>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                <Stack direction={'row'} spacing={3} >
                    <Button
                        color="inherit"
                        endIcon={(
                            <SvgIcon fontSize="small">
                                <ChevronLeftIcon />
                            </SvgIcon>
                        )}
                        size="small"
                        variant="text"
                        onClick={handlePreviousPage}
                        disabled={!isFirstPage}
                    >
                    </Button>
                    <Typography>{`${currentPage}/${totalPage} de ${products.length} éléments`}</Typography>
                    <Button
                        color="inherit"
                        endIcon={(
                            <SvgIcon fontSize="small">
                                <ChevronRightIcon />
                            </SvgIcon>
                        )}
                        size="small"
                        variant="text"
                        onClick={handleNextPage}
                        disabled={isLastPage}
                    >
                    </Button>


                </Stack>
            </CardActions>

        </Card>
    );
};

CategorieTable.propTypes = {
    products: PropTypes.array,
    sx: PropTypes.object
};

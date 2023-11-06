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
    SvgIcon
} from '@mui/material';

import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { addCategorie } from 'src/firebase/firebaseServices';
import { db, GetDoc, Doc, UpdateDoc } from 'src/firebase/firebaseConfig';
import ToastComponent from '../../components/toast';

import { updateSecteur } from 'src/firebase/firebaseServices';


const initialModalStyle = {
    position: 'fixed',
    top: 0,
    right: '-400px', // Le modal est initialisé en dehors de l'écran
    height: '100%',
    width: '400px',
    backgroundColor: 'white',
    zIndex: 9999,
    transition: 'right 0.3s ease-in-out',
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

export const CompanyModalDetails = ({ handleClose, isOpen, data }) => {
    const [modalStyle, setModalStyle] = useState(initialModalStyle);

    const handleModalClose = () => {
        // Pour fermer le modal, faites glisser le modal vers la droite
        setModalStyle({ ...modalStyle, right: '-400px' });
        handleClose();
    };

    const handleModalOpen = () => {
        // Pour ouvrir le modal, faites glisser le modal depuis la droite
        setModalStyle({ ...modalStyle, right: '0' });
    };

    useEffect(() => {
        if (isOpen) {
            handleModalOpen();
        }
    }, [isOpen]);

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
                    <CardHeader title="Informations détaillées de l'entreprise" />
                    <Divider />
                    <CardContent>
                        <Stack direction={'column'} spacing={3} sx={{ maxWidth: 400 }}>
                            <Typography
                                color="text.secondary"
                                display="inline"
                                variant="body2"
                            >
                                Email : {data.email}
                            </Typography>

                            <Typography
                                color="text.secondary"
                                display="inline"
                                variant="body2"
                            >
                                Raison sociale : {data.raisonSociale}
                            </Typography>

                            <Typography
                                color="text.secondary"
                                display="inline"
                                variant="body2"
                            >
                                Secteur : {data.secteurAppartenance.libelle}
                            </Typography>

                            <Typography
                                color="text.secondary"
                                display="inline"
                                variant="body2"
                            >
                                Niveau : {data.niveauAppartenance.libelle}
                            </Typography>

                            <Typography
                                color="text.secondary"
                                display="inline"
                                variant="body2"
                            >
                                Poste : {data.poste}
                            </Typography>

                            <Typography
                                color="text.secondary"
                                display="inline"
                                variant="body2"
                            >
                                Nombre de salariés : {data.nbreSalaries}
                            </Typography>

                            <Typography
                                color="text.secondary"
                                display="inline"
                                variant="body2"
                            >
                                Adresse : {data.adresse}
                            </Typography>
                        </Stack>
                    </CardContent>
                    <Divider />

                </Card>
            </div>
        </div>
    );
};
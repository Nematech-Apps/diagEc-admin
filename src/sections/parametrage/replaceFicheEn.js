import { useState, useEffect, useMemo, useLayoutEffect } from 'react';

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
    SvgIcon,
    Input,
    Modal
} from '@mui/material';

import DocumentIcon from '@heroicons/react/24/solid/DocumentIcon';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { uploadFicheReflexe, updateFicheReflexionCollection } from 'src/firebase/firebaseServices';
import { db, GetDoc, Doc, UpdateDoc } from 'src/firebase/firebaseConfig';
import ToastComponent from '../../components/toast';

import { updateDefis } from 'src/firebase/firebaseServices';

import { FileUploader } from "react-drag-drop-files";

import FileDropZone from 'src/components/fileDropZone';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    minHeight: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    //borderRadius: 4
};

export const ReplaceFicheEn = ({ handleClose, isOpen, data }) => {


    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFilesSelected = (files) => {
        setSelectedFiles(files);
    };

    const handleReplaceFiche = async () => {
        if (selectedFiles.length != 0) {
            const collectionRef = Doc(db, 'defis', data.id);
            const snapshot = await GetDoc(collectionRef);

            selectedFiles.map((file) => {
                uploadFicheReflexe(file, data.id, 'En')
                    .then((url) => {
                        const docData = {
                            ...snapshot.data(),
                            id: data.id,
                            ficheReflexeEn: url
                        };
                        UpdateDoc(collectionRef, docData)
                            .then(() => {
                                updateFicheReflexionCollection(url)
                                    .then(async (doc) => {
                                        const collectionRef = Doc(db, 'ficheReflexes', doc.id);
                                        const snapshot = await GetDoc(collectionRef);

                                        const docData = {
                                            ...snapshot.data(),
                                            id: doc.id,
                                        };

                                        UpdateDoc(collectionRef, docData)
                                            .then(() => {
                                                setSelectedFiles(null);
                                                handleClose();
                                                return ToastComponent({ message: 'Opération effectuée avec succès', type: 'success' });
                                            })
                                            .catch((err) => {
                                                return ToastComponent({ message: err.message, type: 'error' });
                                            })
                                    })
                                    .catch((err) => {
                                        return ToastComponent({ message: err.message, type: 'error' });
                                    })

                            })
                            .catch((err) => {
                                return ToastComponent({ message: err.message, type: 'error' });
                            })
                    })
                    .catch((err) => {
                        return ToastComponent({ message: err.message, type: 'error' });
                    })
            })
        }


    }


    return (
        <div>
            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Card sx={{ minHeight: 200 }}>
                        <CardHeader
                            //subheader="catégorie"
                            title="Remplacer la fiche réflexe"
                        />
                        <Divider />
                        <CardContent>
                            <Stack
                                direction={'column'}
                                spacing={3}
                                sx={{ maxWidth: 400 }}
                            >


                                <FileDropZone allowMultiple={false} onFilesSelected={handleFilesSelected} />



                            </Stack>

                            {selectedFiles?.length == 0 && (
                                <Typography
                                    color="error"
                                    sx={{ mt: 3 }}
                                    variant="body2"
                                >
                                    Vous devez sélectionner la fiche
                                </Typography>
                            )}

                        </CardContent>
                        <Divider />
                        <CardActions sx={{ justifyContent: 'center' }}>
                            <Button variant="contained" color='warning'
                                type='button' onClick={handleClose}>
                                Annuler
                            </Button>
                            <Button variant="contained"
                                type='button' onClick={handleReplaceFiche}>
                                Remplacer
                            </Button>
                        </CardActions>
                    </Card>
                </Box>
            </Modal>
        </div>
    );

}
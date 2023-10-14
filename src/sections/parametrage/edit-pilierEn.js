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
    Modal
} from '@mui/material';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { addCategorie } from 'src/firebase/firebaseServices';
import { db, GetDoc, Doc, UpdateDoc } from 'src/firebase/firebaseConfig';
import ToastComponent from '../../components/toast';

import { updatePilierEn } from 'src/firebase/firebaseServices';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    //borderRadius: 4
};

export const EditPilierEn = ({ handleClose, isOpen, data }) => {

    const formik = useFormik({
        initialValues: {
            libelleEn: data.libelleEn,
            definitionEn: data.definitionEn,
            submit: null
        },
        validationSchema: Yup.object({
            libelleEn: Yup
                .string()
                .max(255)
                .required("Le libellé en anglais est requis"),
            definitionEn: Yup
                .string()
                .required("La definition en anglais est requise"),
        }),
        onSubmit: async (values, helpers) => {
            updatePilierEn(values, data.id)
                .then(() => {
                    helpers.resetForm();
                    handleClose();
                    return ToastComponent({ message: 'Opération effectué avec succès', type: 'success' });
                })
                .catch((err) => {
                    helpers.setStatus({ success: false });
                    helpers.setErrors({ submit: err.message });
                    helpers.setSubmitting(false);
                    return ToastComponent({ message: err.message, type: 'error' });
                })

        }
    });



    return (
        <div>
            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <form noValidate
                        onSubmit={formik.handleSubmit}>
                        <Card>
                            <CardHeader
                                //subheader="catégorie"
                                title="Modifier le pilier"
                            />
                            <Divider />
                            <CardContent>
                                <Stack
                                    direction={'column'}
                                    spacing={3}
                                    sx={{ maxWidth: 800 }}
                                >
                                    <Stack
                                        direction={'row'}
                                        spacing={3}
                                        sx={{ maxWidth: 800 }}
                                    >

                                        <TextField
                                            error={!!(formik.touched.libelleEn && formik.errors.libelleEn)}
                                            fullWidth
                                            helperText={formik.touched.libelleEn && formik.errors.libelleEn}
                                            label="Libellé en anglais"
                                            name="libelleEn"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            type="text"
                                            value={formik.values.libelleEn}
                                        />

                                        
                                    </Stack>



                                   

                                    <TextField
                                        error={!!(formik.touched.definitionEn && formik.errors.definitionEn)}
                                        fullWidth
                                        helperText={formik.touched.definitionEn && formik.errors.definitionEn}
                                        label="Définition en anglais"
                                        name="definitionEn"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.definitionEn}
                                    />

                                    


                                </Stack>

                                {formik.errors.submit && (
                                    <Typography
                                        color="error"
                                        sx={{ mt: 3 }}
                                        variant="body2"
                                    >
                                        {formik.errors.submit}
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
                                    type='submit'>
                                    Mettre à jour
                                </Button>
                            </CardActions>
                        </Card>
                    </form>
                </Box>
            </Modal>
        </div>
    );

}
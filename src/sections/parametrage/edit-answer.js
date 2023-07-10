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

import { updateNiveau } from 'src/firebase/firebaseServices';
import { updateAnswer } from 'src/firebase/firebaseServices';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
};

export const EditAnswer = ({ handleClose, isOpen, data }) => {

    const formik = useFormik({
        initialValues: {
            libelle: data.libelle,
            point: data.point,
            submit: null
        },
        validationSchema: Yup.object({
            libelle: Yup
                .string()
                .max(255)
                .required("Le libellé est requis"),
            point: Yup
                .number()
                .max(255)
                .required("Le point est requis"),
        }),
        onSubmit: async (values, helpers) => {
            updateAnswer(values, data.id)
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
                                title="Modifier Réponse"
                            />
                            <Divider />
                            <CardContent>
                                <Stack
                                    direction={'column'}
                                    spacing={3}
                                    sx={{ maxWidth: 400 }}
                                >
                                    {/* <ImagePicker /> */}

                                    <TextField
                                        error={!!(formik.touched.libelle && formik.errors.libelle)}
                                        fullWidth
                                        helperText={formik.touched.libelle && formik.errors.libelle}
                                        label="Libellé"
                                        name="libelle"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.libelle}
                                    />

                                    <TextField
                                        error={!!(formik.touched.point && formik.errors.point)}
                                        fullWidth
                                        helperText={formik.touched.point && formik.errors.point}
                                        label="Point"
                                        name="point"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="number"
                                        value={formik.values.point}
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
                            <CardActions sx={{ justifyContent: 'flex-end' }}>
                                <Button variant="contained" type='submit'>
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
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

import { addCategorie } from 'src/firebase/firebaseServices';
import { db, GetDoc, Doc, UpdateDoc } from 'src/firebase/firebaseConfig';
import ToastComponent from '../../components/toast';

import { updateDefis } from 'src/firebase/firebaseServices';

import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["PDF"];

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    minHeight: 500,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    //borderRadius: 4
};

export const EditDefis = ({ handleClose, isOpen, data }) => {

    const formik = useFormik({
        initialValues: {
            libelleFr: data.libelleFr,
            submit: null
        },
        validationSchema: Yup.object({
            libelleFr: Yup
                .string()
                .max(255)
                .required("Le libellé en français est requis")
        }),
        onSubmit: async (values, helpers) => {
            updateDefis(values, data.id)
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
                        <Card sx={{ minHeight: 200 }}>
                            <CardHeader
                                //subheader="catégorie"
                                title="Modifier Défis"
                            />
                            <Divider />
                            <CardContent>
                                <Stack
                                    direction={'column'}
                                    spacing={3}
                                    sx={{ maxWidth: 400 }}
                                >


                                    <TextField
                                        error={!!(formik.touched.libelleFr && formik.errors.libelleFr)}
                                        fullWidth
                                        helperText={formik.touched.libelleFr && formik.errors.libelleFr}
                                        label="Libellé en français"
                                        name="libelleFr"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        type="text"
                                        value={formik.values.libelleFr}
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
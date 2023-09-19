import { useCallback, useState } from 'react';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Stack,
    TextField,
    Typography
} from '@mui/material';

import ImagePicker from 'src/components/image-picker';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { addPilier } from 'src/firebase/firebaseServices';
import { db, GetDoc, Doc, UpdateDoc } from 'src/firebase/firebaseConfig';
import ToastComponent from '../../components/toast';

export const CreatePilier = () => {

    const formik = useFormik({
        initialValues: {
            libelleFr: '',
            libelleEn: '',
            libelleIt: '',
            definitionFr: '',
            definitionEn: '',
            definitionIt: '',
            submit: null
        },
        validationSchema: Yup.object({
            libelleFr: Yup
                .string()
                .max(255)
                .required("Le libellé en français est requis"),
            libelleEn: Yup
                .string()
                .max(255)
                .required("Le libellé en anglais est requis"),
            libelleIt: Yup
                .string()
                .max(255)
                .required("Le libellé en italien est requis"),
            definitionFr: Yup
                .string()
                .required("La definition en français est requise"),
            definitionEn: Yup
                .string()
                .required("La definition en anglais est requise"),
            definitionIt: Yup
                .string()
                .required("La definition en italien est requise"),
        }),
        onSubmit: async (values, helpers) => {

            addPilier(values)
                .then(async (doc) => {
                    const collectionRef = Doc(db, 'piliers', doc.id);
                    const snapshot = await GetDoc(collectionRef);

                    const docData = {
                        ...snapshot.data(),
                        id: doc.id
                    };

                    UpdateDoc(collectionRef, docData)
                        .then(() => {
                            helpers.resetForm();
                            return ToastComponent({ message: 'Opération effectué avec succès', type: 'success' });
                        })
                        .catch((err) => {
                            helpers.setStatus({ success: false });
                            helpers.setErrors({ submit: err.message });
                            helpers.setSubmitting(false);
                            return ToastComponent({ message: err.message, type: 'error' });
                        })

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
        <form noValidate
            onSubmit={formik.handleSubmit}>
            <Card>
                <CardHeader
                    //subheader="catégorie"
                    title="Ajouter Pilier"
                />
                <Divider />
                <CardContent>
                    <Stack
                        spacing={3}
                        sx={{ maxWidth: 800 }}
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

                        <TextField
                            error={!!(formik.touched.libelleIt && formik.errors.libelleIt)}
                            fullWidth
                            helperText={formik.touched.libelleIt && formik.errors.libelleIt}
                            label="Libellé en italien"
                            name="libelleIt"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="text"
                            value={formik.values.libelleIt}
                        />

                        <TextField
                            error={!!(formik.touched.definitionFr && formik.errors.definitionFr)}
                            fullWidth
                            helperText={formik.touched.definitionFr && formik.errors.definitionFr}
                            label="Définition en français"
                            name="definitionFr"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="text"
                            value={formik.values.definitionFr}
                        />

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

                        <TextField
                            error={!!(formik.touched.definitionIt && formik.errors.definitionIt)}
                            fullWidth
                            helperText={formik.touched.definitionIt && formik.errors.definitionIt}
                            label="Définition en italien"
                            name="definitionIt"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="text"
                            value={formik.values.definitionIt}
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
                    <Button variant="contained"
                        type='submit'>
                        Créer
                    </Button>
                </CardActions>
            </Card>
        </form>
    );
};

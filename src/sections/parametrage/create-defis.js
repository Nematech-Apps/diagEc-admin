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
    Typography,
    Input
} from '@mui/material';
import DocumentIcon from '@heroicons/react/24/solid/DocumentIcon';

import FilePicker from 'src/components/file-picker';


import { useFormik } from 'formik';
import * as Yup from 'yup';
;
import { addDefis, uploadFicheReflexe } from 'src/firebase/firebaseServices';
import { db, GetDoc, Doc, UpdateDoc } from 'src/firebase/firebaseConfig';
import ToastComponent from '../../components/toast';

export const CreateDefis = () => {

    const formik = useFormik({
        initialValues: {
            libelle: '',
            submit: null
        },
        validationSchema: Yup.object({
            libelle: Yup
                .string()
                .max(255)
                .required("Le libellé est requis"),
        }),
        onSubmit: async (values, helpers) => {
            if(selectedFile != null){
                addDefis(values)
                .then(async (doc) => {
                    const collectionRef = Doc(db, 'defis', doc.id);
                    const snapshot = await GetDoc(collectionRef);
                    

                    uploadFicheReflexe(selectedFile, doc.id)
                    .then((url) => {
                        const docData = {
                            ...snapshot.data(),
                            id: doc.id,
                            ficheReflexe : url
                        };
                        UpdateDoc(collectionRef, docData)
                        .then(() => {
                            helpers.resetForm();
                            setSelectedFile(null);
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


                })
                .catch((err) => {
                    helpers.setStatus({ success: false });
                    helpers.setErrors({ submit: err.message });
                    helpers.setSubmitting(false);
                    return ToastComponent({ message: err.message, type: 'error' });
                })
            }

        }
    });


    const [selectedFile, setSelectedFile] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            alert('Veuillez choisir un fichier PDF.');
        }
    };

    return (
        <form noValidate
            onSubmit={formik.handleSubmit}>
            <Card>
                <CardHeader
                    //subheader="catégorie"
                    title="Defis"
                />
                <Divider />
                <CardContent>
                    <Stack
                        spacing={3}
                        sx={{ maxWidth: 800 }}
                    >
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

                        <Stack direction={'row'} spacing={3}>
                            <Input
                                accept="application/pdf"
                                id="file-input"
                                type="file"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="file-input">
                                <Button variant="outlined" startIcon={<DocumentIcon />} component="span">
                                    Choisir un fichier
                                </Button>
                            </label>
                            <label>
                                {selectedFile && selectedFile.name}
                            </label>

                        </Stack>


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

                    {selectedFile == null && (
                        <Typography
                            color="error"
                            sx={{ mt: 3 }}
                            variant="body2"
                        >
                            Vous devez sélectionner un fichier
                        </Typography>
                    )}
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button variant="contained" type='submit'>
                        Créer
                    </Button>
                </CardActions>
            </Card>
        </form>
    );
};

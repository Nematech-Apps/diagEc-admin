import { useCallback, useState, useEffect } from 'react';
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
    Input,
    SvgIcon
} from '@mui/material';
import DocumentIcon from '@heroicons/react/24/solid/DocumentIcon';

import FilePicker from 'src/components/file-picker';


import { useFormik } from 'formik';
import * as Yup from 'yup';
;
import { addDefis, uploadFicheReflexe, updateFicheReflexionCollection } from 'src/firebase/firebaseServices';
import { db, GetDoc, Doc, UpdateDoc } from 'src/firebase/firebaseConfig';
import ToastComponent from '../../components/toast';

export const CreateDefis = () => {

    const formik = useFormik({
        initialValues: {
            libelleFr: '',
            libelleEn: '',
            libelleIt: '',
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
        }),
        onSubmit: async (values, helpers) => {
            if (selectedFileFr != null && selectedFileEn != null && selectedFileIt != null) {
                addDefis(values)
                    .then(async (doc) => {
                        const collectionRef = Doc(db, 'defis', doc.id);
                        const snapshot = await GetDoc(collectionRef);


                        uploadFicheReflexe(selectedFileFr, doc.id, 'Fr')
                            .then((url) => {
                                const docData = {
                                    ...snapshot.data(),
                                    id: doc.id,
                                    ficheReflexeFr: url
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
                                                        helpers.resetForm();
                                                        setSelectedFileFr(null);
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
                            })
                            .catch((err) => {
                                helpers.setStatus({ success: false });
                                helpers.setErrors({ submit: err.message });
                                helpers.setSubmitting(false);
                                return ToastComponent({ message: err.message, type: 'error' });
                            })


                        uploadFicheReflexe(selectedFileEn, doc.id, 'En')
                            .then((url) => {
                                const docData = {
                                    ...snapshot.data(),
                                    id: doc.id,
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
                                                        helpers.resetForm();
                                                        setSelectedFileEn(null);
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
                            })
                            .catch((err) => {
                                helpers.setStatus({ success: false });
                                helpers.setErrors({ submit: err.message });
                                helpers.setSubmitting(false);
                                return ToastComponent({ message: err.message, type: 'error' });
                            })


                        uploadFicheReflexe(selectedFileIt, doc.id, 'It')
                            .then((url) => {
                                const docData = {
                                    ...snapshot.data(),
                                    id: doc.id,
                                    ficheReflexeIt: url
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
                                                        helpers.resetForm();
                                                        setSelectedFileIt(null);
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


    const [selectedFileFr, setSelectedFileFr] = useState(null);

    const [fileNameFr, setFileNameFr] = useState(null);

    const [selectedFileEn, setSelectedFileEn] = useState(null);

    const [fileNameEn, setFileNameEn] = useState(null);

    const [selectedFileIt, setSelectedFileIt] = useState(null);

    const [fileNameIt, setFileNameIt] = useState(null);

    const formatFileNameFr = () => {
        if (selectedFileFr != null) {
            const formatedStr = `${selectedFileFr.name.substring(0, selectedFileFr.name.length / 2)}....`;
            setFileNameFr(formatedStr);
        }
    }

    useEffect(() => {
        formatFileNameFr();
    }, [selectedFileFr])

    const handleImageChangeFr = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFileFr(file);
            // formatFileNameFr();
            // console.log(fileNameFr);
        } else {
            alert('Veuillez choisir un fichier PDF.');
        }
    };

    useEffect(() => {
        formatFileNameEn();
    }, [selectedFileEn])


    const formatFileNameEn = () => {
        if (selectedFileEn != null) {
            const formatedStr = `${selectedFileEn.name.substring(0, selectedFileEn.name.length / 2)}....`;
            setFileNameEn(formatedStr);
        }
    }

    const handleImageChangeEn = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFileEn(file);
        } else {
            alert('Veuillez choisir un fichier PDF.');
        }
    };

    const formatFileNameIt = () => {
        if (selectedFileIt != null) {
            const formatedStr = `${selectedFileIt.name.substring(0, selectedFileIt.name.length / 2)}....`;
            setFileNameIt(formatedStr);
        }
    }

    useEffect(() => {
        formatFileNameIt();
    }, [selectedFileIt])

    const handleImageChangeIt = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFileIt(file);
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
                    title="Ajouter Défis"
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

                        <Stack direction={'row'}
                            spacing={3}>
                            <Input
                                accept="application/pdf"
                                id="file-inputFr"
                                type="file"
                                onChange={handleImageChangeFr}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="file-inputFr">
                                <Button variant="outlined" color='info'
                                    startIcon={
                                        <SvgIcon>
                                            <DocumentIcon />
                                        </SvgIcon>
                                    }
                                    component="span">
                                    Choisir la fiche réflexe en français
                                </Button>
                            </label>

                            <label>
                                {
                                    selectedFileFr &&
                                    fileNameFr
                                }
                            </label>

                        </Stack>


                        <Stack direction={'row'}
                            spacing={3}>
                            <Input
                                accept="application/pdf"
                                id="file-inputEn"
                                type="file"
                                onChange={handleImageChangeEn}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="file-inputEn">
                                <Button variant="outlined" color='info'
                                    startIcon={
                                        <SvgIcon>
                                            <DocumentIcon />
                                        </SvgIcon>
                                    }
                                    component="span">
                                    Choisir la fiche réflexe en anglais
                                </Button>
                            </label>

                            <label>
                                {
                                    selectedFileEn &&
                                    fileNameEn
                                }
                            </label>

                        </Stack>

                        <Stack direction={'row'}
                            spacing={3}>
                            <Input
                                accept="application/pdf"
                                id="file-inputIt"
                                type="file"
                                onChange={handleImageChangeIt}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="file-inputIt">
                                <Button variant="outlined" color='info'
                                    startIcon={
                                        <SvgIcon>
                                            <DocumentIcon />
                                        </SvgIcon>
                                    }
                                    component="span">
                                    Choisir la fiche réflexe en italien
                                </Button>
                            </label>

                            <label>
                                {
                                    selectedFileIt &&
                                    fileNameIt
                                }
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

                    {(selectedFileFr == null || selectedFileEn == null || selectedFileIt == null) && (
                        <Typography
                            color="error"
                            sx={{ mt: 3 }}
                            variant="body2"
                        >
                            Vous devez sélectionner un fichier pour les trois langues Français, anglais et italien (Seuls les fichiers PDF sont autorisés)
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

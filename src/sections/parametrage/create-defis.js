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
    SvgIcon,
    FormControl,
    Select,
    InputLabel,
    MenuItem
} from '@mui/material';
import DocumentIcon from '@heroicons/react/24/solid/DocumentIcon';

import ArrowUpCircleIcon from '@heroicons/react/24/solid/ArrowUpCircleIcon';

import FilePicker from 'src/components/file-picker';


import { useFormik } from 'formik';
import * as Yup from 'yup';
;
import { addDefis, uploadFicheReflexe, updateFicheReflexionCollection, getPilierList } from 'src/firebase/firebaseServices';
import { db, GetDoc, Doc, UpdateDoc } from 'src/firebase/firebaseConfig';
import ToastComponent from '../../components/toast';


import { getDeviceTokensList } from 'src/firebase/firebaseServices';
import { OnSnapshot } from 'src/firebase/firebaseConfig';


import NotificationService from 'src/notificationsService/notificationService';

const baseURL = 'https://fcm.googleapis.com/fcm/send';
const notificationService = new NotificationService(baseURL);

export const CreateDefis = () => {
    const [dataToken, setDataToken] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [piliers, setPiliers] = useState([]);


    const [isOnCreate, setIsOnCreate] = useState(false);


    useEffect(() => {
        const unsubscribe1 = OnSnapshot(
            getDeviceTokensList(),
            (snapshot) => {
                const fetchedData = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setDataToken(fetchedData);
                setIsLoading(false);
            },
            (error) => {
                console.log('Error fetching data:', error);
                setIsLoading(false);
            }
        );

        const unsubscribe2 = OnSnapshot(
            getPilierList(),
            (snapshot) => {
                const fetchedData = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setPiliers(fetchedData);
            },
            (error) => {
                console.log('Error fetching data:', error);
            }
        );

        return () => {
            // Clean up the listener when the component unmounts
            unsubscribe1();
            unsubscribe2();
        };

    }, []);

    const formik = useFormik({
        initialValues: {
            pilier: '',
            libelleFr: '',
            libelleEn: '',
            libelleIt: '',
            submit: null
        },
        validationSchema: Yup.object({
            pilier: Yup
                .string()
                .required("Le pilier est requis"),
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
                setIsOnCreate(true);
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
                                                        //notify users
                                                        const authToken = 'AAAAn_0BcwE:APA91bGwDIQfUGwNFze-sBenguSvoIti8XW8kuYvrhbcXDJ6X9ZWP8rVETtQoRGJAyJT_9wpHlg02Lrd1PsJEsnhEBkvrp5yy3GJ4wSPEJTT7LP1azAE3SD_3m6OwAjijwkksvUK2f-I';
                                                        notificationService.setAuthorizationToken(authToken);
                                                        if (isLoading == false) {
                                                            dataToken.forEach(async (elt) => {
                                                                notificationService.post('', {
                                                                    "data": {
                                                                        "title": "Nouveau défi et fiche réflexe ajoutés",
                                                                        "message": "Un nouveau défi et fiche réflexe viennent d'être ajoutés"
                                                                    },
                                                                    "to": elt.token
                                                                }
                                                                ).then((data) => {
                                                                    console.log('Données récupérées avec succès :', data);
                                                                }).catch((error) => {
                                                                    console.error('Erreur lors de la récupération des données :', error);
                                                                });
                                                            })

                                                        }
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
                                                        setIsOnCreate(false);
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
                        setIsOnCreate(false);
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
                    title="Ajouter Défi"
                />
                <Divider />
                <CardContent>
                    <Stack
                        spacing={3}
                        sx={{ maxWidth: 800 }}
                    >

                        <FormControl variant="filled"
                            sx={{ width: 800 }} fullWidth>
                            <InputLabel id="pilier">Pilier</InputLabel>
                            <Select
                                labelId="pilier"
                                id="pilier"
                                name="pilier"
                                error={!!(formik.touched.pilier && formik.errors.pilier)}
                                value={formik.values.pilier}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                label="Pilier"
                                fullWidth
                            >
                                <MenuItem value="">
                                    <em>Aucune sélection</em>
                                </MenuItem>
                                {piliers.map((pilier, index) => {
                                    return (<MenuItem value={JSON.stringify(pilier)}
                                        key={index}>{pilier.libelleFr}</MenuItem>)
                                })}

                            </Select>
                            {formik.touched.pilier && formik.errors.pilier && (
                                <Typography color="error"
                                    variant="caption">
                                    {formik.errors.pilier}
                                </Typography>
                            )}
                        </FormControl>

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
                                <Button variant="outlined" color='primary'
                                    endIcon={
                                        <SvgIcon>
                                            <ArrowUpCircleIcon />
                                        </SvgIcon>
                                    }
                                    component="span"
                                    sx={{ padding: 2 }}
                                >
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
                                <Button variant="outlined" color='primary'
                                    endIcon={
                                        <SvgIcon>
                                            <ArrowUpCircleIcon />
                                        </SvgIcon>
                                    }
                                    component="span"
                                    sx={{ padding: 2 }}
                                >
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
                                <Button variant="outlined" color='primary'
                                    endIcon={
                                        <SvgIcon>
                                            <ArrowUpCircleIcon />
                                        </SvgIcon>
                                    }
                                    component="span"
                                    sx={{ padding: 2 }}
                                >
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
                            sx={{ mt: 3, fontWeight: 'bold' }}
                            variant="body2"
                        >
                            ⚠ Vous devez sélectionner un fichier pour les trois langues Français, anglais et italien (Seuls les fichiers PDF sont autorisés)
                        </Typography>
                    )}



                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button variant="contained"
                        type='submit' disabled={isOnCreate}>
                        Créer
                    </Button>
                </CardActions>
            </Card>
        </form>
    );
};

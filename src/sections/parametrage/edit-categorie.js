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

import { updateCategorie } from 'src/firebase/firebaseServices';
import { getSecteurList } from 'src/firebase/firebaseServices';
import { getNiveauList } from 'src/firebase/firebaseServices';
import { OnSnapshot } from 'src/firebase/firebaseConfig';

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
    //borderRadius: 4
};

export const EditCategorie = ({ handleClose, isOpen, data }) => {

    const [secteurs, setSecteurs] = useState([]);
    const [niveaux, setNiveaux] = useState([]);

    useEffect(() => {
        const unsubscribe1 = OnSnapshot(
            getSecteurList(),
            (snapshot) => {
                const fetchedData = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setSecteurs(fetchedData);
            },
            (error) => {
                console.log('Error fetching data:', error);
            }
        );

        const unsubscribe2 = OnSnapshot(
            getNiveauList(),
            (snapshot) => {
                const fetchedData = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setNiveaux(fetchedData);
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
            libelle: data.libelle,
            secteurAppartenance: '',
            niveauAppartenance: '',
            submit: null
        },
        validationSchema: Yup.object({
            libelle: Yup
                .string()
                .max(255)
                .required("Le libellé est requis"),
            secteurAppartenance: Yup
                .string()
                .required("Le secteur d'appartenance est requis"),
            niveauAppartenance: Yup
                .string()
                .required("Le niveau d'appartenance est requis"),
        }),
        onSubmit: async (values, helpers) => {
            updateCategorie(values, data.id)
                .then(() => {
                    helpers.resetForm();
                    handleClose();
                    return ToastComponent({ message: 'Opération effectuée avec succès', type: 'success' });
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
                                title="Modifier la catégorie"
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

                                    <FormControl variant="standard" >
                                        <InputLabel id="demo-simple-select-standard-label">Secteur d'appartenance</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            name="secteurAppartenance"
                                            error={!!(formik.touched.secteurAppartenance && formik.errors.secteurAppartenance)}
                                            value={formik.values.secteurAppartenance}
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            label="Secteur d'appartenance"
                                        >
                                            <MenuItem value="">
                                                <em>Aucune sélection</em>
                                            </MenuItem>
                                            {secteurs.map((secteur, index) => {
                                                return (<MenuItem value={JSON.stringify(secteur)}
                                                    key={index}>{secteur.libelleFr}</MenuItem>)
                                            })}

                                        </Select>
                                        {formik.touched.secteurAppartenance && formik.errors.secteurAppartenance && (
                                            <Typography color="error"
                                                variant="caption">
                                                {formik.errors.secteurAppartenance}
                                            </Typography>
                                        )}
                                    </FormControl>


                                    <FormControl variant="standard" >
                                        <InputLabel id="demo-simple-select-standard-label">Niveau d'appartenance</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            name="niveauAppartenance"
                                            error={!!(formik.touched.niveauAppartenance && formik.errors.niveauAppartenance)}
                                            value={formik.values.niveauAppartenance}
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            label="Niveau d'appartenance"
                                        >
                                            <MenuItem value="">
                                                <em>Aucune sélection</em>
                                            </MenuItem>
                                            {niveaux.map((niveau, index) => {
                                                return (<MenuItem value={JSON.stringify(niveau)}
                                                    key={index}>{niveau.libelleFr}</MenuItem>)
                                            })}
                                        </Select>
                                        {formik.touched.niveauAppartenance && formik.errors.niveauAppartenance && (
                                            <Typography color="error"
                                                variant="caption">
                                                {formik.errors.niveauAppartenance}
                                            </Typography>
                                        )}
                                    </FormControl>
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
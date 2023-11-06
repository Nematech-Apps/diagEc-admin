import { useState, useEffect } from 'react';

import CheckBadgeIcon from '@heroicons/react/24/solid/CheckBadgeIcon';

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
    SvgIcon
} from '@mui/material';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { getPilierList } from 'src/firebase/firebaseServices';
import { db, GetDoc, Doc, UpdateDoc } from 'src/firebase/firebaseConfig';
import { OnSnapshot } from 'src/firebase/firebaseConfig';
import ToastComponent from '../../components/toast';

import { updateDefisIt } from 'src/firebase/firebaseServices';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    //borderRadius: 4
};

export const EditDefisIt = ({ handleClose, isOpen, data }) => {

    const [piliers, setPiliers] = useState([]);

    useEffect(() => {
        const unsubscribe = OnSnapshot(
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
            unsubscribe();
        };

    }, []);


    const formik = useFormik({
        initialValues: {
            pilier: '',
            libelleIt: data.libelleIt,
            submit: null
        },
        validationSchema: Yup.object({
            pilier: Yup
                .string()
                .required("Le pilier est requis"),
            libelleIt: Yup
                .string()
                .max(255)
                .required("Le libellé en italien est requis")
        }),
        onSubmit: async (values, helpers) => {
            updateDefisIt(values, data.id)
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
                                title="Modifier le défi"
                            />
                            <Divider />
                            <CardContent>
                                <Stack
                                    direction={'column'}
                                    spacing={3}
                                    sx={{ maxWidth: 400 }}
                                >

                                    <Stack direction={'row'} spacing={1}>
                                        {
                                            data.pilier != null &&
                                            (
                                                <>
                                                    <Typography variant='subtitle2'>{data.pilier?.libelleIt}</Typography>
                                                    <SvgIcon>
                                                        <CheckBadgeIcon color='green' />
                                                    </SvgIcon>
                                                </>
                                            )
                                        }

                                    </Stack>

                                    <FormControl variant="filled"
                                        sx={{ width: 400 }} fullWidth>
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
                                                    key={index}>{pilier.libelleIt}</MenuItem>)
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
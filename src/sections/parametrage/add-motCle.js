import { useState, useEffect } from 'react';

import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import FolderIcon from '@heroicons/react/24/solid/FolderIcon';
import { styled } from '@mui/material/styles';
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
    Fab,
    SvgIcon,
    List,
    ListItem,
    ListItemText,
    Chip,
    Paper
} from '@mui/material';

import PlusIcon from '@heroicons/react/24/solid/PlusIcon';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { addCategorie } from 'src/firebase/firebaseServices';
import { addMotCleToPilier } from 'src/firebase/firebaseServices';
import { db, GetDoc, Doc, UpdateDoc } from 'src/firebase/firebaseConfig';
import ToastComponent from '../../components/toast';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    minHeight: 500,
    bgcolor: '#ffffff',
    border: '1px solid #ffffff',
    // boxShadow: 24,
    p: 4,
};

const CustomListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));


export const AddMotCle = ({ handleClose, isOpen, data }) => {

    const [listMotCleFr, setListMotCleFr] = useState([]);


    const formik = useFormik({
        initialValues: {
            libelleFr: '',
            submit: null
        },
        validationSchema: Yup.object({
            libelleFr: Yup
                .string()
                .max(255)

        }),
        onSubmit: async (values, helpers) => {

            if (listMotCleFr.length != 0) {
                const obj = {
                    motClesFr: listMotCleFr,
                }
                addMotCleToPilier(obj, data.id)
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

        }
    });




    const handleAddMotCleFr = () => {
        const newMotCle = formik.values.libelleFr;
        if (newMotCle && !listMotCleFr.includes(newMotCle)) {
            setListMotCleFr((prevListMotCle) => [...prevListMotCle, newMotCle]);
            formik.setFieldValue('libelleFr', '');
        }
    };

    const handleDeleteFr = (motCle) => {
        setListMotCleFr((prevListMotCle) =>
            prevListMotCle.filter((m) => m !== motCle)
        );
    };


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
                            <CardHeader title="Ajouter des mots clés" />
                            <Divider />
                            <CardContent>
                                <Stack direction={'column'}
                                    spacing={3}
                                // sx={{ maxWidth: 600 }}
                                >
                                    <Stack direction={'row'}
                                        spacing={3}
                                    >
                                        <TextField
                                            error={!!(listMotCleFr.length == 0 && formik.errors.libelleFr)}
                                            helperText={listMotCleFr.length == 0 ? formik.errors.libelleFr : ''}
                                            label="Libellé en français"
                                            name="libelleFr"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            type="text"
                                            value={formik.values.libelleFr}
                                        />

                                        <Fab size="small"
                                            color="secondary"
                                            aria-label="add"
                                            onClick={handleAddMotCleFr}>
                                            <SvgIcon fontSize="small">
                                                <PlusIcon />
                                            </SvgIcon>
                                        </Fab>
                                        {/* 
                                        <Divider orientation="vertical" flexItem /> */}

                                        <Paper
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                flexWrap: 'wrap',
                                                listStyle: 'none',
                                                p: 0.5,
                                                m: 0,
                                            }}
                                            component="ul"
                                        >
                                            {listMotCleFr.length !== 0 ? (
                                                listMotCleFr.map((item, index) => (
                                                    <CustomListItem key={index}>
                                                        <Chip label={item}
                                                            onDelete={() => handleDeleteFr(item)} />
                                                    </CustomListItem>
                                                ))
                                            ) : (
                                                <ListItem>
                                                    <ListItemText primary={'Aucun mot-clé en français ajouté'} />
                                                </ListItem>
                                            )}
                                        </Paper>

                                    </Stack>

                                    {listMotCleFr.length === 0 && (
                                        <Typography color="error"
                                            sx={{ mt: 3 }}
                                            variant="body2">
                                            Vous devez ajouter un mot clé en Français
                                        </Typography>
                                    )}









                                    {/* {formik.errors.submit && listMotCleEn.length == 0 && (
                                    <Typography color="error"
                                        sx={{ mt: 3 }}
                                        variant="body2">
                                        {formik.errors.submit}
                                    </Typography>
                                )}

                                {formik.errors.submit && listMotCleIt.length == 0 && (
                                    <Typography color="error"
                                        sx={{ mt: 3 }}
                                        variant="body2">
                                        {formik.errors.submit}
                                    </Typography>
                                )}

                                {formik.errors.submit && listMotCleFr.length == 0 && listMotCleEn.length == 0
                                    && listMotCleIt.length == 0 && (
                                        <Typography color="error"
                                            sx={{ mt: 3 }}
                                            variant="body2">
                                            {formik.errors.submit}
                                        </Typography>
                                    )} */}



                                </Stack>



                            </CardContent>
                            <Divider />
                            <CardActions sx={{ justifyContent: 'center' }}>
                                <Button variant="contained" color='warning'
                                    type='button' onClick={handleClose}>
                                    Annuler
                                </Button>
                                <Button variant="contained"
                                    type="submit">
                                    Ajouter
                                </Button>
                            </CardActions>

                        </Card>
                    </form>
                </Box>
            </Modal>
        </div>
    );

}
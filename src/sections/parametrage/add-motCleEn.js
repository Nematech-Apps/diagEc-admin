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
import { addMotCleToPilierEn } from 'src/firebase/firebaseServices';
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


export const AddMotCleEn = ({ handleClose, isOpen, data }) => {

    const [listMotCleEn, setListMotCleEn] = useState([]);

    const formik = useFormik({
        initialValues: {
            libelleEn: '',
            submit: null
        },
        validationSchema: Yup.object({
            libelleEn: Yup
                .string()
                .max(255)

        }),
        onSubmit: async (values, helpers) => {

            if (listMotCleEn.length != 0 ) {
                const obj = {
                    motClesEn: listMotCleEn
                }
                addMotCleToPilierEn(obj, data.id)
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

        }
    });



    const handleAddMotCleEn = () => {
        const newMotCle = formik.values.libelleEn;
        if (newMotCle && !listMotCleEn.includes(newMotCle)) {
            setListMotCleEn((prevListMotCle) => [...prevListMotCle, newMotCle]);
            formik.setFieldValue('libelleEn', '');
        }
    };

    const handleDeleteEn = (motCle) => {
        setListMotCleEn((prevListMotCle) =>
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
                                        spacing={3}>
                                        <TextField
                                            error={!!(listMotCleEn.length == 0 && formik.errors.libelleEn)}
                                            helperText={listMotCleEn.length == 0 ? formik.errors.libelleEn : ''}
                                            label="Libellé en anglais"
                                            name="libelleEn"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            type="text"
                                            value={formik.values.libelleEn}
                                        />

                                        <Fab size="small"
                                            color="secondary"
                                            aria-label="add"
                                            onClick={handleAddMotCleEn}>
                                            <SvgIcon fontSize="small">
                                                <PlusIcon />
                                            </SvgIcon>
                                        </Fab>

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
                                            {listMotCleEn.length !== 0 ? (
                                                listMotCleEn.map((item, index) => (
                                                    <CustomListItem key={index}>
                                                        <Chip label={item}
                                                            onDelete={() => handleDeleteEn(item)} />
                                                    </CustomListItem>
                                                ))
                                            ) : (
                                                <ListItem>
                                                    <ListItemText primary={'Aucun mot-clé en anglais ajouté'} />
                                                </ListItem>
                                            )}
                                        </Paper>
                                    </Stack>


                                    {listMotCleEn.length === 0 && (
                                        <Typography color="error"
                                            sx={{ mt: 3 }}
                                            variant="body2">
                                            Vous devez ajouter un mot clé en Anglais
                                        </Typography>
                                    )}

    


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
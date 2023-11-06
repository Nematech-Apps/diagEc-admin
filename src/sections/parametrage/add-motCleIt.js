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
import { addMotCleToPilierIt } from 'src/firebase/firebaseServices';
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


export const AddMotCleIt = ({ handleClose, isOpen, data }) => {

    const [listMotCleIt, setListMotCleIt] = useState([]);


    const formik = useFormik({
        initialValues: {
            libelleIt: '',
            submit: null
        },
        validationSchema: Yup.object({
            libelleIt: Yup
                .string()
                .max(255)

        }),
        onSubmit: async (values, helpers) => {

            if (listMotCleIt.length != 0) {
                const obj = {
                    motClesIt: listMotCleIt
                }
                addMotCleToPilierIt(obj, data.id)
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




    const handleAddMotCleIt = () => {
        const newMotCle = formik.values.libelleIt;
        if (newMotCle && !listMotCleIt.includes(newMotCle)) {
            setListMotCleIt((prevListMotCle) => [...prevListMotCle, newMotCle]);
            formik.setFieldValue('libelleIt', '');
        }
    };

    const handleDeleteIt = (motCle) => {
        setListMotCleIt((prevListMotCle) =>
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
                                            error={!!(listMotCleIt.length == 0 && formik.errors.libelleIt)}
                                            helperText={listMotCleIt.length == 0 ? formik.errors.libelleIt : ''}
                                            label="Libellé en italien"
                                            name="libelleIt"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            type="text"
                                            value={formik.values.libelleIt}
                                        />

                                        <Fab size="small"
                                            color="secondary"
                                            aria-label="add"
                                            onClick={handleAddMotCleIt}>
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
                                            {listMotCleIt.length !== 0 ? (
                                                listMotCleIt.map((item, index) => (
                                                    <CustomListItem key={index}>
                                                        <Chip label={item}
                                                            onDelete={() => handleDeleteIt(item)} />
                                                    </CustomListItem>
                                                ))
                                            ) : (
                                                <ListItem>
                                                    <ListItemText primary={'Aucun mot-clé en italien ajouté'} />
                                                </ListItem>
                                            )}
                                        </Paper>
                                    </Stack>


                                </Stack>

                                {listMotCleIt.length === 0 && (
                                    <Typography color="error"
                                        sx={{ mt: 3 }}
                                        variant="body2">
                                        Vous devez ajouter un mot clé en Italien
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
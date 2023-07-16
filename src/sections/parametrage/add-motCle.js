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
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
};

const CustomListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));


export const AddMotCle = ({ handleClose, isOpen, data }) => {

    const [listMotCle, setListMotCle] = useState([]);


    const formik = useFormik({
        initialValues: {
            libelle: '',
            submit: null
        },
        validationSchema: Yup.object({
            libelle: Yup
                .string()
                .max(255)
                
        }),
        onSubmit: async (values, helpers) => {

            const obj = {
                motCles: listMotCle
            }
            addMotCleToPilier(obj, data.id)
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




    const handleAddMotCle = () => {
        const newMotCle = formik.values.libelle;
        if (newMotCle && !listMotCle.includes(newMotCle)) {
            setListMotCle((prevListMotCle) => [...prevListMotCle, newMotCle]);
            formik.setFieldValue('libelle', '');
        }
    };

    const handleDelete = (motCle) => {
        setListMotCle((prevListMotCle) =>
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
                        <Card>
                            <CardHeader title="Ajouter des mots clés" />
                            <Divider />
                            <CardContent>
                                <Stack direction={'column'}
spacing={3}
sx={{ maxWidth: 600 }}>
                                    <Stack direction={'row'}
spacing={3}>
                                        <TextField
                                            error={!!(listMotCle.length == 0 && formik.errors.libelle)}
                                            helperText={listMotCle.length == 0 ? formik.errors.libelle : ''}
                                            label="Libellé"
                                            name="libelle"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            type="text"
                                            value={formik.values.libelle}
                                        />

                                        <Fab size="small"
color="secondary"
aria-label="add"
onClick={handleAddMotCle}>
                                            <SvgIcon fontSize="small">
                                                <PlusIcon />
                                            </SvgIcon>
                                        </Fab>
                                    </Stack>

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
                                        {listMotCle.length !== 0 ? (
                                            listMotCle.map((item, index) => (
                                                <CustomListItem key={index}>
                                                    <Chip label={item}
onDelete={() => handleDelete(item)} />
                                                </CustomListItem>
                                            ))
                                        ) : (
                                            <ListItem>
                                                <ListItemText primary={'Aucun mot-clé ajouté'} />
                                            </ListItem>
                                        )}
                                    </Paper>
                                </Stack>

                                {formik.errors.submit && listMotCle.length == 0 && (
                                    <Typography color="error"
sx={{ mt: 3 }}
variant="body2">
                                        {formik.errors.submit}
                                    </Typography>
                                )}

                                {listMotCle.length === 0 && (
                                    <Typography color="error"
sx={{ mt: 3 }}
variant="body2">
                                        Vous devez ajouter au moins un mot clé
                                    </Typography>
                                )}
                            </CardContent>
                            <Divider />
                            <CardActions sx={{ justifyContent: 'flex-end' }}>
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
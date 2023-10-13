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
    Modal,
    OutlinedInput,
    Slider,
    Checkbox,
    List,
    ListItem,
    ListItemText,
    SvgIcon
} from '@mui/material';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { addCategorie } from 'src/firebase/firebaseServices';
import { db, GetDoc, Doc, UpdateDoc } from 'src/firebase/firebaseConfig';
import ToastComponent from '../../components/toast';

import { updateNiveau } from 'src/firebase/firebaseServices';
import { updateAnswer } from 'src/firebase/firebaseServices';
import { updateQuestion } from 'src/firebase/firebaseServices';

import { getAnswerList } from 'src/firebase/firebaseServices';
import { getCategoriesList } from 'src/firebase/firebaseServices';
import { getPilierList } from 'src/firebase/firebaseServices';
import { getDefisList } from 'src/firebase/firebaseServices';
import { OnSnapshot } from 'src/firebase/firebaseConfig';

import CheckBadgeIcon from '@heroicons/react/24/solid/CheckBadgeIcon';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    maxHeight: 500,
    overflow: 'auto',
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    //borderRadius: 4
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export const EditQuestion = ({ handleClose, isOpen, data }) => {

    const [answers, setAnswers] = useState([]);

    const [categories, setCategories] = useState([]);

    const [piliers, setPiliers] = useState([]);

    const [defis, setDefis] = useState([]);

    const [answerLibelle, setAnswerLibelle] = useState([]);

    const [objectList, setObjectList] = useState([]);

    const [categLibelle, setCategLibelle] = useState([]);

    const [objectListCateg, setObjectListCateg] = useState([]);

    const [defiLibelle, setDefiLibelle] = useState([]);

    const [objectListDefi, setObjectListDefi] = useState([]);



    const handleChange = (event) => {
        setAnswerLibelle(
            // On autofill we get a stringified value.
            typeof event.target.value === 'string' ? value.split(',') : event.target.value,
        );

    };


    useEffect(() => {
        const arr = [];
        if (answerLibelle.length != 0 && answers.length != 0) {
            answerLibelle.map((item) => {
                answers.map((elt) => {
                    if (elt.libelleFr == item) {
                        const obj = elt;
                        arr.push(obj);
                    }
                })
            })
            setObjectList(arr);
        }
    }, [answerLibelle])

    const handleChangeCateg = (event) => {
        setCategLibelle(
            // On autofill we get a stringified value.
            typeof event.target.value === 'string' ? value.split(',') : event.target.value,
        );

    };


    useEffect(() => {
        const arr = [];
        if (categLibelle.length != 0 && categories.length != 0) {
            categLibelle.map((item) => {
                categories.map((elt) => {
                    if (elt.libelle == item) {
                        const obj = elt;
                        arr.push(obj);
                    }
                })
            })
            setObjectListCateg(arr);
        }
    }, [categLibelle])


    const handleChangeDefi = (event) => {
        setDefiLibelle(
            // On autofill we get a stringified value.
            typeof event.target.value === 'string' ? value.split(',') : event.target.value,
        );

    };


    useEffect(() => {
        const arr = [];
        if (defiLibelle.length != 0 && defis.length != 0) {
            defiLibelle.map((item) => {
                defis.map((elt) => {
                    if (elt.libelleFr == item) {
                        const obj = elt;
                        arr.push(obj);
                    }
                })
            })
            setObjectListDefi(arr);
        }
    }, [defiLibelle])




    useEffect(() => {
        const unsubscribe1 = OnSnapshot(
            getAnswerList(),
            (snapshot) => {
                const fetchedData = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setAnswers(fetchedData);
            },
            (error) => {
                console.log('Error fetching data:', error);
            }
        );

        const unsubscribe2 = OnSnapshot(
            getCategoriesList(),
            (snapshot) => {
                const fetchedData = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setCategories(fetchedData);
            },
            (error) => {
                console.log('Error fetching data:', error);
            }
        );

        const unsubscribe3 = OnSnapshot(
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

        const unsubscribe4 = OnSnapshot(
            getDefisList(),
            (snapshot) => {
                const fetchedData = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setDefis(fetchedData);
            },
            (error) => {
                console.log('Error fetching data:', error);
            }
        );

        return () => {
            // Clean up the listener when the component unmounts
            unsubscribe1();
            unsubscribe2();
            unsubscribe3();
            unsubscribe4();
        };
    }, []);



    const formik = useFormik({
        initialValues: {
            libelleFr: data.libelleFr,
            poids: data.poids,
            // categorie: '',
            pilier: '',
            // defi: '',
            submit: null
        },
        validationSchema: Yup.object({
            libelleFr: Yup
                .string()
                .max(255)
                .required("Le libellé en français est requis"),
            poids: Yup
                .number()
                .required("Le poids est requis"),
            // categorie: Yup
            //     .string()
            //     .required("La catégorie est requise"),
            pilier: Yup
                .string()
                .required("Le pilier est requis"),
            // defi: Yup
            //     .string()
            //     .required("Le defis est requis"),

        }),
        onSubmit: async (values, helpers) => {
            if (answerLibelle.length != 0 && categLibelle.length != 0 && defiLibelle.length != 0) {
                const datas = {
                    libelleFr: values.libelleFr,
                    answers: objectList,
                    categories: objectListCateg,
                    //categorie: values.categorie,
                    poids: values.poids,
                    pilier: values.pilier,
                    // defi: values.defi
                    defis: objectListDefi
                }

                updateQuestion(datas, data.id)
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


    function valuetext(value) {
        return `${value}°C`;
    }


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
                                title="Modifier Question"
                            />
                            <Divider />
                            <CardContent>
                                <Stack
                                    direction={'column'}
                                    spacing={3}
                                    sx={{ maxWidth: 900 }}
                                >


                                    <Stack direction={'row'} spacing={1}>
                                        <Typography variant='subtitle2'>{data.pilier.libelleFr}</Typography>
                                        <SvgIcon>
                                            <CheckBadgeIcon color='green' />
                                        </SvgIcon>
                                    </Stack>

                                    <FormControl variant="filled"
                                        fullWidth>
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

                                    {/* <FormControl variant="filled"
                                sx={{ width: 500 }}>
                                <InputLabel id="defi">Défis</InputLabel>
                                <Select
                                    labelId="defi"
                                    id="defi"
                                    name="defi"
                                    error={!!(formik.touched.defi && formik.errors.defi)}
                                    value={formik.values.defi}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    label="Défis"
                                    fullWidth
                                >
                                    <MenuItem value="">
                                        <em>Aucune sélection</em>
                                    </MenuItem>
                                    {defis.map((defi, index) => {
                                        return (<MenuItem value={JSON.stringify(defi)}
                                            key={index}>{defi.libelleFr}</MenuItem>)
                                    })}

                                </Select>
                                {formik.touched.defi && formik.errors.defi && (
                                    <Typography color="error"
                                        variant="caption">
                                        {formik.errors.defi}
                                    </Typography>
                                )}
                            </FormControl> */}

                                    <List>
                                        {
                                            data.defis?.map((defi, index) => (
                                                <ListItem key={index}>
                                                    <ListItemText>
                                                        <Stack direction={'row'} spacing={1}>
                                                            <Typography variant='subtitle2'>{defi.libelleFr}</Typography>
                                                            <SvgIcon>
                                                                <CheckBadgeIcon color='green' />
                                                            </SvgIcon>
                                                        </Stack>
                                                    </ListItemText>
                                                </ListItem>
                                            ))
                                        }
                                    </List>

                                    <FormControl variant="filled" fullWidth>
                                        <InputLabel id="demo-multiple-checkbox-label">Défis</InputLabel>
                                        <Select
                                            labelId="demo-multiple-checkbox-label"
                                            id="demo-multiple-checkbox"
                                            multiple
                                            error={defiLibelle.length == 0}
                                            value={defiLibelle}
                                            onChange={handleChangeDefi}
                                            input={<OutlinedInput label="Défis" />}
                                            renderValue={(selected) => selected.join(', ')}
                                            MenuProps={MenuProps}
                                        >
                                            {formik.touched.pilier && formik.values.pilier != "" ?
                                                defis.filter(item => item.pilier?.id == JSON.parse(formik.values.pilier).id).map((defi, index) => (
                                                    <MenuItem key={index}
                                                        value={defi.libelleFr}>
                                                        <Checkbox checked={defiLibelle.indexOf(defi.libelleFr) > -1} />
                                                        <ListItemText primary={defi.libelleFr} />
                                                    </MenuItem>
                                                )) :
                                                defis.map((defi, index) => (
                                                    <MenuItem key={index}
                                                        value={defi.libelleFr}>
                                                        <Checkbox checked={defiLibelle.indexOf(defi.libelleFr) > -1} />
                                                        <ListItemText primary={defi.libelleFr} />
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>


                                        {defiLibelle.length == 0 && (
                                            <Typography color="error"
                                                variant="caption">
                                                Veuillez sélectionner un défi
                                            </Typography>
                                        )}
                                    </FormControl>


                                    <Stack
                                        direction={'row'}
                                        spacing={3}
                                        sx={{ maxWidth: 1500 }}
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



                                    </Stack>




                                    <Stack direction={'row'} spacing={2}>
                                        {
                                            data.answers?.map((answer, index) => (
                                                <div key={index}>
                                                    <Stack direction={'row'} spacing={2}>
                                                        <Typography variant='subtitle2'>{answer.libelleFr}</Typography>
                                                        <SvgIcon>
                                                            <CheckBadgeIcon color='green' />
                                                        </SvgIcon> &nbsp;&nbsp; |
                                                    </Stack>
                                                </div>
                                            ))
                                        }
                                    </Stack>

                                    <FormControl variant="filled" fullWidth>
                                        <InputLabel id="demo-multiple-checkbox-label">Réponses</InputLabel>
                                        <Select
                                            labelId="demo-multiple-checkbox-label"
                                            id="demo-multiple-checkbox"
                                            multiple
                                            error={answerLibelle.length == 0}
                                            value={answerLibelle}
                                            onChange={handleChange}
                                            input={<OutlinedInput label="Réponses" />}
                                            renderValue={(selected) => selected.join(', ')}
                                            MenuProps={MenuProps}
                                        >
                                            {answers.map((answer, index) => (
                                                <MenuItem key={index}
                                                    value={answer.libelleFr}>
                                                    <Checkbox checked={answerLibelle.indexOf(answer.libelleFr) > -1} />
                                                    <ListItemText primary={answer.libelleFr} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {/* {answerLibelle.length != answers.length && (
                                    <Typography color="error"
                                        variant="caption">
                                        Toutes les réponses doivent être sélectionnées
                                    </Typography>
                                )} */}

                                        {answerLibelle.length == 0 && (
                                            <Typography color="error"
                                                variant="caption">
                                                Veuillez sélectionner une réponse
                                            </Typography>
                                        )}
                                    </FormControl>


                                    <Stack direction={'row'} spacing={2}>
                                        {
                                            data.categories?.map((categ, index) => (
                                                <div key={index}>
                                                    <Stack direction={'row'} spacing={2}>
                                                        <Typography variant='subtitle2'>{categ.libelle}</Typography>
                                                        <SvgIcon>
                                                            <CheckBadgeIcon color='green' />
                                                        </SvgIcon> &nbsp;&nbsp; |
                                                    </Stack>
                                                </div>
                                            ))
                                        }
                                    </Stack>

                                    <FormControl variant="filled" fullWidth>
                                        <InputLabel id="demo-multiple-checkbox-label">Catégories</InputLabel>
                                        <Select
                                            labelId="demo-multiple-checkbox-label"
                                            id="demo-multiple-checkbox"
                                            multiple
                                            error={categLibelle.length == 0}
                                            value={categLibelle}
                                            onChange={handleChangeCateg}
                                            input={<OutlinedInput label="Catégories" />}
                                            renderValue={(selected) => selected.join(', ')}
                                            MenuProps={MenuProps}
                                        >
                                            {categories.map((categ, index) => (
                                                <MenuItem key={index}
                                                    value={categ.libelle}>
                                                    <Checkbox checked={categLibelle.indexOf(categ.libelle) > -1} />
                                                    <ListItemText primary={categ.libelle} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {/* {answerLibelle.length != answers.length && (
                                    <Typography color="error"
                                        variant="caption">
                                        Toutes les réponses doivent être sélectionnées
                                    </Typography>
                                )} */}

                                        {categLibelle.length == 0 && (
                                            <Typography color="error"
                                                variant="caption">
                                                Veuillez sélectionner une catégorie
                                            </Typography>
                                        )}
                                    </FormControl>

                                    {/* <FormControl variant="standard"
                                            sx={{ m: 1, width: 300 }}>
                                            <InputLabel id="demo-simple-select-standard-label">Catégorie</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-standard-label"
                                                id="demo-simple-select-standard"
                                                name="categorie"
                                                error={!!(formik.touched.categorie && formik.errors.categorie)}
                                                value={formik.values.categorie}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                label="Catégorie"
                                            >
                                                <MenuItem value="">
                                                    <em>Aucune sélection</em>
                                                </MenuItem>
                                                {categories.map((categorie, index) => {
                                                    return (<MenuItem value={JSON.stringify(categorie)}
                                                        key={index}>{categorie.libelle}</MenuItem>)
                                                })}

                                            </Select>
                                            {formik.touched.categorie && formik.errors.categorie && (
                                                <Typography color="error"
                                                    variant="caption">
                                                    {formik.errors.categorie}
                                                </Typography>
                                            )}
                                        </FormControl> */}

                                    <FormControl variant="standard"
                                        sx={{ m: 1, width: 300 }}>
                                        <Stack direction={'column'}
                                            spacing={4}>
                                            <InputLabel >Poids</InputLabel>
                                            <Slider
                                                aria-label="Poids"
                                                defaultValue={20}
                                                getAriaValueText={valuetext}
                                                valueLabelDisplay="auto"
                                                step={5}
                                                marks
                                                min={0}
                                                max={100}
                                                error={!!(formik.touched.poids && formik.errors.poids)}
                                                value={formik.values.poids}
                                                onBlur={formik.handleBlur}
                                                onChange={(event, value) => formik.setFieldValue('poids', value)}
                                            />

                                        </Stack>
                                        {formik.touched.poids && formik.errors.poids && (
                                            <Typography color="error"
                                                variant="caption">
                                                {formik.errors.poids}
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
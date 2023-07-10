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
    InputLabel,
    MenuItem,
    Select,
    FormControl,
    OutlinedInput,
    ListItemText,
    Checkbox,
    Slider
} from '@mui/material';

import ImagePicker from 'src/components/image-picker';

import { useFormik, setFieldValue } from 'formik';
import * as Yup from 'yup';

import { addQuestion } from 'src/firebase/firebaseServices';
import { db, GetDoc, Doc, UpdateDoc } from 'src/firebase/firebaseConfig';
import ToastComponent from '../../components/toast';

import { getAnswerList } from 'src/firebase/firebaseServices';
import { getCategoriesList } from 'src/firebase/firebaseServices';
import { getPilierList } from 'src/firebase/firebaseServices';
import { getDefisList } from 'src/firebase/firebaseServices';
import { OnSnapshot } from 'src/firebase/firebaseConfig';


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

export const CreateQuestion = () => {

    const [answers, setAnswers] = useState([]);

    const [categories, setCategories] = useState([]);

    const [piliers, setPiliers] = useState([]);

    const [defis, setDefis] = useState([]);

    const [answerLibelle, setAnswerLibelle] = useState([]);

    const [objectList, setObjectList] = useState([]);

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
                    if (elt.libelle == item) {
                        const obj = elt;
                        arr.push(obj);
                    }
                })
            })
            setObjectList(arr);
        }
    }, [answerLibelle])

    useEffect(() => {
        console.log(`value : ${JSON.stringify(objectList)}`);
    }, [objectList])

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
            libelle: '',
            categorie: '',
            poids: 10,
            pilier: '',
            defi: '',
            submit: null
        },
        validationSchema: Yup.object({
            libelle: Yup
                .string()
                .max(255)
                .required("Le libellé est requis"),
            categorie: Yup
                .string()
                .required("La catégorie est requise"),
            poids: Yup
                .number()
                .max(255)
                .required("Le poids est requis"),
            pilier: Yup
                .string()
                .required("Le pilier est requis"),
            defi: Yup
                .string()
                .required("Le defis est requis"),
        }),
        onSubmit: async (values, helpers) => {

            if (answerLibelle.length == answers.length) {
                const data = {
                    libelle: values.libelle,
                    answers: objectList,
                    categorie: values.categorie,
                    poids: values.poids,
                    pilier: values.pilier,
                    defi: values.defi
                }

                addQuestion(data)
                    .then(async (doc) => {
                        const collectionRef = Doc(db, 'questions', doc.id);
                        const snapshot = await GetDoc(collectionRef);

                        const docData = {
                            ...snapshot.data(),
                            id: doc.id
                        };

                        UpdateDoc(collectionRef, docData)
                            .then(() => {
                                helpers.resetForm();
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
            }

        }
    });


    function valuetext(value) {
        return `${value}°C`;
    }

    return (
        <form noValidate
            onSubmit={formik.handleSubmit}>
            <Card>
                <CardHeader
                    //subheader="catégorie"
                    title="Question"
                />
                <Divider />
                <CardContent>
                    <Stack
                        direction={'column'}
                        spacing={3}
                        sx={{ maxWidth: 900 }}
                    >
                        {/* <ImagePicker /> */}


                        <Stack
                            direction={'row'}
                            spacing={3}
                            sx={{ maxWidth: 1500 }}
                        >
                            <FormControl variant="standard" sx={{ m: 1, width: 500 }}>
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
                                        return (<MenuItem value={JSON.stringify(pilier)} key={index}>{pilier.libelle}</MenuItem>)
                                    })}

                                </Select>
                                {formik.touched.pilier && formik.errors.pilier && (
                                    <Typography color="error" variant="caption">
                                        {formik.errors.pilier}
                                    </Typography>
                                )}
                            </FormControl>

                            <FormControl variant="standard" sx={{ width: 500 }}>
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
                                        return (<MenuItem value={JSON.stringify(defi)} key={index}>{defi.libelle}</MenuItem>)
                                    })}

                                </Select>
                                {formik.touched.defi && formik.errors.defi && (
                                    <Typography color="error" variant="caption">
                                        {formik.errors.defi}
                                    </Typography>
                                )}
                            </FormControl>
                        </Stack>




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

                        <Stack
                            direction={'row'}
                            spacing={3}
                            sx={{ maxWidth: 1500 }}
                        >
                            <FormControl sx={{ m: 1, width: 300 }}>
                                <InputLabel id="demo-multiple-checkbox-label">Réponses</InputLabel>
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    error={answerLibelle.length != answers.length}
                                    value={answerLibelle}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Réponses" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={MenuProps}
                                >
                                    {answers.map((answer, index) => (
                                        <MenuItem key={index} value={answer.libelle}>
                                            <Checkbox checked={answerLibelle.indexOf(answer.libelle) > -1} />
                                            <ListItemText primary={answer.libelle} />
                                        </MenuItem>
                                    ))}
                                </Select>
                                {answerLibelle.length != answers.length && (
                                    <Typography color="error" variant="caption">
                                        Toutes les réponses doivent être sélectionnées
                                    </Typography>
                                )}
                            </FormControl>

                            <FormControl variant="standard" sx={{ m: 1, width: 300 }}>
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
                                        return (<MenuItem value={JSON.stringify(categorie)} key={index}>{categorie.libelle}</MenuItem>)
                                    })}

                                </Select>
                                {formik.touched.categorie && formik.errors.categorie && (
                                    <Typography color="error" variant="caption">
                                        {formik.errors.categorie}
                                    </Typography>
                                )}
                            </FormControl>

                            <FormControl variant="standard" sx={{ m: 1, width: 300 }}>
                                <Stack direction={'column'} spacing={4}>
                                    <InputLabel >Poids</InputLabel>
                                    <Slider
                                        aria-label="Poids"
                                        defaultValue={20}
                                        getAriaValueText={valuetext}
                                        valueLabelDisplay="auto"
                                        step={10}
                                        marks
                                        min={10}
                                        max={100}
                                        error={!!(formik.touched.poids && formik.errors.poids)}
                                        value={formik.values.poids}
                                        onBlur={formik.handleBlur}
                                        onChange={(event, value) => formik.setFieldValue('poids', value)}
                                    />

                                </Stack>
                                {formik.touched.poids && formik.errors.poids && (
                                    <Typography color="error" variant="caption">
                                        {formik.errors.poids}
                                    </Typography>
                                )}
                            </FormControl>

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

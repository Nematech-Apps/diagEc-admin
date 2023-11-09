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
    Fab,
    SvgIcon,
    Modal,
    LinearProgress,
    CircularProgress,
    useTheme
} from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';

import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import {
    getAuditsOuverturesForCompany, getFichesConsultesForCompany,
    getDefisRealisesForCompany, getFichesByUid, getAuditsConnexionsForCompany,
    getAuditsQuestionsForCompany, getQuestionsByUid, getPiliersByUid, getAnswersByUid
} from 'src/firebase/firebaseServices';
import { db, GetDoc, Doc, UpdateDoc } from 'src/firebase/firebaseConfig';
import ToastComponent from '../../components/toast';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    minHeight: 550,
    maxHeight: 570,
    overflow: 'auto',
    bgcolor: 'background.paper',
    border: '1px solid #ffffff',
    boxShadow: 24,
    p: 4,
    //borderRadius: 4
};

//useTheme().palette.primary.main



const RadiusBox = ({ color, text, number }) => {
    return (
        <Box sx={{
            padding: 4,
            width: '20%',
            height: 135,
            borderRadius: 4,
            backgroundColor: color
        }} display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Stack direction={'column'} spacing={2}>
                <Typography variant='h6' color={'white'}>{text}</Typography>
                <Typography color={'white'} variant='h3'>{number}</Typography>
            </Stack>
        </Box>
    )
}

export const CompanyStatsModal = ({ handleClose, isOpen, data }) => {
    const theme = useTheme();

    const colors = {
        chartreuse: 'chartreuse',
        crimson: 'crimson',
        sienna: 'sienna',
        turquoise: 'turquoise',
        white: 'white',
        paleturquoise: 'paleturquoise',
        indigo: 'indigo',
        primary: theme.palette.primary.dark,
        secondary: theme.palette.secondary.dark,
        warning: theme.palette.warning.dark,
        info: theme.palette.info.dark,
        error: theme.palette.error.dark,
        success: theme.palette.success.dark
    }

    const [connexionsData, setConnexionsData] = useState([]);
    const [ouverturesData, setOuverturesData] = useState([]);
    const [fichesData, setFichesData] = useState([]);
    const [defisData, setDefisData] = useState([]);
    const [questionsData, setQuestionsData] = useState([]);


    const [isLoading1, setIsLoading1] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [isLoading3, setIsLoading3] = useState(false);
    const [isLoading4, setIsLoading4] = useState(false);
    const [isLoading5, setIsLoading5] = useState(false);


    useEffect(() => {
        getConnexions();
        getOuvertures();
        getFiches();
        getDefis();
        getQuestions();
    }, [])


    const getConnexions = () => {
        setIsLoading1(true);
        console.log(`data.id = ${data.id}`);
        getAuditsConnexionsForCompany(data.id)
            .then((data) => {
                console.log(data);
                setConnexionsData(data);
                setIsLoading1(false);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const getOuvertures = () => {
        setIsLoading2(true);
        console.log(`data.id = ${data.id}`);
        getAuditsOuverturesForCompany(data.id)
            .then((data) => {
                console.log(data);
                setOuverturesData(data);
                setIsLoading2(false);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const getFiches = () => {
        setIsLoading3(true);
        console.log(`data.id = ${data.id}`);
        getFichesConsultesForCompany(data.id)
            .then((data) => {
                console.log(data);
                setFichesData(data);
                setIsLoading3(false);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const getDefis = () => {
        setIsLoading4(true);
        console.log(`data.id = ${data.id}`);
        getDefisRealisesForCompany(data.id)
            .then((data) => {
                console.log(data);
                setDefisData(data);
                setIsLoading4(false);
            })
            .catch((error) => {
                console.log(error);
            })
    }


    const getQuestions = () => {
        setIsLoading5(true);
        console.log(`data.id = ${data.id}`);
        getAuditsQuestionsForCompany(data.id)
            .then((data) => {
                console.log(data);
                setQuestionsData(data);
                setIsLoading5(false);
            })
            .catch((error) => {
                console.log(error);
            })
    }




    const ConnexionTable = ({ data }) => {
        const [dataRows, setDataRows] = useState([]);

        function generateUniqueId() {
            // Use a timestamp or any other method to generate unique IDs
            return Date.now();
        }

        function formatTimestampToDateString(timestamp) {
            const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
            const formattedDate = new Date(timestamp).toLocaleDateString('fr-FR', options);

            return formattedDate;
        }


        useEffect(() => {
            const arr = [];

            data.forEach((elt, i) => {
                const obj = {
                    id: generateUniqueId(),
                    fullDate: formatTimestampToDateString(elt.date),
                    nbreConnexion: data.filter(item => item.date === elt.date).length,
                };

                arr.push(obj);
            });

            setDataRows(arr);
        }, [data]);

        const columns = [
            { field: 'id', headerName: 'ID', width: 70 },
            { field: 'fullDate', headerName: 'Date et heure', width: 250 },
            { field: 'nbreConnexion', headerName: "Nombre de connexion", width: 200 },
        ];


        return (
            <div style={{ height: 200, width: '100%' }}>
                <DataGrid
                    rows={dataRows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 2 },
                        },
                    }}
                    pageSizeOptions={[2, 5]}

                />
            </div>
        );
    };


    const OuvertureTable = ({ data }) => {
        const [dataRows, setDataRows] = useState([]);

        function generateUniqueId() {
            // Use a timestamp or any other method to generate unique IDs
            return Date.now();
        }

        function formatTimestampToDateString(timestamp) {
            const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
            const formattedDate = new Date(timestamp).toLocaleDateString('fr-FR', options);

            return formattedDate;
        }


        useEffect(() => {
            const arr = [];

            data.forEach((elt, i) => {
                const obj = {
                    id: generateUniqueId(),
                    fullDate: formatTimestampToDateString(elt.date),
                    nbreOuverture: data.filter(item => item.date === elt.date).length,
                };

                arr.push(obj);
            });

            setDataRows(arr);
        }, [data]);

        const columns = [
            { field: 'id', headerName: 'ID', width: 70 },
            { field: 'fullDate', headerName: 'Date et heure', width: 250 },
            { field: 'nbreOuverture', headerName: "Nombre d'ouverture", width: 200 },
        ];

        return (
            <div style={{ height: 200, width: '100%' }}>
                <DataGrid
                    rows={dataRows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 2 },
                        },
                    }}
                    pageSizeOptions={[2, 5]}

                />
            </div>
        );
    };



    const FicheTable = ({ data }) => {
        const [dataRows, setDataRows] = useState([]);

        function generateUniqueId() {
            // Use a timestamp or any other method to generate unique IDs
            return Date.now();
        }

        function formatTimestampToDateString(timestamp) {
            const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
            const formattedDate = new Date(timestamp).toLocaleDateString('fr-FR', options);

            return formattedDate;
        }


        useEffect(() => {
            const fetchData = async () => {
                const promises = data.map(async (elt) => {
                    const ficheDataSnapshot = await getFichesByUid(elt.ficheId);
                    const ficheData = ficheDataSnapshot.data();
                    console.log(`ficheData : ${JSON.stringify(ficheDataSnapshot)}`);
                    return {
                        id: generateUniqueId(),
                        fullDate: formatTimestampToDateString(elt.date),
                        fiche: ficheData?.ficheReflexeFr,
                    };
                });

                const arr = await Promise.all(promises);
                setDataRows(arr);
            };

            fetchData();
        }, [data]);


        const columns = [
            { field: 'id', headerName: 'ID', width: 70 },
            { field: 'fullDate', headerName: 'Date et heure', width: 250 },
            {
                field: 'fiche',
                headerName: 'Fiche',
                width: 300,
                renderCell: (params) => (
                    <a href={params.value} target="_blank" rel="noopener noreferrer">
                        Voir Fiche
                    </a>
                ),
            },
        ];

        return (
            <div style={{ height: 200, width: '100%' }}>
                <DataGrid
                    rows={dataRows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 2 },
                        },
                    }}
                    pageSizeOptions={[2, 5]}

                />
            </div>
        );
    };


    const DefisTable = ({ data }) => {
        const [dataRows, setDataRows] = useState([]);

        function generateUniqueId() {
            // Use a timestamp or any other method to generate unique IDs
            return Date.now();
        }

        function formatTimestampToDateString(timestamp) {
            const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
            const formattedDate = new Date(timestamp).toLocaleDateString('fr-FR', options);

            return formattedDate;
        }


        useEffect(() => {
            const fetchData = async () => {
                const promises = data.map(async (elt) => {
                    const defiDataSnapshot = await getFichesByUid(elt.defiId);
                    const defiData = defiDataSnapshot.data();
                    return {
                        id: generateUniqueId(),
                        fullDate: formatTimestampToDateString(elt.date),
                        defi: defiData?.libelleFr,
                    };
                });

                const arr = await Promise.all(promises);
                setDataRows(arr);
            };

            fetchData();
        }, [data]);


        const columns = [
            { field: 'id', headerName: 'ID', width: 70 },
            { field: 'fullDate', headerName: 'Date et heure', width: 250 },
            {
                field: 'defi',
                headerName: 'Défi',
                width: 460,
            },
        ];

        return (
            <div style={{ height: 200, width: '100%' }}>
                <DataGrid
                    rows={dataRows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 2 },
                        },
                    }}
                    pageSizeOptions={[2, 5]}

                />
            </div>
        );
    };



    const QuestionsTable = ({ data }) => {
        const [dataRows, setDataRows] = useState([]);

        function generateUniqueId() {
            // Use a timestamp or any other method to generate unique IDs
            return Date.now();
        }

        function formatTimestampToDateString(timestamp) {
            const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
            const formattedDate = new Date(timestamp).toLocaleDateString('fr-FR', options);

            return formattedDate;
        }


        useEffect(() => {
            const fetchData = async () => {
                const promises = data.map(async (elt) => {
                    const questionDataSnapshot = await getQuestionsByUid(elt.question_id);
                    const questionData = questionDataSnapshot.data();

                    const pilierDataSnapshot = await getPiliersByUid(elt.pilier_id);
                    const pilierData = pilierDataSnapshot.data();

                    const answerDataSnapshot = await getAnswersByUid(elt.answer_id);
                    const answerData = answerDataSnapshot.data();

                    return {
                        id: generateUniqueId(),
                        fullDate: formatTimestampToDateString(elt.date),
                        question: questionData?.libelleFr,
                        pilier: pilierData?.libelleFr,
                        answer: answerData?.libelleFr
                    };
                });

                const arr = await Promise.all(promises);
                setDataRows(arr);
            };

            fetchData();
        }, [data]);


        const columns = [
            { field: 'id', headerName: 'ID', width: 70 },
            { field: 'fullDate', headerName: 'Date et heure', width: 250 },
            {
                field: 'question',
                headerName: 'Question',
                width: 200,
            },
            {
                field: 'answer',
                headerName: 'Réponse',
                width: 200,
            },
            {
                field: 'pilier',
                headerName: 'Pilier',
                width: 200,
            },
        ];

        return (
            <div style={{ height: 200, width: '100%' }}>
                <DataGrid
                    rows={dataRows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 2 },
                        },
                    }}
                    pageSizeOptions={[2, 5]}

                />
            </div>
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
                <div>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>

                        <Fab
                            variant="extended"
                            size="small"
                            color="default"
                            aria-label="info"
                            onClick={handleClose}
                        >
                            <SvgIcon fontSize="small">
                                <XCircleIcon />
                            </SvgIcon>
                        </Fab>
                    </Box>

                    <Box sx={style}>
                        <Stack direction={'column'} spacing={3}>
                            <Stack direction={'row'} spacing={2}>
                                <RadiusBox color={colors.primary} text="Connexion à l'application" number={connexionsData.length} />
                                <RadiusBox color={colors.success} text="Ouverture de l'application" number={ouverturesData.length} />
                                <RadiusBox color={colors.error} text="Fiches consultées" number={fichesData.length} />
                                <RadiusBox color={colors.info} text="Défis réalisés" number={defisData.length} />
                                <RadiusBox color={colors.warning} text="Réponses aux questionnaires" number={questionsData.length} />
                            </Stack>

                            <hr />

                            <Typography alignSelf={'center'} variant='h6'>Historiques des connexions</Typography>

                            {
                                isLoading1 == false && <ConnexionTable data={connexionsData} />
                            }

                            {
                                isLoading1 && <Stack display={'flex'} alignItems={'center'}><CircularProgress /></Stack>
                            }

                            <Typography alignSelf={'center'} variant='h6'>Historiques des ouvertures</Typography>

                            {
                                isLoading2 == false && <OuvertureTable data={ouverturesData} />
                            }

                            {
                                isLoading2 && <Stack display={'flex'} alignItems={'center'}><CircularProgress /></Stack>
                            }

                            <Typography alignSelf={'center'} variant='h6'>Fiches consultées</Typography>

                            {
                                isLoading3 == false && <FicheTable data={fichesData} />
                            }

                            {
                                isLoading3 && <Stack display={'flex'} alignItems={'center'}><CircularProgress/></Stack>
                            }

                            <Typography alignSelf={'center'} variant='h6'>Défis réalisés</Typography>

                            {
                                isLoading4 == false && <DefisTable data={defisData} />
                            }

                            {
                                isLoading4 && <Stack display={'flex'} alignItems={'center'}><CircularProgress/></Stack>
                            }

                            <Typography alignSelf={'center'} variant='h6'>Réponses aux questionnaires</Typography>

                            {
                                isLoading5 == false && <QuestionsTable data={questionsData} />
                            }

                            {
                                isLoading5 && <Stack display={'flex'} alignItems={'center'}><CircularProgress/></Stack>
                            }

                        </Stack>
                    </Box>
                </div>
            </Modal>
        </div>
    );

}
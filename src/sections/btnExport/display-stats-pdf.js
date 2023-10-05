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
    Fab,
    Skeleton,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';

import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    height: 550,
    maxHeight: 600, // Limite la hauteur pour que la boîte reste dans la vue
    overflow: 'auto', // Ajoute une barre de défilement si nécessaire
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    //borderRadius: 5
};



import { usePDF } from 'react-to-pdf';

import { getCompanyListByNiveau } from 'src/firebase/firebaseServices';
import { getCompanyListBySecteur } from 'src/firebase/firebaseServices';
import { OnSnapshot, Query } from 'src/firebase/firebaseConfig';

import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import { OverviewTraffic2 } from 'src/sections/overview/overview-traffic2';


export const DisplayStatsPdf = ({ handleClose, isOpen }) => {
    // const [iframeLoaded, setIframeLoaded] = useState(false);

    // useEffect(() => {
    //     if (isOpen) {
    //         setIframeLoaded(false);
    //     }

    // }, [isOpen]);

    // const handleIframeLoad = () => {
    //     setIframeLoaded(true);
    // };

    function getCurrentDate() {
        const now = new Date();

        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        return formattedDate;
    }


    function getCurrentDateTime() {
        const now = new Date();

        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        const formattedDateTime = `${day}/${month}/${year} à ${hours}h${minutes}`;

        return formattedDateTime;
    }

    const { toPDF, targetRef } = usePDF({ filename: `DiagEC_stats_company_${getCurrentDateTime()}.pdf` });

    const [retrievedData1, setRetrievedData1] = useState({});
    const [isLoading1, setIsLoading1] = useState(true);

    const [retrievedData2, setRetrievedData2] = useState({});
    const [isLoading2, setIsLoading2] = useState(true);


    useEffect(() => {
        const fetchData1 = async () => {
            try {
                const groupedData = await getCompanyListByNiveau();
                console.log(`groupedDataNiveau : ${JSON.stringify(groupedData)}`)
                setRetrievedData1(groupedData);
                setIsLoading1(false);
            } catch (error) {
                console.log('Error fetching data:', error);
                setIsLoading1(false);
            }
        };

        const fetchData2 = async () => {
            try {
                const groupedData = await getCompanyListBySecteur();
                console.log(`groupedDataSecteur : ${JSON.stringify(groupedData)}`)
                setRetrievedData2(groupedData);
                setIsLoading2(false);
            } catch (error) {
                console.log('Error fetching data:', error);
                setIsLoading2(false);
            }
        };

        fetchData1();
        fetchData2();
    }, []);


    return (
        <div>
            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div >
                    <Box
                        sx={style}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                padding: 2,
                            }}
                        >
                            <Button size="small" color="success" variant='contained' sx={{ marginRight: 3 }}
                                onClick={() => {toPDF(); handleClose();}}>
                                <SvgIcon fontSize="small">
                                    <ArrowDownOnSquareIcon />
                                </SvgIcon>
                                Exporter
                            </Button>

                            <Button size="small" color="error" variant='contained'
                                onClick={handleClose}>
                                <SvgIcon fontSize="small">
                                    <XCircleIcon />
                                </SvgIcon>
                            </Button>
                        </Box>

                        {/* Contenu supplémentaire ici */}
                        {/* <div>Autre contenu...</div> */}
                        <hr />

                        <div ref={targetRef}>
                            <Stack direction={'column'}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        padding: 2,
                                    }}
                                >
                                    <img
                                        src='/assets/logos/logo.png'
                                        style={{ objectFit: 'cover', width: '6%', height: '6%' }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        padding: 2,
                                    }}
                                >
                                    <Typography fontSize={20} variant='h2'>Données statistiques du {getCurrentDate()}</Typography>
                                </Box>
                                <Divider />

                                {
                                    Object.keys(retrievedData2).map((secteur, secteurIndex) => {
                                        return (
                                            <div key={secteurIndex} style={{borderStyle: 'solid', borderWidth: 1, borderColor: 'black'}}>
                                                <Typography fontSize={15} variant='h4' sx={{ margin: 2 }}>{secteur}</Typography>
                                                {
                                                    retrievedData2[secteur].length !== 0 ?
                                                        (
                                                            <TableContainer component={Paper}>
                                                                <Table stickyHeader sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                                                    <TableHead >
                                                                        <TableRow>
                                                                            <TableCell>Raison sociale</TableCell>
                                                                            <TableCell align="right">Email</TableCell>
                                                                            <TableCell align="right">Nombre de salariés</TableCell>
                                                                            <TableCell align="right">Poste</TableCell>
                                                                            <TableCell align="right">Adresse</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {retrievedData2[secteur].map((company, companyIndex) => (
                                                                            <TableRow
                                                                                key={companyIndex}
                                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                            >
                                                                                <TableCell component="th" scope="row">
                                                                                    {company.raisonSociale}
                                                                                </TableCell>
                                                                                <TableCell align="right">{company.email}</TableCell>
                                                                                <TableCell align="right">{company.nbreSalaries}</TableCell>
                                                                                <TableCell align="right">{company.poste}</TableCell>
                                                                                <TableCell align="right">{company.adresse}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        )
                                                        : (
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    flexDirection: 'row',
                                                                    justifyContent: 'center',
                                                                    padding: 2,
                                                                }}
                                                            >
                                                                <Typography fontSize={12} variant='h2'>Aucune donnée pour le moment</Typography>
                                                            </Box>
                                                        )
                                                }
                                            </div>
                                        );
                                    })
                                }


                                {
                                    isLoading2 && (
                                        <Box sx={{ width: 200 }}>
                                            <Skeleton variant="rectangular" width={210} height={118} />
                                        </Box>
                                    )
                                }







                                {
                                    Object.keys(retrievedData1).map((niveau, niveauIndex) => {
                                        return (
                                            <div key={niveauIndex} style={{borderStyle: 'solid', borderWidth: 1, borderColor: 'black'}}>
                                                <Typography fontSize={15} variant='h4' sx={{ margin: 2 }}>{niveau}</Typography>
                                                {
                                                    retrievedData1[niveau].length !== 0 ?
                                                        (
                                                            <TableContainer component={Paper}>
                                                                <Table stickyHeader sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>Raison sociale</TableCell>
                                                                            <TableCell align="right">Email</TableCell>
                                                                            <TableCell align="right">Nombre de salariés</TableCell>
                                                                            <TableCell align="right">Poste</TableCell>
                                                                            <TableCell align="right">Adresse</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {retrievedData1[niveau].map((company, companyIndex) => (
                                                                            <TableRow
                                                                                key={companyIndex}
                                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                            >
                                                                                <TableCell component="th" scope="row">
                                                                                    {company.raisonSociale}
                                                                                </TableCell>
                                                                                <TableCell align="right">{company.email}</TableCell>
                                                                                <TableCell align="right">{company.nbreSalaries}</TableCell>
                                                                                <TableCell align="right">{company.poste}</TableCell>
                                                                                <TableCell align="right">{company.adresse}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        )
                                                        : (
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    flexDirection: 'row',
                                                                    justifyContent: 'center',
                                                                    padding: 2,
                                                                }}
                                                            >
                                                                <Typography fontSize={12} variant='h2'>Aucune donnée pour le moment</Typography>
                                                            </Box>
                                                        )
                                                }
                                            </div>
                                        );
                                    })
                                }


                                {
                                    isLoading1 && (
                                        <Box sx={{ width: 200 }}>
                                            <Skeleton variant="rectangular" width={210} height={118} />
                                        </Box>
                                    )
                                }


                                <Typography fontSize={18} variant='h4' sx={{ marginY: 6, marginLeft: 2 }} color={'cornflowerblue'}>Graphiques</Typography>

                                <Stack direction={'row'} spacing={3}>
                                    <OverviewTraffic2
                                        sx={{ height: '100%' }}
                                    />
                                    <OverviewTraffic
                                        sx={{ height: '100%' }}
                                    />
                                </Stack>


                            </Stack>
                        </div>


                    </Box>
                </div>

            </Modal>
        </div>
    );
};

import { useState, useEffect } from 'react';
import { Button, SvgIcon, Modal, Box, CircularProgress, Typography } from '@mui/material';
import ArrowDownTrayIcon from '@heroicons/react/24/solid/ArrowDownTrayIcon';


import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


import { getCompanyListByNiveau } from 'src/firebase/firebaseServices';
import { getCompanyListBySecteur } from 'src/firebase/firebaseServices';
import { OnSnapshot, Query } from 'src/firebase/firebaseConfig';


export const ExportEXCEL = (props) => {

    const Case = {
        SECTEUR: 'Secteur',
        NIVEAU: 'Niveau',
    };


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

    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = '.xlsx';
    const fileName = `DiagEC_stats_company`;

    // const processExport = async (excelData , cas) => {
    //     const ws = XLSX.utils.json_to_sheet(excelData);
    //     XLSX.utils.sheet_add_aoa(ws, [["Raison sociale", "Email", cas, "Nombre de salariés","Poste","Adresse","Score EC","Progression","Niveau"]], { origin: "A1" });
    //     const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    //     // XLSX.utils.book_append_sheet(wb,ws,"autres");
    //     const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    //     const data = new Blob([excelBuffer], { type: fileType });
    //     FileSaver.saveAs(data, `${fileName}_${getCurrentDateTime()}${fileExtension}`);
    // }

    const [isExportStart, setIsExportStart] = useState(false);

    const processExport = async (excelData) => {
        setIsExportStart(true);

        const ws = XLSX.utils.aoa_to_sheet([[]]); // Créer une feuille de calcul vide

        // Extraire tous les libellés de Pilier uniques
        const uniquePilierLabels = Array.from(
            new Set(excelData.flatMap((item) => item.pilierScores?.map((pilierScore) => pilierScore.pilier.libelleFr)))
        );

        // Extraire tous les libellés de Question uniques
        const uniqueQuestionLabels = Array.from(
            new Set(excelData.flatMap((item) => item.questions?.map((question) => question.libelleFr)))
        );


        // Extraire tous les libellés de défis uniques
        const uniqueDefiLabels = Array.from(
            new Set(excelData.flatMap((item) => item.questions?.flatMap((question) => question?.defis.map((defi) => defi.libelleFr)) || []))
        );



        // Ajouter l'en-tête à la feuille de calcul
        const headers = ["Raison sociale", "Email", "Secteur", "Nombre de salariés", "Poste", "Adresse", "Marché de référence", "Score EC", "Progression", "Niveau", ...uniqueQuestionLabels, ...uniquePilierLabels, ...uniqueDefiLabels];
        XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });

        // Boucle pour insérer les données dans la feuille de calcul
        excelData.forEach((data, rowIndex) => {
            // Initialiser la ligne avec des valeurs vides
            const rowData = Array(headers.length).fill("");

            const headers2 = ["raisonSociale", "email", "secteur", "nbreSalaries", "poste", "adresse", "marchesref", "score", "progression", "niveau", ...uniqueQuestionLabels, ...uniquePilierLabels, ...uniqueDefiLabels];

            // Remplir les valeurs de base (Raison sociale, Email, etc.)
            headers2.forEach((header, colIndex) => {
                switch (header) {
                    case "raisonSociale":
                    case "email":
                    case "nbreSalaries":
                    case "poste":
                    case "adresse":
                    case "marchesref":
                    case "score":
                    case "progression":
                    case "niveau":
                    case "secteur":
                        rowData[colIndex] = data[header] || ""; // Assure-toi que la valeur existe ou est une chaîne vide
                        break;
                    default:
                        break;
                }
            });

            // Remplir les scores de Pilier
            data.pilierScores?.forEach((pilierScore) => {
                const pilierIndex = headers.indexOf(pilierScore.pilier.libelleFr);
                if (pilierIndex !== -1) {
                    // rowData[pilierIndex] = pilierScore.score;
                    rowData[pilierIndex] = pilierScore.score != null ? (isNaN(arrondirA2Decimales(pilierScore.score)) ? `0%` : `${arrondirA2Decimales(pilierScore.score)}%`) : `0%`;
                }
            });

            // Remplir les libellés des questions
            data.questions?.forEach((question) => {
                const questionIndex = headers.indexOf(question.libelleFr);
                if (questionIndex !== -1) {
                    rowData[questionIndex] = question.answers.find(elt => elt.isAnswered == true)?.libelle
                }
            });

            // Remplir les libellés des défis
            data.questions?.forEach((question) => {
                question.defis.forEach((defi) => {
                    const defiIndex = headers.indexOf(defi.libelleFr);
                    if (defiIndex !== -1) {
                        rowData[defiIndex] = defi.isDone == false ? "En cours" : "Terminé"
                    }
                })
            });

            // Insérer la ligne de données dans la feuille de calcul
            XLSX.utils.sheet_add_aoa(ws, [rowData], { origin: { r: rowIndex + 2, c: 0 } });
        });

        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        setTimeout(() => {
            setIsExportStart(false);
            FileSaver.saveAs(data, `${fileName}_${getCurrentDateTime()}${fileExtension}`);
        }, 2000);
    };


    function arrondirA2Decimales(nombre) {
        return Math.round(nombre * 100) / 100;
    }

    function getLevel(nombre) {
        if (nombre < 20) {
            return "Débutant(e)";
        } else if (nombre < 50) {
            return "Intermédiaire";
        } else if (nombre < 70) {
            return "Confirmé(e)";
        } else if (nombre < 99) {
            return "Avancé(e)";
        } else if (nombre == 100) {
            return "Expert(e)";
        }
    }



    const [retrievedData1, setRetrievedData1] = useState({});
    const [isLoading1, setIsLoading1] = useState(true);

    const [retrievedData2, setRetrievedData2] = useState({});
    const [isLoading2, setIsLoading2] = useState(true);


    useEffect(() => {
        const fetchData1 = async () => {
            try {
                const arr = []
                const groupedData = await getCompanyListByNiveau();
                console.clear();
                console.log(`groupedDataNiveau : ${JSON.stringify(groupedData)}`)
                Object.keys(groupedData).map((objK) => {
                    groupedData[objK].map((elt) => {
                        const marchesrefLib = elt?.marchesref.map(({ libelle }) => ({ libelle }));
                        const obj = {
                            raisonSociale: elt.raisonSociale,
                            email: elt.email,
                            niveau: elt.niveauAppartenance.libelleFr,
                            nbreSalaries: elt.nbreSalaries,
                            poste: elt.poste,
                            adresse: elt.adresse,
                            marchesref: JSON.stringify(elt?.marchesref),
                            score: elt.score != null ? (isNaN(arrondirA2Decimales(elt.score)) ? `0%` : `${arrondirA2Decimales(elt.score)}%`) : `0%`,
                            progression: getLevel(elt.score != null ? (isNaN(arrondirA2Decimales(elt.score)) ? 0 : arrondirA2Decimales(elt.score)) : 0),
                            pilierScores: elt.pilierScores,
                            questions: elt.questions
                        }
                        arr.push(obj)
                    })
                })
                setRetrievedData1(arr);
                setIsLoading1(false);
            } catch (error) {
                console.log('Error fetching data:', error);
                setIsLoading1(false);
            }
        };

        const fetchData2 = async () => {
            try {
                const arr = []
                const groupedData = await getCompanyListBySecteur();
                console.clear();
                console.log(`groupedDataSecteur : ${JSON.stringify(groupedData)}`)
                Object.keys(groupedData).map((objK) => {
                    groupedData[objK].map((elt) => {
                        const obj = {
                            raisonSociale: elt.raisonSociale,
                            email: elt.email,
                            secteur: elt.secteurAppartenance.libelleFr,
                            nbreSalaries: elt.nbreSalaries,
                            poste: elt.poste,
                            adresse: elt.adresse,
                            marchesref: JSON.stringify(elt?.marchesref),
                            score: elt.score != null ? (isNaN(arrondirA2Decimales(elt.score)) ? `0%` : `${arrondirA2Decimales(elt.score)}%`) : `0%`,
                            progression: getLevel(elt.score != null ? (isNaN(arrondirA2Decimales(elt.score)) ? 0 : arrondirA2Decimales(elt.score)) : 0),
                            niveau: elt.niveauAppartenance.libelleFr,
                            pilierScores: elt.pilierScores,
                            questions: elt.questions
                        }
                        arr.push(obj)
                    })
                })
                setRetrievedData2(arr);
                setIsLoading2(false);
            } catch (error) {
                console.log('Error fetching data:', error);
                setIsLoading2(false);
            }
        };

        fetchData1();
        fetchData2();
    }, []);




    const execProcessExport = () => {
        if (isLoading1 == false && isLoading2 == false) {
            processExport(retrievedData2);
            // processExport(retrievedData1, Case.NIVEAU);
        }
    }


    return (
        <Button variant="contained" color='warning'
            endIcon={
                !isExportStart && (
                    <SvgIcon>
                        <ArrowDownTrayIcon />
                    </SvgIcon>
                )
            }
            onClick={() => execProcessExport()}
            disabled={isExportStart}
        >

            {isExportStart ?
                (<><CircularProgress size={24} color="warning" sx={{ mr: 2 }} /> <Typography>Exportation en cours...</Typography></>) :
                'Exporter les données statistiques en EXCEL'
            }
        </Button>
    );
};



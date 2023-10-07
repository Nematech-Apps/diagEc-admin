import { useState, useEffect } from 'react';
import { Button, SvgIcon } from '@mui/material';
import ArrowDownTrayIcon from '@heroicons/react/24/solid/ArrowDownTrayIcon';


import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


import { getCompanyListByNiveau } from 'src/firebase/firebaseServices';
import { getCompanyListBySecteur } from 'src/firebase/firebaseServices';
import { OnSnapshot, Query } from 'src/firebase/firebaseConfig';


export const ExportEXCEL = (props) => {

    const Case = {
        SECTEUR: 'secteur',
        NIVEAU: 'niveau',
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
    const fileName = `DiagEC_stats_company_by_`;

    const processExport = async (excelData , cas) => {
        const ws = XLSX.utils.json_to_sheet(excelData);;
        XLSX.utils.sheet_add_aoa(ws, [["Raison sociale", "Email", "Secteur", "Nombre de salariés","Poste","Adresse","Score EC","Progression"]], { origin: "A1",  });
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, `${fileName}${cas}_${getCurrentDateTime()}${fileExtension}`);
    }

    function arrondirA2Decimales(nombre) {
        return Math.round(nombre * 100) / 100;
    }

    function getLevel(nombre) {
        if(nombre < 20) {
            return "Débutant(e)";
        } else if(nombre < 50) {
            return "Intermédiaire";
        } else if(nombre < 70) {
            return "Confirmé(e)";
        } else if(nombre < 99) {
            return "Avancé(e)";
        } else if(nombre == 100) {
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
                console.log(`groupedDataNiveau : ${JSON.stringify(groupedData)}`)
                Object.keys(groupedData).map((objK) => {
                    groupedData[objK].map((elt) => {
                        const obj = {
                            raisonSociale : elt.raisonSociale,
                            email : elt.email,
                            niveau : elt.niveauAppartenance.libelleFr,
                            nbreSalaries : elt.nbreSalaries,
                            poste : elt.poste,
                            adresse : elt.adresse,
                            score : elt.score != null ? (isNaN(arrondirA2Decimales(elt.score)) ? `0%` : `${arrondirA2Decimales(elt.score)}%`) : `0%`,
                            progression : getLevel(elt.score != null ? (isNaN(arrondirA2Decimales(elt.score)) ? 0 : arrondirA2Decimales(elt.score)) : 0)
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
                console.log(`groupedDataSecteur : ${JSON.stringify(groupedData)}`)
                Object.keys(groupedData).map((objK) => {
                    groupedData[objK].map((elt) => {
                        const obj = {
                            raisonSociale : elt.raisonSociale,
                            email : elt.email,
                            secteur : elt.secteurAppartenance.libelleFr,
                            nbreSalaries : elt.nbreSalaries,
                            poste : elt.poste,
                            adresse : elt.adresse,
                            score : elt.score != null ? (isNaN(arrondirA2Decimales(elt.score)) ? `0%` : `${arrondirA2Decimales(elt.score)}%`) : `0%`,
                            progression : getLevel(elt.score != null ? (isNaN(arrondirA2Decimales(elt.score)) ? 0 : arrondirA2Decimales(elt.score)) : 0)
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
        if(isLoading1 == false && isLoading2 == false) {
            processExport(retrievedData2, Case.SECTEUR);
            processExport(retrievedData1, Case.NIVEAU);
        }
    }


    return (
        <Button variant="contained" color='warning'
            endIcon={
                <SvgIcon>
                    <ArrowDownTrayIcon />
                </SvgIcon>
            }
            onClick={() => execProcessExport()}
        >
            Exporter les données statistiques en EXCEL
        </Button>
    );
};



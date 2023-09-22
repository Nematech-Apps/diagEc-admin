import { useState, useEffect } from 'react';
import { Button, SvgIcon } from '@mui/material';
import ArrowDownTrayIcon from '@heroicons/react/24/solid/ArrowDownTrayIcon';


export const ExportPDF = (props) => {


    return (
        <Button variant="contained" color='info'
            endIcon={
                <SvgIcon>
                    <ArrowDownTrayIcon />
                </SvgIcon>
            }
        >
            Exporter les données statistiques en PDF
        </Button>
    );
};



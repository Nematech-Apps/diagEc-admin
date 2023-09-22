import { useState, useEffect } from 'react';
import { Button, SvgIcon } from '@mui/material';
import ArrowDownTrayIcon from '@heroicons/react/24/solid/ArrowDownTrayIcon';


export const ExportEXCEL = (props) => {


    return (
        <Button variant="contained" color='warning'
            endIcon={
                <SvgIcon>
                    <ArrowDownTrayIcon />
                </SvgIcon>
            }
        >
            Exporter les données statistiques en EXCEL
        </Button>
    );
};



import { useState, useEffect } from 'react';
import { Button, SvgIcon } from '@mui/material';
import ArrowDownTrayIcon from '@heroicons/react/24/solid/ArrowDownTrayIcon';
import { DisplayStatsPdf } from './display-stats-pdf';


export const ExportPDF = (props) => {

    const [isDisplayFileModalOpen, setIsDisplayFileModalOpen] = useState(false);

    const handleShowFileComponent = (event) => {
        setIsDisplayFileModalOpen(true);
    }

    return (
        <>
            <Button variant="contained" color='info'
                endIcon={
                    <SvgIcon>
                        <ArrowDownTrayIcon />
                    </SvgIcon>
                }
                onClick={handleShowFileComponent}
            >
                Exporter les données statistiques en PDF
            </Button>
            {isDisplayFileModalOpen && <DisplayStatsPdf isOpen={isDisplayFileModalOpen}
                handleClose={() => setIsDisplayFileModalOpen(false)} />}
        </>
    );
};



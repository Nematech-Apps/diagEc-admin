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
    SvgIcon
} from '@mui/material';

import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 770,
    height: 550,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    //borderRadius: 5
};

export const DisplayFicheReflexe = ({ handleClose, isOpen, fileUrl }) => {
    const [iframeLoaded, setIframeLoaded] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIframeLoaded(false);
        }

    }, [isOpen]);

    const handleIframeLoad = () => {
        setIframeLoaded(true);
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

                    {!iframeLoaded && (
                        <Typography variant="body1" align="center">
                            Chargement...
                        </Typography>
                    )}
                    <iframe
                        src={fileUrl}
                        width="100%"
                        height="100%"
                        onLoad={handleIframeLoad}
                        style={{ display: iframeLoaded ? 'block' : 'none' }}
                    />
                </Box>
            </Modal>
        </div>
    );
};

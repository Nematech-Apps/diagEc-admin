import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';


export const CustomAlert = ({ message, type }) => {
    const [open, setOpen] = React.useState(true);

    return (
        <Box sx={{ width: '100%', mb: 5 }}>
            <Alert
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        X
                    </IconButton>
                }
                sx={{ mb: 2 }}
                variant="outlined"
                severity={type}
            >
                {message}
            </Alert>
        </Box>
    );
}
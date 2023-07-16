import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Stack } from '@mui/material';
import DocumentIcon from '@heroicons/react/24/solid/DocumentIcon';

const FilePicker = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Veuillez choisir un fichier PDF.');
    }
  };

  return (
    <div>
      <Stack direction={'row'}
spacing={3}>
        <Input
          accept="application/pdf"
          id="file-input"
          type="file"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-input">
          <Button variant="outlined"
startIcon={<DocumentIcon />}
component="span">
            Choisir un fichier
          </Button>
        </label>
        <label>
        {selectedFile && selectedFile.name}
        </label>
        
      </Stack>
    </div>
  );
};

export default FilePicker;

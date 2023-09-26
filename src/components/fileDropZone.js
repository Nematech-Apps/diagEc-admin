import React, { useState, useRef } from 'react';
import {
    Paper,
    Typography
} from '@mui/material';


const FileDropZone = ({ allowMultiple = true, onFilesSelected }) => {
    const [droppedFiles, setDroppedFiles] = useState([]);
    const fileInputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);

        // Filtrer les fichiers pour ne conserver que les fichiers PDF
        const pdfFiles = files.filter((file) => {
            return file.type === 'application/pdf' || file.name.endsWith('.pdf');
        });

        if (pdfFiles.length === 0) {
            alert('Veuillez sélectionner un fichier PDF.');
            return;
        }
        
        if (!allowMultiple) {
            setDroppedFiles([files[0]]);
            onFilesSelected([files[0]]);
        } else {
            setDroppedFiles(files);
            onFilesSelected(files);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleFileInputChange = (e) => {
        const files = Array.from(e.target.files);

        // Filtrer les fichiers pour ne conserver que les fichiers PDF
        const pdfFiles = files.filter((file) => {
            return file.type === 'application/pdf' || file.name.endsWith('.pdf');
        });

        if (pdfFiles.length === 0) {
            alert('Veuillez sélectionner un fichier PDF.');
            return;
        }

        if (!allowMultiple) {
            setDroppedFiles([pdfFiles[0]]);
            onFilesSelected([pdfFiles[0]]);
        } else {
            setDroppedFiles(pdfFiles);
            onFilesSelected(pdfFiles);
        }
    };


    const getExtension = (filename) => {
        return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
    };

    const formatFileName = (file) => {
        const fileName = file.name;
        const fileExtension = getExtension(fileName);
        return `${fileName.substring(0, fileName.length / 2)}...${fileExtension}`;
    };


    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={
                {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 10,
                    border: '2px dashed #aaa',
                    borderRadius: 3,
                    cursor: 'pointer',
                }
            }
        >
            <Typography variant="h6">Déposer la fiche ici</Typography>
            <input
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileInputChange}
                multiple={allowMultiple}
            />
            ou
            <button onClick={() => fileInputRef.current.click()}>Sélectionner la fiche</button>
            <div style={
                {
                    marginTop: 2,
                    textAlign: 'left'
                }
            }
            >
                {droppedFiles.map((file, index) => (
                    <div key={index}>
                        {formatFileName(file)} ({(file.size / 1024).toFixed(2)} KB)
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileDropZone;

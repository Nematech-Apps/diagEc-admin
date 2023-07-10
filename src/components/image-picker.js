import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Stack } from '@mui/material';
import DocumentIcon from '@heroicons/react/24/solid/DocumentIcon';


const ImagePicker = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [resizedImage, setResizedImage] = useState(null);
    const [newWidth, setNewWidth] = useState(60);
    const [newHeight, setNewHeight] = useState(60);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            resizeImage(file);
        } else {
            alert('Veuillez choisir une image');
        }

    };

    const resizeImage = (imageFile) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = newWidth;
                canvas.height = newHeight;
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
                canvas.toBlob((blob) => {
                    setResizedImage(blob);
                }, imageFile.type);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(imageFile);
    };

    return (
        <div>
            <Stack direction={'row'} spacing={3}>
                <Input
                    accept="image/*"
                    id="image-input"
                    type="file"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                />
                <label htmlFor="image-input">
                    <Button variant="outlined" startIcon={<DocumentIcon />} component="span">
                        Choisir une image
                    </Button>
                </label>
                {selectedImage && (
                    <div>
                        {resizedImage && (
                            <div>
                                <img src={URL.createObjectURL(resizedImage)} alt="Resized" />
                            </div>
                        )}
                    </div>
                )}
            </Stack>
        </div>
    );
};

export default ImagePicker;

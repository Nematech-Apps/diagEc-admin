import { useCallback, useState, useEffect } from 'react';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Stack,
    SvgIcon,
    IconButton,
    Alert,
    TextField,
    Typography
} from '@mui/material';

import { useAuth } from 'src/hooks/use-auth';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { addSecteur } from 'src/firebase/firebaseServices';
import { db, GetDoc, Doc, UpdateDoc } from 'src/firebase/firebaseConfig';
import ToastComponent from '../../components/toast';

import EyeIcon from '@heroicons/react/24/solid/EyeIcon';

import EyeSlashIcon from '@heroicons/react/24/solid/EyeSlashIcon';

import ArrowPathRoundedSquareIcon from '@heroicons/react/24/solid/ArrowPathRoundedSquareIcon';

import ClipboardDocumentListIcon from '@heroicons/react/24/solid/ClipboardDocumentListIcon';

import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';


export const CreateUser = () => {
    const auth = useAuth();
    const [isOnCreate, setIsOnCreate] = useState(false);
    const [passwordFieldType, setPasswordFieldType] = useState('password');
    const [clipboardData, setClipboardData] = useState('');

    const formik = useFormik({
        initialValues: {
            email: '',
            identifiant: '',
            password: '',
            submit: null
        },
        validationSchema: Yup.object({
            email: Yup.string().max(255).required("L'email est requis"),
            identifiant: Yup.string().max(255).required("L'identifiant est requis"),
            password: Yup.string()
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/,
                    "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre, et un caractère spécial."
                )
                .required("Le mot de passe est requis")
                .min(8, "Le mot de passe doit avoir une longueur d'au moins 8 caractères"),
        }),
        onSubmit: async (values, helpers) => {
            setIsOnCreate(true);
            const credentials = {
                email: values.email,
                identifiant: values.identifiant,
                pwd: values.password,
                role: "ADMIN"
            }
            try {
                auth.signUp(credentials);
                helpers.resetForm();
                setIsOnCreate(false);
            } catch (err) {
                setIsOnCreate(false);
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
                return ToastComponent({ message: err.message, type: 'error' });
            }
        }
    });

    function getRandomChar(characters) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        return characters.charAt(randomIndex);
    }

    function generatePassword(length = 8) {
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numericChars = '0123456789';
        const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

        const allChars = lowercaseChars + uppercaseChars + numericChars + specialChars;

        let password = '';

        password += getRandomChar(lowercaseChars);
        password += getRandomChar(uppercaseChars);
        password += getRandomChar(numericChars);
        password += getRandomChar(specialChars);

        while (password.length < length) {
            password += getRandomChar(allChars);
        }

        return password;
    }



    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                setClipboardData(text);
            })
            .catch((err) => {
                console.error('Unable to copy text to clipboard', err);
            });
    }

    return (
        <form noValidate onSubmit={formik.handleSubmit}>
            <Card>
                <CardHeader
                    title={
                        <Stack direction={'row'} spacing={1}>
                            <SvgIcon>
                                <UserPlusIcon/>
                            </SvgIcon>
                            <Typography>Ajouter un utilisateur</Typography>
                        </Stack>
                    }
                />
                <Divider />
                <CardContent>
                    <Stack spacing={3} sx={{ maxWidth: 800 }}>
                        <TextField
                            error={!!(formik.touched.email && formik.errors.email)}
                            fullWidth
                            helperText={formik.touched.email && formik.errors.email}
                            label="Email"
                            name="email"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="email"
                            value={formik.values.email}
                        />

                        <TextField
                            error={!!(formik.touched.identifiant && formik.errors.identifiant)}
                            fullWidth
                            helperText={formik.touched.identifiant && formik.errors.identifiant}
                            label="Identifiant"
                            name="identifiant"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="text"
                            value={formik.values.identifiant}
                        />

                        {
                            clipboardData != "" &&
                            <Alert variant="outlined" severity="success">
                                Le mot de passe a été copié avec succès dans le presse-papiers
                            </Alert>
                        }

                        <Stack direction={'row'} spacing={4}>
                            <TextField
                                error={!!(formik.touched.password && formik.errors.password)}
                                fullWidth
                                helperText={formik.touched.password && formik.errors.password}
                                label="Mot de passe"
                                name="password"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                type={passwordFieldType}
                                value={formik.values.password}
                            />

                            <IconButton
                                color='success'
                                size='small'
                                onClick={() => formik.setFieldValue("password", generatePassword(20))}
                            >
                                <SvgIcon>
                                    <ArrowPathRoundedSquareIcon />
                                </SvgIcon>
                            </IconButton>

                            <IconButton
                                color='warning'
                                size='small'
                                onClick={() => setPasswordFieldType((prev) => prev == "password" ? "text" : "password")}
                            >
                                <SvgIcon>
                                    {
                                        passwordFieldType == "password" &&
                                        <EyeIcon />
                                    }
                                    {
                                        passwordFieldType == "text" &&
                                        <EyeSlashIcon />
                                    }
                                </SvgIcon>
                            </IconButton>

                            <IconButton
                                variant="contained"
                                color='inherit'
                                size='small'
                                onClick={() => copyToClipboard(formik.values.password)}
                            >
                                <SvgIcon>
                                    <ClipboardDocumentListIcon />
                                </SvgIcon>
                            </IconButton>


                        </Stack>


                    </Stack>

                    {formik.errors.submit && (
                        <Typography
                            color="error"
                            sx={{ mt: 3 }}
                            variant="body2"
                        >
                            {formik.errors.submit}
                        </Typography>
                    )}
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button variant="contained" type='submit' disabled={isOnCreate}>
                        Ajouter
                    </Button>
                </CardActions>
            </Card>
        </form>
    );
};

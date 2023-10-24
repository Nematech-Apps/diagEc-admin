import { useCallback, useState, useEffect } from 'react';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Stack,
    TextField,
    Typography
} from '@mui/material';

import { useAuth } from 'src/hooks/use-auth';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { addSecteur } from 'src/firebase/firebaseServices';
import { db, GetDoc, Doc, UpdateDoc } from 'src/firebase/firebaseConfig';
import ToastComponent from '../../components/toast';



export const CreateUser = () => {

    const auth = useAuth();

    const [isOnCreate, setIsOnCreate] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            identifiant: '',
            password: '',
            submit: null
        },
        validationSchema: Yup.object({
            email: Yup
                .string()
                .max(255)
                .required("L'email est requis"),
            identifiant: Yup
                .string()
                .max(255)
                .required("L'identifiant est requis"),
            password: Yup
                .string()
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    "Le mot de passe doit contenir au moins un caractère en minuscule, un caractère en majuscule, un chiffre, un caractère spécial, et doit avoir une longueur d'au moins 8 caractères."
                )
                .max(255)
                .required("Le mot de passe est requis")
        }),
        onSubmit: async (values, helpers) => {
            // try{
            //   return ToastComponent({message: 'Opération effectué avec succès', type: 'success'});
            // } catch(err){
            //   helpers.setStatus({ success: false });
            //   helpers.setErrors({ submit: err.message });
            //   helpers.setSubmitting(false);
            //   return ToastComponent({message: err.message, type: 'error'});
            // }
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

    return (
        <form noValidate
            onSubmit={formik.handleSubmit}>
            <Card>
                <CardHeader
                    //subheader="catégorie"
                    title="Ajouter un utilisateur"
                />
                <Divider />
                <CardContent>
                    <Stack
                        spacing={3}
                        sx={{ maxWidth: 800 }}
                    >
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

                        <TextField
                            error={!!(formik.touched.password && formik.errors.password)}
                            fullWidth
                            helperText={formik.touched.password && formik.errors.password}
                            label="Mot de passe"
                            name="password"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="password"
                            value={formik.values.password}
                        />

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
                    <Button variant="contained"
                        type='submit' disabled={isOnCreate}>
                        Ajouter
                    </Button>
                </CardActions>
            </Card>
        </form>
    );
};

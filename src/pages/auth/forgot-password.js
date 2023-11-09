import { useCallback, useState, useEffect } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';

import { useAuthContext } from '../../contexts/auth-context';

import { checkIfUserWithEmailProvidedExist } from '../../firebase/firebaseServices';

import ToastComponent from 'src/components/toast';

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const { isAuthenticated } = useAuthContext();
  const [method, setMethod] = useState('email');

  const [isEmailSent, setIsEmailSent] = useState(null);

  useEffect(() => {
    console.log(isAuthenticated);
    if (isAuthenticated) {
      router.push('/');
    }
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('veuillez entrer un email valide')
        .max(255)
        .required("L'email est requis")
    }),
    onSubmit: async (values, helpers) => {
      try {
        const methods = await checkIfUserWithEmailProvidedExist(values.email);
        if (methods && methods.length > 0) {
          // User with the provided email exists, proceed to send password reset email
          await auth.resetUserPassword(values.email);
          setIsEmailSent("sent");
          helpers.resetForm();
          setTimeout(() => {
            router.push('/auth/login');
          }, 5000);
        } else {
          setIsEmailSent("not sent");
          helpers.resetForm();
          console.log('User with the provided email does not exist.');
          // You can handle this case as needed, maybe show an error message to the user
        }
        
        // await auth.signIn(values.email, values.password);
        // console.log(isAuthenticated)
        // if (isAuthenticated) {
        //   router.push('/');
        // }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const handleMethodChange = useCallback(
    (event, value) => {
      setMethod(value);
    },
    []
  );

  // const handleSkip = useCallback(
  //   () => {
  //     auth.skip();
  //     router.push('/');
  //   },
  //   [auth, router]
  // );

  return (
    <>
      <Head>
        <title>
          Récupération du mot de passe | Diag'Ec
        </title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Réinitialisation du mot de passe
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Un lien de réinitialisation de mot de passe vous sera envoyé sur l'email indiqué
                &nbsp;
                
              </Typography>
              {
                isEmailSent == "not sent" && <Alert severity="error">Compte introuvable!</Alert>
              }
              {
                isEmailSent == "sent" && <Alert severity="success">Email envoyé avec succès!</Alert>
              }
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
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
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Récupérer
              </Button>
              
            </form>
            
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;

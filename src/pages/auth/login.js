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
  Typography,
  CircularProgress,
  Paper
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';

import { useAuthContext } from '../../contexts/auth-context';


import { updateUserCollection } from 'src/firebase/firebaseServices';
import { auth as firebaseAuth } from '../../firebase/firebaseConfig';

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const { isAuthenticated } = useAuthContext();
  const [method, setMethod] = useState('email');
  const [isLoading, setLoading] = useState(false);


  function getCurrentDateTime() {
    const now = new Date();

    const day = now.getDate();
    const monthNames = [
      'janvier', 'février', 'mars',
      'avril', 'mai', 'juin', 'juillet',
      'août', 'septembre', 'octobre',
      'novembre', 'décembre'
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const formattedDateTime = `${day} ${month} ${year} à ${hours}h${minutes}`;

    return formattedDateTime;
  }

  useEffect(() => {
    console.log(isAuthenticated);
    if (isAuthenticated) {
      router.push('/');
    }
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('veuillez entrer un email valide')
        .max(255)
        .required("L'email est requis"),
      password: Yup
        .string()
        .max(255)
        .required('Mot de passe est requis')
    }),
    onSubmit: async (values, helpers) => {
      setLoading(true);
      try {
        await auth.signIn(values.email, values.password);
        console.log(getCurrentDateTime());
        updateUserCollection(getCurrentDateTime(), firebaseAuth.currentUser?.uid)
          .catch((err) => {
            console.log(err);
          });
        if (isAuthenticated) {
          setLoading(false);
          router.push('/');
        }
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } catch (err) {
        setLoading(false);
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
          Authentification | Diag'Ec
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
                Se connecter
              </Typography>
              {/* <Typography
                color="text.secondary"
                variant="body2"
              >
                Vous n'avez pas encore de compte ?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Créer un compte
                </Link>
              </Typography> */}
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
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Mot de passe oublié ?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/forgot-password"
                  underline="hover"
                  variant="subtitle2"
                >
                  Récupération
                </Link>
              </Typography>
              {/* <FormHelperText sx={{ mt: 1 }}>
                  Optionally you can skip.
                </FormHelperText> */}
              {formik.errors.submit && (
                <Typography
                  color="error"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  {formik.errors.submit}
                </Typography>
              )}
              {/* {
                isLoading ?
                  (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) :
                  (
                    <Button
                      fullWidth
                      size="large"
                      sx={{ mt: 3 }}
                      type="submit"
                      variant="contained"
                    >
                      Connexion
                    </Button>
                  )
              } */}

              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Connexion'}
              </Button>


              {/* <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  onClick={handleSkip}
                >
                  Skip authentication
                </Button>
                <Alert
                  color="primary"
                  severity="info"
                  sx={{ mt: 3 }}
                >
                  <div>
                    You can use <b>demo@devias.io</b> and password <b>Password123!</b>
                  </div>
                </Alert> */}
            </form>
            {/* <Tabs
              onChange={handleMethodChange}
              sx={{ mb: 3 }}
              value={method}
            >
              <Tab
                label="Email"
                value="email"
              />
              <Tab
                label="Phone Number"
                value="phoneNumber"
              />
            </Tabs>
            {method === 'email' && (
              <form
                noValidate
                onSubmit={formik.handleSubmit}
              >
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="Email Address"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                    value={formik.values.email}
                  />
                  <TextField
                    error={!!(formik.touched.password && formik.errors.password)}
                    fullWidth
                    helperText={formik.touched.password && formik.errors.password}
                    label="Password"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.password}
                  />
                </Stack>
                <FormHelperText sx={{ mt: 1 }}>
                  Optionally you can skip.
                </FormHelperText>
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
                  Continue
                </Button>
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  onClick={handleSkip}
                >
                  Skip authentication
                </Button>
                <Alert
                  color="primary"
                  severity="info"
                  sx={{ mt: 3 }}
                >
                  <div>
                    You can use <b>demo@devias.io</b> and password <b>Password123!</b>
                  </div>
                </Alert>
              </form>
            )}
            {method === 'phoneNumber' && (
              <div>
                <Typography
                  sx={{ mb: 1 }}
                  variant="h6"
                >
                  Not available in the demo
                </Typography>
                <Typography color="text.secondary">
                  To prevent unnecessary costs we disabled this feature in the demo.
                </Typography>
              </div>
            )} */}
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

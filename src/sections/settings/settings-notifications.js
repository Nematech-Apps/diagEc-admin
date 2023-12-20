import { useCallback } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  InputLabel,
  Select,
  SvgIcon,
  Box,
  FormControl,
  MenuItem
} from '@mui/material';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import ToastComponent from 'src/components/toast';

import { updateSettings } from 'src/firebase/firebaseServices';

import ArrowUturnRightIcon from '@heroicons/react/24/solid/ArrowUturnRightIcon';

export const SettingsNotifications = () => {
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

  const apps = ["Web", "Mobile"]
  const modes = ["Maintenance", "Production"];

  const formik = useFormik({
    initialValues: {
      app: '',
      mode: '',
      submit: null
    },
    validationSchema: Yup.object({
      app: Yup
        .string()
        .required("Une app doit être sélectionnée"),
      mode: Yup
        .string()
        .required("Un mode doit être sélectionné")
    }),
    onSubmit: async (values, helpers) => {
      const app = values.app

      if (app === "Web") {
        const data = {
          maintenanceMode2: values.mode == "Maintenance" ? "1" : "0"
        }
        updateSettings(data)
          .then(() => {
            helpers.resetForm();
            return ToastComponent({ message: 'Opération effectuée avec succès', type: 'success' });
          })
          .catch((err) => {
            helpers.setStatus({ success: false });
            helpers.setErrors({ submit: err.message });
            helpers.setSubmitting(false);
            return ToastComponent({ message: err.message, type: 'error' });
          })
      } else if (app === "Mobile") {
        const data = {
          maintenanceMode: values.mode == "Maintenance" ? "1" : "0"
        }
        updateSettings(data)
          .then(() => {
            helpers.resetForm();
            return ToastComponent({ message: 'Opération effectuée avec succès', type: 'success' });
          })
          .catch((err) => {
            helpers.setStatus({ success: false });
            helpers.setErrors({ submit: err.message });
            helpers.setSubmitting(false);
            return ToastComponent({ message: err.message, type: 'error' });
          })
      }
    }
  });

  return (
    <form noValidate
      onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader
          // subheader="Manage the notifications"
          title="Configuration des apps"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={6}
            wrap="wrap"
          >
            <Grid
              xs={12}
              sm={6}
              md={4}
              lg={12}
            >
              <Stack direction={'row'} spacing={2}>

                <FormControl fullWidth variant='filled'>
                  <InputLabel shrink htmlFor="select-native">
                    Sélectionner l'app
                  </InputLabel>
                  <Select
                    name="app"
                    error={!!(formik.touched.app && formik.errors.app)}
                    value={formik.values.app}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Native"
                  >
                    <MenuItem value="">
                      <em>Aucune sélection</em>
                    </MenuItem>
                    {apps.map((app, index) => (
                      <MenuItem key={index} value={app}>
                        {app}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.app && formik.errors.app && (
                    <Typography color="error"
                      variant="caption">
                      {formik.errors.app}
                    </Typography>
                  )}
                </FormControl>

                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                  <SvgIcon>
                    <ArrowUturnRightIcon />
                  </SvgIcon>
                </Box>

                <FormControl fullWidth variant='filled'>
                  <InputLabel shrink htmlFor="select-native">
                    Passer en
                  </InputLabel>
                  <Select
                    name="mode"
                    error={!!(formik.touched.mode && formik.errors.mode)}
                    value={formik.values.mode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Native"
                  >
                    <MenuItem value="">
                      <em>Aucune sélection</em>
                    </MenuItem>
                    {modes.map((mode, index) => (
                      <MenuItem key={index} value={mode}>
                        {mode}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.mode && formik.errors.mode && (
                    <Typography color="error"
                      variant="caption">
                      {formik.errors.mode}
                    </Typography>
                  )}
                </FormControl>

              </Stack>
            </Grid>
            {/* <Grid
              item
              md={4}
              sm={6}
              xs={12}
            >
              <Stack spacing={1}>
                <Typography variant="h6">
                  Messages
                </Typography>
                <Stack>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Email"
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Push Notifications"
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Phone calls"
                  />
                </Stack>
              </Stack>
            </Grid> */}
            {formik.errors.submit && (
              <Typography
                color="error"
                sx={{ mt: 3 }}
                variant="body2"
              >
                {formik.errors.submit}
              </Typography>
            )}
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type='submit'>
            Enregistrer
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

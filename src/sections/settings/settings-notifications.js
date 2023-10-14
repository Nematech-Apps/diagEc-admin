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
  FormControl,
  MenuItem
} from '@mui/material';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import ToastComponent from 'src/components/toast';

import { updateSettings } from 'src/firebase/firebaseServices';

export const SettingsNotifications = () => {
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

  const modes = ["Maintenance", "Production"];

  const formik = useFormik({
    initialValues: {
      mode: '',
      submit: null
    },
    validationSchema: Yup.object({
      mode: Yup
        .string()
        .required("Un mode doit être sélectionné")
    }),
    onSubmit: async (values, helpers) => {
      console.log(values.maintenanceMode);
      const data = {
        maintenanceMode: values.mode == "Maintenance" ? "1" : "0"
      }
      updateSettings(data)
        .then(() => {
          helpers.resetForm();
          return ToastComponent({ message: 'Opération effectué avec succès', type: 'success' });
        })
        .catch((err) => {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
          return ToastComponent({ message: err.message, type: 'error' });
        })


    }
  });

  return (
    <form noValidate
      onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader
          // subheader="Manage the notifications"
          title="Configuration de l'app mobile"
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
            >
              <Stack spacing={1}>
                {/* <Typography variant="h6">
                  Notifications
                </Typography> */}
                <Stack>

                  {/* <FormControlLabel
                    control={<Checkbox defaultChecked={formik.values.maintenanceMode} />}
                    label={formik.values.maintenanceMode == false ? "Mettre en mode production" : "Mettre en mode maintenance"}
                    name="maintenanceMode"
                    error={!!(formik.touched.maintenanceMode && formik.errors.maintenanceMode)}
                    helperText={formik.touched.maintenanceMode && formik.errors.maintenanceMode}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.maintenanceMode}
                  /> */}


                  <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 300 }} variant='filled'>
                    <InputLabel shrink htmlFor="select-native">
                      Changer le mode
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

                  {/* <FormControlLabel
                    control={<Checkbox />}
                    label="Text Messages"
                  />
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Phone calls"
                  /> */}
                </Stack>
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

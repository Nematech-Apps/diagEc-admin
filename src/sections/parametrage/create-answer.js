import { useCallback, useState } from 'react';
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

import ImagePicker from 'src/components/image-picker';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { addAnswer } from 'src/firebase/firebaseServices';
import { db, GetDoc, Doc, UpdateDoc } from 'src/firebase/firebaseConfig';
import ToastComponent from '../../components/toast';

export const CreateAnswer = () => {

  const formik = useFormik({
    initialValues: {
      libelle: '',
      point: 0,
      submit: null
    },
    validationSchema: Yup.object({
      libelle: Yup
        .string()
        .max(255)
        .required("Le libellé est requis"),
      point: Yup
        .number()
        .max(255)
        .required("Le point est requis"),
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
      addAnswer(values)
        .then(async (doc) => {
          const collectionRef = Doc(db, 'answers', doc.id);
          const snapshot = await GetDoc(collectionRef);

          const docData = {
            ...snapshot.data(),
            id: doc.id
          };

          UpdateDoc(collectionRef, docData)
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
          //subheader="catégorie"
          title="Réponse"
        />
        <Divider />
        <CardContent>
          <Stack
            spacing={3}
            sx={{ maxWidth: 400 }}
          >
            <TextField
              error={!!(formik.touched.libelle && formik.errors.libelle)}
              fullWidth
              helperText={formik.touched.libelle && formik.errors.libelle}
              label="Libellé"
              name="libelle"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.libelle}
            />

            <TextField
              error={!!(formik.touched.point && formik.errors.point)}
              fullWidth
              helperText={formik.touched.point && formik.errors.point}
              label="Point"
              name="point"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="number"
              value={formik.values.point}
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
type='submit'>
            Créer
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

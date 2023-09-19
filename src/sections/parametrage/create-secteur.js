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

import { addSecteur } from 'src/firebase/firebaseServices';
import { db, GetDoc, Doc, UpdateDoc } from 'src/firebase/firebaseConfig';
import ToastComponent from '../../components/toast';

export const CreateSecteur = () => {

  const formik = useFormik({
    initialValues: {
      libelleFr: '',
      libelleEn: '',
      libelleIt: '',
      submit: null
    },
    validationSchema: Yup.object({
      libelleFr: Yup
        .string()
        .max(255)
        .required("Le libellé en français est requis"),
      libelleEn: Yup
        .string()
        .max(255)
        .required("Le libellé en anglais est requis"),
      libelleIt: Yup
        .string()
        .max(255)
        .required("Le libellé en italien est requis"),
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
      addSecteur(values)
        .then(async (doc) => {
          const collectionRef = Doc(db, 'secteurs', doc.id);
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
          title="Ajouter Secteur d'activité"
        />
        <Divider />
        <CardContent>
          <Stack
            spacing={3}
            sx={{ maxWidth: 800 }}
          >
            <TextField
              error={!!(formik.touched.libelleFr && formik.errors.libelleFr)}
              fullWidth
              helperText={formik.touched.libelleFr && formik.errors.libelleFr}
              label="Libellé en français"
              name="libelleFr"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.libelleFr}
            />

            <TextField
              error={!!(formik.touched.libelleEn && formik.errors.libelleEn)}
              fullWidth
              helperText={formik.touched.libelleEn && formik.errors.libelleEn}
              label="Libellé en anglais"
              name="libelleEn"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.libelleEn}
            />

            <TextField
              error={!!(formik.touched.libelleIt && formik.errors.libelleIt)}
              fullWidth
              helperText={formik.touched.libelleIt && formik.errors.libelleIt}
              label="Libellé en italien"
              name="libelleIt"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.libelleIt}
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

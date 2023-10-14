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
  Typography,
  InputLabel,
  MenuItem,
  Select,
  FormControl
} from '@mui/material';

import ImagePicker from 'src/components/image-picker';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { addCategorie } from 'src/firebase/firebaseServices';
import { db, GetDoc, Doc, UpdateDoc } from 'src/firebase/firebaseConfig';
import ToastComponent from '../../components/toast';

import { getSecteurList } from 'src/firebase/firebaseServices';
import { getNiveauList } from 'src/firebase/firebaseServices';
import { OnSnapshot } from 'src/firebase/firebaseConfig';

export const CreateCategory = () => {

  const [secteurs, setSecteurs] = useState([]);
  const [niveaux, setNiveaux] = useState([]);

  const [isOnCreate, setIsOnCreate] = useState(false);

  useEffect(() => {
    const unsubscribe1 = OnSnapshot(
      getSecteurList(),
      (snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id
        }));
        setSecteurs(fetchedData);
      },
      (error) => {
        console.log('Error fetching data:', error);
      }
    );

    const unsubscribe2 = OnSnapshot(
      getNiveauList(),
      (snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id
        }));
        setNiveaux(fetchedData);
      },
      (error) => {
        console.log('Error fetching data:', error);
      }
    );

    return () => {
      // Clean up the listener when the component unmounts
      unsubscribe1();
      unsubscribe2();
    };
  }, []);


  const formik = useFormik({
    initialValues: {
      libelle: '',
      secteurAppartenance: '',
      niveauAppartenance: '',
      submit: null
    },
    validationSchema: Yup.object({
      libelle: Yup
        .string()
        .max(255)
        .required("Le libellé est requis"),
      secteurAppartenance: Yup
        .string()
        .required("Le secteur d'appartenance est requis"),
      niveauAppartenance: Yup
        .string()
        .required("Le niveau d'appartenance est requis"),
    }),
    onSubmit: async (values, helpers) => {
      setIsOnCreate(true);
      addCategorie(values)
        .then(async (doc) => {
          const collectionRef = Doc(db, 'categories', doc.id);
          const snapshot = await GetDoc(collectionRef);

          const docData = {
            ...snapshot.data(),
            id: doc.id
          };

          UpdateDoc(collectionRef, docData)
            .then(() => {
              helpers.resetForm();
              setIsOnCreate(false);
              return ToastComponent({ message: 'Opération effectué avec succès', type: 'success' });
            })
            .catch((err) => {
              setIsOnCreate(false);
              helpers.setStatus({ success: false });
              helpers.setErrors({ submit: err.message });
              helpers.setSubmitting(false);
              return ToastComponent({ message: err.message, type: 'error' });
            })

        })
        .catch((err) => {
          setIsOnCreate(false);
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
          title="Ajouter une catégorie"
        />
        <Divider />
        <CardContent>
          <Stack
            direction={'column'}
            spacing={3}
            sx={{ maxWidth: 800 }}
          >
            {/* <ImagePicker /> */}

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

            <FormControl variant="filled" >
              <InputLabel id="demo-simple-select-standard-label1">Secteur d'appartenance</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label1"
                id="demo-simple-select-standard1"
                name="secteurAppartenance"
                error={!!(formik.touched.secteurAppartenance && formik.errors.secteurAppartenance)}
                value={formik.values.secteurAppartenance}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                label="Secteur d'appartenance"
              >
                <MenuItem value="">
                  <em>Aucune sélection</em>
                </MenuItem>
                {secteurs.map((secteur, index) => {
                  return (<MenuItem value={JSON.stringify(secteur)}
                    key={index}>{secteur.libelleFr}</MenuItem>)
                })}

              </Select>
              {formik.touched.secteurAppartenance && formik.errors.secteurAppartenance && (
                <Typography color="error"
                  variant="caption">
                  {formik.errors.secteurAppartenance}
                </Typography>
              )}
            </FormControl>


            <FormControl variant="filled">
              <InputLabel id="demo-simple-select-standard-label2">Niveau d'appartenance</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label2"
                id="demo-simple-select-standard2"
                name="niveauAppartenance"
                error={!!(formik.touched.niveauAppartenance && formik.errors.niveauAppartenance)}
                value={formik.values.niveauAppartenance}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                label="Niveau d'appartenance"
              >
                <MenuItem value="">
                  <em>Aucune sélection</em>
                </MenuItem>
                {niveaux.map((niveau, index) => {
                  return (<MenuItem value={JSON.stringify(niveau)}
                    key={index}>{niveau.libelleFr}</MenuItem>)
                })}
              </Select>
              {formik.touched.niveauAppartenance && formik.errors.niveauAppartenance && (
                <Typography color="error"
                  variant="caption">
                  {formik.errors.niveauAppartenance}
                </Typography>
              )}
            </FormControl>
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

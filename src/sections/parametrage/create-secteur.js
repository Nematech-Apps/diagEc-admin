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

import ImagePicker from 'src/components/image-picker';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { addSecteur } from 'src/firebase/firebaseServices';
import { db, GetDoc, Doc, UpdateDoc } from 'src/firebase/firebaseConfig';
import ToastComponent from '../../components/toast';

import { getDeviceTokensList } from 'src/firebase/firebaseServices';
import { OnSnapshot } from 'src/firebase/firebaseConfig';

import NotificationService from 'src/notificationsService/notificationService';

const baseURL = 'https://fcm.googleapis.com/fcm/send';
const notificationService = new NotificationService(baseURL);

export const CreateSecteur = () => {

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isOnCreate, setIsOnCreate] = useState(false);

  useEffect(() => {
    const unsubscribe = OnSnapshot(
      getDeviceTokensList(),
      (snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id
        }));
        setData(fetchedData);
        setIsLoading(false);
      },
      (error) => {
        console.log('Error fetching data:', error);
        setIsLoading(false);
      }
    );

    return () => {
      // Clean up the listener when the component unmounts
      unsubscribe();
    };

  }, []);


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
      setIsOnCreate(true);
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
              //notify users
              const authToken = 'AAAAn_0BcwE:APA91bGwDIQfUGwNFze-sBenguSvoIti8XW8kuYvrhbcXDJ6X9ZWP8rVETtQoRGJAyJT_9wpHlg02Lrd1PsJEsnhEBkvrp5yy3GJ4wSPEJTT7LP1azAE3SD_3m6OwAjijwkksvUK2f-I'; 
              notificationService.setAuthorizationToken(authToken);
              if (isLoading == false) {
                data.forEach(async (elt) => {
                  // try {
                  //   await notificationService.post('', {
                  //     "data": {
                  //       "title": "Nouveau secteur ajouté",
                  //       "message": "Un nouveau vient d'être ajouté"
                  //     },
                  //     "to": elt.token
                  //   }
                  //   );
                  // } catch (error) {
                  //   console.error('Erreur lors de la récupération des données :', error);
                  // };
                  notificationService.post('', {
                      "data": {
                        "title": "Nouveau secteur ajouté",
                        "message": "Un nouveau secteur vient d'être ajouté"
                      },
                      "to": elt.token
                    }
                  ).then((data) => {
                    console.log('Données récupérées avec succès :', data);
                  }).catch((error) => {
                    console.error('Erreur lors de la récupération des données :', error);
                  });
                })

              }
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
          title="Ajouter un secteur d'activité"
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
            type='submit' disabled={isOnCreate}>
            Ajouter
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

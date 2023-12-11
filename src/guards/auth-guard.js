import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useAuthContext } from 'src/contexts/auth-context';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase/firebaseConfig';
import { updateUserTimePassedCollection } from 'src/firebase/firebaseServices';
import { useAuth } from 'src/hooks/use-auth';

import swal from 'sweetalert';


export const AuthGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const ignore = useRef(false);
  const [checked, setChecked] = useState(false);


  const showAlert = (action) => {
    // alert(`Votre session a expiré! Vous allez être déconnecté.`);
    swal(
      {
        text: "Votre session a expiré! Veuillez vous reconnecter.",
        buttons: {
          confirm: {
            text: "OK",
            value: true,
            visible: true,
            closeModal: true
          }
        },
      }
    );
  }

  const authHook = useAuth();

  function startTimerAndPerformAction(startTime, delay, action) {
    const elapsedTime = new Date().getTime() - startTime;

    if (elapsedTime >= delay) {
      // Execute the action if elapsed time exceeds or equals the delay
      action();
    } else {
      // Set up the timer if elapsed time hasn't reached the delay yet
      const remainingTime = delay - elapsedTime;
      const timerId = setTimeout(() => {
        action();
        // Add code to execute after the action here
      }, remainingTime);

      // Return the timer ID to allow cancellation later
      return timerId;
    }
  }

  const Delay = {
    twentySeconds: 20000,
    sixtySeconds: 60000,
    twoMinutes: 2 * 60000,
    oneHour: 60 * 60 * 1000,
    twoHours: 2 * 60 * 60 * 1000,
    threeHours: 3 * 60 * 60 * 1000,
    twentyFourHours: 24 * 60 * 60 * 1000
  }



  // function mesurerTempsSurAdmin() {
  //   // Vérifier si la date de connexion est enregistrée en local storage
  //   let dateConnexion = localStorage.getItem('userLastDateAuthentication');

  //   // Calculer la durée depuis la dernière connexion
  //   const dateConnexionPrecedente = new Date(dateConnexion);
  //   const maintenant = new Date();

  //   const differenceEnMillisecondes = maintenant - dateConnexionPrecedente;
  //   const differenceEnSecondes = Math.floor(differenceEnMillisecondes / 1000);

  //   // Convertir la différence en heures, minutes et secondes
  //   const heures = Math.floor(differenceEnSecondes / 3600);
  //   const minutes = Math.floor((differenceEnSecondes % 3600) / 60);
  //   const secondes = differenceEnSecondes % 60;

  //   const tempsPasse = `${heures}:${minutes}:${secondes}`;

  //   updateUserTimePassedCollection(tempsPasse, user?.uid)
  //   .then(() => {
  //     console.log('user time passed saved');
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // }



  useEffect(() => {
    const startTime = new Date().getTime();

    if (auth.currentUser != null) {
      const timerId = startTimerAndPerformAction(startTime, Delay.threeHours, () => {
        showAlert();
        setTimeout(() => {
          authHook.signOut();
        }, 4000);
      });


      // Clean up the timer when the component is unmounted
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [auth.currentUser]);


  // Only do authentication check on component mount.
  // This flow allows you to manually redirect the user after sign-out, otherwise this will be
  // triggered and will automatically redirect to sign-in page.

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      // Prevent from calling twice in development mode with React.StrictMode enabled
      if (ignore.current) {
        return;
      }

      ignore.current = true;

      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setChecked(true);
        } else {
          console.log('Not authenticated, redirecting');
          router
            .replace({
              pathname: '/auth/login',
              query: router.asPath !== '/' ? { continueUrl: router.asPath } : undefined
            })
            .catch(console.error);
        }
      });

    },
    [router.isReady, auth]
  );

  if (!checked) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};

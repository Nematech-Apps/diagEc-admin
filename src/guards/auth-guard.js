import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useAuthContext } from 'src/contexts/auth-context';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase/firebaseConfig';
import { useAuth } from 'src/hooks/use-auth';

export const AuthGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const ignore = useRef(false);
  const [checked, setChecked] = useState(false);

  const authHook = useAuth();

  function startTimerAndPerformAction(startTime, delay, action) {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;

    if (elapsedTime >= delay) {
      // Le temps écoulé dépasse ou est égal au délai, exécuter l'action
      action();
    } else {
      // Le temps écoulé n'a pas encore atteint le délai, configurer le timer
      const remainingTime = delay - elapsedTime;
      const timerId = setTimeout(() => {
        action();
        // Ajoute ici le code à exécuter après l'action
      }, remainingTime);

      // Retourne l'ID du timer pour permettre l'annulation ultérieure
      return timerId;
    }
  }

  const Delay = {
    20 : 20000,
    uneHeure : 60 * 60 * 1000
  }

  useEffect(() => {
    const startTime = new Date().getTime();

    if (auth.currentUser != null) {
      const timerId = startTimerAndPerformAction(startTime, Delay.uneHeure, () => {
        console.clear();
        authHook.signOut();
        console.log('Vous avez été déconnecté');
      });

      // Nettoyage du timer lorsque le composant est démonté
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

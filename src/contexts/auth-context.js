import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';

import { authenticate, register, addUserToCollection, logout, getUserByUid, getUserList, resetPassword } from "../firebase/firebaseServices";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase/firebaseConfig';

import ToastComponent from "../components/toast";

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_UP: 'SIGN_UP',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: user !== null,
      user
    };
  },
  [HANDLERS.SIGN_UP]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: false,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

export const AuthContext = createContext(undefined);

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user
      });
    });
  };

  useEffect(() => {
    initialize();
  }, []);

  // const skip = () => {
  //   try {
  //     window.sessionStorage.setItem('authenticated', 'true');
  //   } catch (err) {
  //     console.error(err);
  //   }

  //   const user = {
  //     id: '5e86809283e28b96d2d38537',
  //     avatar: '/assets/avatars/avatar-anika-visser.png',
  //     name: 'Anika Visser',
  //     email: 'anika.visser@devias.io'
  //   };

  //   dispatch({
  //     type: HANDLERS.SIGN_IN,
  //     payload: user
  //   });
  // };

  const signIn = async (email, password) => {
    try {
      const userCredential = await authenticate(email, password);
      if (userCredential.user !== null) {
        dispatch({
          type: HANDLERS.SIGN_IN,
          payload: userCredential.user
        });
      } else {
        dispatch({
          type: HANDLERS.SIGN_IN,
          payload: null
        });
      }
    } catch (error) {
      console.log(error.code);
      if (error.code === 'auth/user-not-found') {
        return ToastComponent({ message: 'Informations de connexion invalides!', type: 'error' });
      } else if (error.code === 'auth/wrong-password') {
        return ToastComponent({ message: 'Mot de passe invalide!', type: 'error' });
      }
      return ToastComponent({ message: error.message, type: 'error' });
    }
  };

  const signUp = async (credentials) => {
    try {
      register(credentials.email, credentials.pwd)
        .then((userCredential) => {
          const { uid } = userCredential.user;
          addUserToCollection(uid, credentials)
            .then(() => {
              dispatch({
                type: HANDLERS.SIGN_UP,
                payload: userCredential.user
              });
              return ToastComponent({ message: 'Compte crée avec succès', type: 'success' });
            })
            .catch((err) => {
              dispatch({
                type: HANDLERS.SIGN_UP,
                payload: null
              });
              return ToastComponent({ message: err.message, type: 'error' });
            })
        })
        .catch((error) => {
          dispatch({
            type: HANDLERS.SIGN_UP,
            payload: null
          });
          return ToastComponent({ message: error.message, type: 'error' });
        });
    } catch (error) {
      dispatch({
        type: HANDLERS.SIGN_UP,
        payload: null
      });
      return ToastComponent({ message: error.message, type: 'error' });
    }
  };

  const signOut = () => {
    logout();
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };

  const resetUserPassword = async (email) => {
    try {
      await resetPassword(email);
    } catch (error) {
      throw new Error("Failed to reset user password : " + error.message);
    }
    
  }


  const getUser = async (uid) => {
    try {
      const userSnapshot = await getUserByUid(uid);
      return userSnapshot.data();
    } catch (error) {
      throw new Error("Failed to get user: " + error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        resetUserPassword,
        getUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);

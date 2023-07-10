import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authenticate, register, addUserToCollection, logout, getUserByUid, getUserList } from "../firebase/firebaseServices";
import ToastComponent from "../components/toast";


// Create an async thunk for the login action
export const login = createAsyncThunk("auth/login", async (credentials) => {
    try {
        const userCredential = await authenticate(credentials.email, credentials.pwd);
        return userCredential.user.uid;
    } catch (error) {
        console.log(error.code);
        if (error.code == 'auth/user-not-found') {
            return ToastComponent({ message: 'Informations de connexion invalides!', type: 'error' });
        } else if (error.code == 'auth/wrong-password') {
            return ToastComponent({ message: 'Mot de passe invalide!', type: 'error' });
        }
        return ToastComponent({ message: error.message, type: 'error' });
        // return alert(error.message);
    }
});

export const registerUser = createAsyncThunk("auth/register", async (credentials) => {
    try {
        register(credentials.email, credentials.pwd)
            .then((userCredential) => {
                const { uid } = userCredential.user;
                addUserToCollection(uid, credentials)
                    .then(() => {
                        alert('Utilisateur crée avec succès')
                    })
                    .catch((err) => {
                        alert(err)
                    })
            })
            .catch((error) => {
                alert(error.message);
            });
    } catch (error) {
        throw new Error(error.message);
    }
});


export const deconnectUser = createAsyncThunk("auth/logout", () => {
    try {
        logout();
    } catch (error) {
        throw new Error(error.message);
    }
});


export const getUser = async (uid) => {
    try {
        const userSnapshot = await getUserByUid(uid);
        return userSnapshot.data();
    } catch (error) {
        throw new Error("Failed to get user: " + error.message);
    }
};

export const getUsers = () => {
    try {
        return getUserList();
    } catch (error) {
        throw new Error(error.message);
    }
}


const authSlice = createSlice({
    name: "auth",
    initialState: { isLoggIn: false, user: null },
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            if (action.payload != null) {
                state.isLoggIn = true;
            }

        });
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.isLoggIn = false;
        });
        builder.addCase(deconnectUser.fulfilled, (state, action) => {
            state.isLoggIn = false;
        });
    }
})

export const authActions = { login, registerUser, deconnectUser, getUser, getUsers };
export default authSlice;

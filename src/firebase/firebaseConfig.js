import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, getDoc, updateDoc, deleteDoc, deleteField, onSnapshot, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, fetchSignInMethodsForEmail } from "firebase/auth";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCsBDQBqK7ytJqCqPDkSFZFCPrYBdVHW0I",
    authDomain: "diag-ec.firebaseapp.com",
    projectId: "diag-ec",
    storageBucket: "diag-ec.appspot.com",
    messagingSenderId: "970822633957",
    appId: "1:970822633957:web:de1026c21c10900cac070c",
    measurementId: "G-C7Y2LYSP65"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const Ref = ref;
export const UploadBytes = uploadBytes;
export const UploadBytesResumable = uploadBytesResumable;
export const GetDownloadURL = getDownloadURL;
export const DeleteObject = deleteObject;
export const Collection = collection;
export const AddDoc = addDoc;
export const Doc = doc;
export const SetDoc = setDoc;
export const UpdateDoc = updateDoc;
export const DeleteDoc = deleteDoc;
export const DeleteField = deleteField;
export const GetDoc = getDoc;
export const GetDocs = getDocs;
export const OnSnapshot = onSnapshot;
export const Query = query;
export const Where = where;
export const auth = getAuth(app);
export const signin = signInWithEmailAndPassword;
export const signupUser = createUserWithEmailAndPassword;
export const signout = signOut;
export const SendPasswordResetEmail = sendPasswordResetEmail;
export const FetchSignInMethodsForEmail = fetchSignInMethodsForEmail

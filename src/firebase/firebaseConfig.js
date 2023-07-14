import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, getDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCHohSskp1F5Xyqq56qCrqYkWxkrjBYc5g",
    authDomain: "diagec-d4109.firebaseapp.com",
    projectId: "diagec-d4109",
    storageBucket: "diagec-d4109.appspot.com",
    messagingSenderId: "687144530689",
    appId: "1:687144530689:web:0088e9a3c2e5f4ba2c2100"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const Ref = ref;
export const UploadBytes = uploadBytes;
export const UploadBytesResumable = uploadBytesResumable;
export const GetDownloadURL = getDownloadURL;
export const Collection = collection;
export const AddDoc = addDoc;
export const Doc = doc;
export const SetDoc = setDoc;
export const UpdateDoc = updateDoc;
export const DeleteDoc = deleteDoc;
export const GetDoc = getDoc;
export const GetDocs = getDocs;
export const OnSnapshot = onSnapshot;
export const auth = getAuth(app);
export const signin = signInWithEmailAndPassword;
export const signupUser = createUserWithEmailAndPassword;
export const signout = signOut;

import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCsaBg16HXWLiESA1ez0FB-XIMeJGrk9Do",
  authDomain: "ticproject-6c49e.firebaseapp.com",
  projectId: "ticproject-6c49e",
  storageBucket: "ticproject-6c49e.appspot.com",
  messagingSenderId: "1097128019149",
  appId: "1:1097128019149:web:06a291516f6606ecf09584"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
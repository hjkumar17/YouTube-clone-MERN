import { initializeApp } from "firebase/app";
import { getStorage} from 'firebase/storage';
import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6aiuY9R2mPDWCDzUgyWJnJ2hiKR9B0ZE",
  authDomain: "clone-20bad.firebaseapp.com",
  projectId: "clone-20bad",
  storageBucket: "clone-20bad.appspot.com",
  messagingSenderId: "2657276713",
  appId: "1:2657276713:web:22879776ec5c20d78b5d38",
  measurementId: "G-FN7MCGV130"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)
export const db = getFirestore(app)
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCd08pgESD_lKgLj2-PM9lUot5LAMjGPgw",
  authDomain: "fir-course-7fb4c.firebaseapp.com",
  projectId: "fir-course-7fb4c",
  storageBucket: "fir-course-7fb4c.appspot.com",
  messagingSenderId: "735491752389",
  appId: "1:735491752389:web:4d84b1267a7216fa278bac",
  measurementId: "G-WCLJLV3RG6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);

// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA8vqGMfQARBWVeCgxPGMeqNeRplwzv-J4",
    authDomain: "trash-prediction.firebaseapp.com",
    projectId: "trash-prediction",
    storageBucket: "trash-prediction.appspot.com",
    messagingSenderId: "440317609173",
    appId: "1:440317609173:web:8ecaa117fd4f0e82a74e5c"
};

// Initialize Firebase

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];




export { firebaseConfig, app }
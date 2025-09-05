// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const API_KEY = import.meta.env.VITE_API_KEY

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: "uno-game-kjk.firebaseapp.com",
    projectId: "uno-game-kjk",
    storageBucket: "uno-game-kjk.firebasestorage.app",
    messagingSenderId: "764751373261",
    appId: "1:764751373261:web:64ceedc214a153a33b1a84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export { db }
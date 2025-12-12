// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBm519aaG14n0u17uq859l4GSrIKnB6BDE",
    authDomain: "finance-tracker-klab-e4b2b.firebaseapp.com",
    projectId: "finance-tracker-klab-e4b2b",
    storageBucket: "finance-tracker-klab-e4b2b.firebasestorage.app",
    messagingSenderId: "425706703676",
    appId: "1:425706703676:web:46b3d9f5f3588b7864ec39"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

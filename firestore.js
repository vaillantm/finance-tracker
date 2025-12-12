// firestore.js

// Import Firebase App (needed for initialization) and Firestore SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Re-paste your Firebase configuration here so Firestore can initialize
const firebaseConfig = {
    apiKey: "AIzaSyBm519aaG14n0u17uq859l4GSrIKnB6BDE",
    authDomain: "finance-tracker-klab-e4b2b.firebaseapp.com",
    projectId: "finance-tracker-klab-e4b2b",
    storageBucket: "finance-tracker-klab-e4b2b.firebasestorage.app",
    messagingSenderId: "425706703676",
    appId: "1:425706703676:web:46b3d9f5f3588b7864ec39"
};

// Initialize the app (again, if not done in auth.js) and Firestore service
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Checks if a user document exists and creates it if it doesn't.
 * @param {string} uid - Firebase Auth User ID.
 * @param {string} email - User email.
 * @param {string} displayName - User display name.
 */
export async function createUserIfNotExists(uid, email, displayName) {
    const userRef = doc(db, "users", uid);
    
    try {
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // Document does not exist, so create it
            await setDoc(userRef, {
                uid: uid,
                email: email,
                name: displayName,
                createdAt: new Date(),
                // Add any other default fields you need here
            }, { merge: true }); // Use merge: true just in case
            console.log("New user document created in Firestore for UID:", uid);
        } else {
            console.log("User document already exists in Firestore for UID:", uid);
        }
    } catch (error) {
        console.error("Error creating user document in Firestore:", error);
        // You might want to display a user-facing error here as well
    }
}
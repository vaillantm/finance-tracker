import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { 
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBm519aaG14n0u17uq859l4GSrIKnB6BDE",
    authDomain: "finance-tracker-klab-e4b2b.firebaseapp.com",
    projectId: "finance-tracker-klab-e4b2b",
    storageBucket: "finance-tracker-klab-e4b2b.firebasestorage.app",
    messagingSenderId: "425706703676",
    appId: "1:425706703676:web:46b3d9f5f3588b7864ec39"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();


// DOM references from your HTML
const authForm = document.getElementById("auth-form");
const googleBtn = document.getElementById("google-login");


// Rerender function from your HTML available globally
function rerenderError(msg) {
    const ev = new CustomEvent("renderWithError", { detail: msg });
    document.dispatchEvent(ev);
}


// Sign In + Create logic
authForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const isSignIn = document.getElementById("tab-signin").classList.contains("bg-white");

    if (isSignIn) {
        // ----------- SIGN IN -----------
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            await signInWithEmailAndPassword(auth, email, password);

            rerenderError(""); 
            alert("Login successful!");

            // Redirect (replace this)
            // window.location.href = "dashboard.html";
        } 
        catch (err) {
            if (err.code === "auth/invalid-credential") {
                rerenderError("Incorrect email or password.");
            } else {
                rerenderError(err.code);
            }
        }

    } else {
        // ----------- CREATE ACCOUNT -----------
        const email = document.getElementById("email-create").value.trim();
        const password = document.getElementById("password-create").value.trim();

        if (password.length < 6) {
            rerenderError("Password must be at least 6 characters.");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);

            rerenderError("");
            alert("Account created successfully!");

            // Optional redirect
            // window.location.href = "dashboard.html";
        }
        catch (err) {
            if (err.code === "auth/email-already-in-use") {
                rerenderError("This email is already registered.");
            } 
            else if (err.code === "auth/invalid-email") {
                rerenderError("Invalid email format.");
            }
            else {
                rerenderError(err.code);
            }
        }
    }
});


// GOOGLE LOGIN
googleBtn.addEventListener("click", async () => {
    try {
        await signInWithPopup(auth, googleProvider);
        alert("Google Login successful!");

        // Redirect
        // window.location.href = "dashboard.html";

    } catch (err) {
        alert("Google Login error: " + err.code);
    }
});



// ---- LISTENS TO INLINE ERROR REQUESTS (from your HTML renderer) ----
document.addEventListener("renderWithError", (e) => {
    const msg = e.detail;

    const isSignIn = document.getElementById("tab-signin").classList.contains("bg-white");

    if (isSignIn) {
        renderForm(msg);
    } else {
        renderForm(msg);
    }
});

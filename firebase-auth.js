// =================================================================
// 1. Firebase Imports and Configuration
// =================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBm519aaG14n0u17uq859l4GSrIKnB6BDE",
    authDomain: "finance-tracker-klab-e4b2b.firebaseapp.com",
    projectId: "finance-tracker-klab-e4b2b",
    storageBucket: "finance-tracker-klab-e4b2b.firebasestorage.app",
    messagingSenderId: "425706703676",
    appId: "1:425706703676:web:46b3d9f5f3588b7864ec39"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// =================================================================
// 2. Local State Variables & DOM References
// =================================================================
let currentForm = "signin";
const formContainer = document.getElementById("auth-form");
const msgBox = document.getElementById("msg-box");

// =================================================================
// 3. Helper Functions (UI & LocalStorage)
// =================================================================

const EMAIL_KEY = 'currentUserEmail'; // Key Dashboard expects
const USERS_DATA_KEY = 'users';

/**
 * Saves the user's email to localStorage and updates the user profile object.
 */
function saveUserToLocalStorage(user) {
    if (user) {
        // 1. Save the current user's email
        localStorage.setItem(EMAIL_KEY, user.email);

        // 2. Update the 'users' data structure for dashboard compatibility
        const usersData = JSON.parse(localStorage.getItem(USERS_DATA_KEY) || '{}');
        
        // Only update if the user profile doesn't exist or is incomplete (e.g., missing name)
        if (!usersData[user.email] || !usersData[user.email].name) {
             usersData[user.email] = {
                name: user.displayName || user.email.split('@')[0],
                transactions: usersData[user.email]?.transactions || [] // Preserve existing transactions if they exist
             };
        }
        localStorage.setItem(USERS_DATA_KEY, JSON.stringify(usersData));

        console.log(`User ${user.email} saved to localStorage.`);

    } else {
        // Clear local storage keys on sign out
        localStorage.removeItem(EMAIL_KEY);
        // Note: We intentionally DO NOT clear the 'users' key to preserve transaction history.
        console.log('User logged out, cleared current user email.');
    }
}

function showMsg(type, text) {
    msgBox.innerHTML = `
        <div class="p-3 rounded-lg text-sm ${
            type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-800"
        }">${text}</div>
    `;
}

function inputField(id, label, type, icon) {
    return `
        <div>
            <label class="text-sm font-medium text-gray-700">${label}</label>
            <div class="relative">
                <i class="material-icons absolute left-3 top-3 text-gray-400">${icon}</i>
                <input id="${id}" type="${type}"
                    class="w-full p-3 pl-10 bg-gray-100 rounded-lg" required>
            </div>
        </div>
    `;
}

function renderForm() {
    msgBox.innerHTML = "";
    let html = "";

    if (currentForm === "signin") {
        html += inputField("email", "Email", "email", "email");
        html += inputField("password", "Password", "password", "lock");
        html += `<button class="sign-in-button w-full p-3 mt-3 text-white rounded-lg">Sign In</button>`;
    } else {
        html += inputField("fullname", "Full Name", "text", "person");
        html += inputField("email-create", "Email", "email", "email");
        html += inputField("password-create", "Password", "password", "lock");
        html += `<button class="sign-in-button w-full p-3 mt-3 text-white rounded-lg">Create Account</button>`;
    }

    formContainer.innerHTML = html;
}


// =================================================================
// 4. Event Listeners (UI & Auth)
// =================================================================

/* Tab switching logic */
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.onclick = () => {
        currentForm = btn.dataset.form;
        document.querySelectorAll(".tab-btn").forEach(b => {
            const active = b.dataset.form === currentForm;
            b.classList.toggle("bg-white", active);
            b.classList.toggle("text-gray-800", active);
            b.classList.toggle("text-gray-500", !active);
        });
        renderForm();
    };
});

document.addEventListener("DOMContentLoaded", renderForm);


/* AUTH STATE LISTENER (Initial check & Logout clear) */
onAuthStateChanged(auth, (user) => {
    // Note: We don't save the user here. Saving is handled on successful *login* attempt
    // to ensure user data is updated, and the logic is focused on the dashboard listener.
    // If user is already logged in and lands on this page, redirect them.
    if (user) {
        // Redirect if already authenticated
        location.href = "dashboard.html"; 
    }
});


/* FORM SUBMIT (Email/Password Sign In & Create) */
document.getElementById("auth-form").addEventListener("submit", async (e)=>{
    e.preventDefault();

    if(currentForm === "signin"){
        // SIGN IN
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try{
            const userCred = await signInWithEmailAndPassword(auth,email,password);
            
            saveUserToLocalStorage(userCred.user); // <-- SAVES TO LOCALSTORAGE
            showMsg("success","Sign in successful! Redirecting...");
            setTimeout(()=>location.href="dashboard.html",800);
        }catch(err){
            showMsg("error","Incorrect email or password.");
        }
    } else {
        // CREATE ACCOUNT
        const full = document.getElementById("fullname").value.trim();
        const email = document.getElementById("email-create").value.trim();
        const password = document.getElementById("password-create").value;

        if(password.length < 6){ 
            showMsg("error","Password must be at least 6 characters.");
            return;
        }

        try{
            const userCred = await createUserWithEmailAndPassword(auth,email,password);
            await updateProfile(userCred.user,{ displayName: full });

            saveUserToLocalStorage(userCred.user); // <-- SAVES TO LOCALSTORAGE
            
            showMsg("success","Account created and signed in! Redirecting...");
            setTimeout(()=>location.href="dashboard.html",800);

        }catch(err){
            let message = "Account could not be created.";
            if (err.code === "auth/email-already-in-use") {
                 message = "This email is already registered.";
            } else if (err.code === "auth/invalid-email") {
                 message = "Invalid email format.";
            }
            showMsg("error",message);
        }
    }
});

/* GOOGLE LOGIN */
document.getElementById("google-login").onclick = async () => {
    try {
        const result = await signInWithPopup(auth,googleProvider);
        const user = result.user;

        saveUserToLocalStorage(user); // <-- SAVES TO LOCALSTORAGE

        showMsg("success","Google sign-in successful! Redirecting...");
        setTimeout(()=>location.href="dashboard.html",800);
    } catch (err) {
        showMsg("error","Google login failed.");
    }
};
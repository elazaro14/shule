import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// We attach the function to the window object so the HTML button can find it
window.login = async () => {
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value;
    const btn = document.querySelector('button');
    const statusMsg = document.getElementById('statusMsg');

    if (!email || !pass) {
        alert("Please enter both email and password.");
        return;
    }

    // Visual feedback for the user
    btn.disabled = true;
    btn.innerText = "Authenticating...";

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // 1. Record the "Last Login" timestamp in Firestore
        const now = new Date().toLocaleString('en-GB');
        try {
            await updateDoc(doc(db, "users", user.uid), {
                lastLogin: now
            });
        } catch (dbError) {
            console.warn("User logged in, but lastLogin failed to update. Ensure the user document exists in Firestore.");
        }

        // 2. Redirect to Dashboard
        window.location.href = "dashboard.html"; 

    } catch (error) {
        btn.disabled = false;
        btn.innerText = "Login";
        
        // Detailed error handling for common Firebase issues
        if (error.code === 'auth/user-not-found') {
            alert("No account found with this email.");
        } else if (error.code === 'auth/wrong-password') {
            alert("Incorrect password. Please try again.");
        } else {
            alert("Login Failed: " + error.message);
        }
    }
};

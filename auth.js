import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.login = async () => {
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value;
    const btn = document.querySelector('button');

    if (!email || !pass) {
        alert("Please enter both email and password.");
        return;
    }

    btn.disabled = true;
    btn.innerText = "Checking...";

    try {
        // 1. Sign in with Email/Password
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // 2. Fetch User Role from Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            
            // 3. Update Last Login Time
            await updateDoc(userRef, {
                lastLogin: new Date().toLocaleString('en-GB')
            });

            // Redirect based on existence of account
            window.location.href = "dashboard.html";
        } else {
            // Error: User exists in Auth but not in 'users' collection
            btn.disabled = false;
            btn.innerText = "Login";
            alert("Login Success, but NO ROLE found! \n\nGo to Firestore and create a document in 'users' collection with this ID: " + user.uid);
        }

    } catch (error) {
        btn.disabled = false;
        btn.innerText = "Login";
        console.error("Login Error Code:", error.code);

        if (error.code === 'auth/invalid-credential') {
            alert("Incorrect Email or Password.");
        } else if (error.code === 'auth/network-request-failed') {
            alert("Network error. Check your API key or Internet.");
        } else {
            alert("Error: " + error.message);
        }
    }
};

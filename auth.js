import { auth } from "./firebase.js"; //
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"; //

window.login = async () => {
    const email = document.getElementById("email").value; //
    const password = document.getElementById("password").value; //
    try {
        await signInWithEmailAndPassword(auth, email, password); //
        window.location.href = "dashboard.html"; //
    } catch (error) {
        alert("Error: " + error.message); //
    }
};

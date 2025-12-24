import { db } from "./firebase.js";
import {
  collection, addDoc, getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const studentsRef = collection(db, "students");

export async function addStudent(name, cls) {
  await addDoc(studentsRef, { name, cls });
}

export async function getStudents() {
  const snap = await getDocs(studentsRef);
  return snap.docs.map(d => d.data());
}

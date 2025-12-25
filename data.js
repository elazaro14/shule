import { db } from "./firebase.js";
import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    updateDoc, 
    query, 
    where, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Collection Reference
const studentCol = collection(db, "students");

/**
 * Add a new student to the database
 */
export async function addStudent(name, sex, cls) {
    try {
        const docRef = await addDoc(studentCol, {
            name: name,
            sex: sex,
            cls: cls,
            createdAt: new Date()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding student: ", error);
        throw error;
    }
}

/**
 * Fetch students with optional filtering
 * @param {string} classFilter - 'All', 'Form 1', etc.
 */
export async function getStudents(classFilter = "All") {
    try {
        let q = query(studentCol, orderBy("name", "asc"));
        
        if (classFilter !== "All") {
            q = query(studentCol, where("cls", "==", classFilter), orderBy("name", "asc"));
        }
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching students: ", error);
        throw error;
    }
}

/**
 * Delete a student by ID
 */
export async function deleteStudent(id) {
    try {
        await deleteDoc(doc(db, "students", id));
    } catch (error) {
        console.error("Error deleting student: ", error);
        throw error;
    }
}

/**
 * Update student information
 */
export async function updateStudent(id, updatedData) {
    try {
        const studentRef = doc(db, "students", id);
        await updateDoc(studentRef, updatedData);
    } catch (error) {
        console.error("Error updating student: ", error);
        throw error;
    }
}

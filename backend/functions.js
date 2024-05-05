import { app } from './firebase';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';

const database = getFirestore(app);

async function addTrashData(data) {
    try {
        const docRef = await addDoc(collection(database, "trash"), data);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

async function getAllTrashData(setTrashData) {
    const trashCollection = collection(database, "trash");
    const unsubscribe = onSnapshot(trashCollection, (snapshot) => {
        const trashList = snapshot.docs.map(doc => doc.data());
        setTrashData(trashList);
    });
    return unsubscribe;
}

export { addTrashData, getAllTrashData };

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

async function addCapture() {

    const caputreCollection = collection(database, "capture");
    const docRef = await addDoc(caputreCollection, {
        timestamp: Date.now(),
    });
}

async function getLatestTrashData() {
    const trashCollection = collection(database, "trash");
    const q = query(trashCollection, where("timestamp", ">", 0));
    const querySnapshot = await getDocs(q);
    let trashList = querySnapshot.docs.map(doc => doc.data());
    trashList.sort((a, b) => b.timestamp - a.timestamp);

    if(!trashList || trashList.length === 0) {
        return null;
    }
    else {
        let result = {
            ...trashList[0],
        }
        
        // remove image_link
        delete result.image_link;
        return result;
    }
}

export { addTrashData, getAllTrashData, addCapture, getLatestTrashData };

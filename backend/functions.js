import { app } from './firebase';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, query, where, onSnapshot, doc } from 'firebase/firestore';

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

    try {
        // Reference to the "capture" collection
        let collectionRef = collection(database, "capture");

        // Get all documents from the "capture" collection
        let captureSnapshot = await getDocs(collectionRef);

        // Map documents to an array of data
        let captures = captureSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Get the latest capture based on timestamp
        let latestCapture = captures.sort((a, b) => b.timestamp - a.timestamp)[0];

        if (!latestCapture) {
            console.log("No captures found.");
            return;
        }

        // Update the latest capture document's timestamp
        let captureRef = doc(database, "capture", latestCapture.id);
        await updateDoc(captureRef, { timestamp: Date.now() });

        console.log("Document updated with ID: ", latestCapture.id);
    } catch (error) {
        console.error("Error updating document: ", error);
    }
}

async function getPrediction() {

    // Reference to the "capture" collection
    let collectionRef = collection(database, "prediction");

    // Get all documents from the "capture" collection
    let predictionSnapshot = await getDocs(collectionRef);

    // Map documents to an array of data
    let predictions = predictionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get the latest capture based on timestamp
    let latest = predictions[0];

    console.log("Latest prediction: ", latest);

    return latest?.class || null;
}

async function updatePrediction(className) {
    try {
        // Reference to the "capture" collection
        let collectionRef = collection(database, "prediction");

        // Get all documents from the "capture" collection
        let predictionSnapshot = await getDocs(collectionRef);

        // Map documents to an array of data
        let predictions = predictionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Get the latest capture based on timestamp
        let latest = predictions[0];

        // Update the latest capture document's timestamp
        let latestRef = doc(database, "prediction", latest.id);
        await updateDoc(latestRef, { class: className });

        console.log("Document updated with ID: ", latest.id);
    } catch (error) {
        console.error("Error updating prediction document: ", error);
    }
}


export { addTrashData, getAllTrashData, addCapture, getPrediction, updatePrediction };

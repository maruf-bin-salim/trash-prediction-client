import { app } from '@/backend/firebase';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';
const database = getFirestore(app);


import { useEffect, useState } from "react"

export default function Realtime() {

    const [trashData, setTrashData] = useState(null)

    useEffect(() => {
        const trashCollection = collection(database, "trash");
        const unsubscribe = onSnapshot(trashCollection, (snapshot) => {
            const trashList = snapshot.docs.map(doc => doc.data());
            // get single trash that has the highest timestamp
            trashList.sort((a, b) => b.timestamp - a.timestamp);
            let trashItem = trashList.length > 0 ? trashList[0] : null;
            setTrashData(trashItem);
        });

        return () => {
            unsubscribe()
        }
    }
        , [])


    return (
        <div>
            <h1>Realtime : Latest Predicted Trash Item</h1>
            {
                trashData &&
                <div >
                    <img src={trashData.image_link} alt="Trash" width={500} />
                    <p>Class: {trashData.prediction.name}</p>
                    <p>Probability: {trashData.prediction.probability}</p>
                </div>
            }


        </div>
    )
}
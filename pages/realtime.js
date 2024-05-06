import { app } from '@/backend/firebase';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';
const database = getFirestore(app);


import { useEffect, useState } from "react"

export default function Realtime() {

    const [trashData, setTrashData] = useState([])

    useEffect(() => {
        const trashCollection = collection(database, "trash");
        const unsubscribe = onSnapshot(trashCollection, (snapshot) => {
            const trashList = snapshot.docs.map(doc => doc.data());
            setTrashData(trashList);
        });

        return () => {
            unsubscribe()
        }
    }
        , [])


    return (
        <div>
            <h1>Realtime</h1>
            {
                trashData?.map((data, index) => {
                    return (
                        <div key={index}>
                            <img src={data.image_link} alt="Trash" width={500} />
                            <p>Class: {data.prediction.name}</p>
                            <p>Probability: {data.prediction.probability}</p>
                        </div>
                    )
                }
                )
            }
        </div>
    )
}
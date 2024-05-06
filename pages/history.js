import { app } from '@/backend/firebase';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';
const database = getFirestore(app);


import { useEffect, useState } from "react"

export default function History() {

    const [trashData, setTrashData] = useState([])
    const [classes, setClasses] = useState(["cardboard", "glass", "metal", "paper", "plastic", "trash"]);
    const [countOfClasses, setCountOfClasses] = useState({});

    async function handleRemoveAllPressed() {
        const trashCollection = collection(database, "trash");
        const snapshot = await getDocs(trashCollection);
        snapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });
    }



    useEffect(() => {
        const trashCollection = collection(database, "trash");
        const unsubscribe = onSnapshot(trashCollection, (snapshot) => {
            const trashList = snapshot.docs.map(doc => doc.data());
            // set count of classes
            let count = {};
            classes.forEach((c) => {
                count[c] = 0;
            });
            trashList.forEach((trash) => {
                count[trash.prediction.name] += 1;
            });
            setCountOfClasses(count);
            setTrashData(trashList);
        });

        return () => {
            unsubscribe()
        }
    }
        , [])


    return (
        <div>
            <h1>History</h1>
            <button onClick={handleRemoveAllPressed}>
                Remove All
            </button>

            <h2>
                Total Trash Predicted: {trashData.length}
            </h2>
            <h2>Count of Classes</h2>
            {
                classes.map((data, index) => {
                    return (
                        <div key={index}>
                            <p>{data}: {countOfClasses[data]}</p>
                        </div>
                    )

                })
            }
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
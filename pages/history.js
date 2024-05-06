import { app } from '@/backend/firebase';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from "react";

const database = getFirestore(app);

export default function History() {
    const [trashData, setTrashData] = useState([]);
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
            unsubscribe();
        };
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">History</h1>
            <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleRemoveAllPressed}
            >
                Remove All
            </button>

            <h2 className="text-xl mt-4">Total Trash Predicted: {trashData.length}</h2>
            <h2 className="text-xl mt-4">Count of Classes</h2>
            <div className="grid grid-cols-2 gap-4">
                {classes.map((data, index) => (
                    <div key={index} className="bg-gray-200 p-4 rounded">
                        <p className="text-lg">{data}: {countOfClasses[data]}</p>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {trashData.map((data, index) => (
                    <div key={index} className="bg-gray-200 p-4 rounded">
                        <img src={data.image_link} alt="Trash" className="mb-2" style={{ maxWidth: "100%" }} />
                        <p><strong>Class:</strong> {data.prediction.name}</p>
                        <p><strong>Probability:</strong> {(data.prediction.probability * 100).toFixed(2)}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

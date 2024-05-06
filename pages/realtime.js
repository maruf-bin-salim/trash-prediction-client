import { app } from '@/backend/firebase';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from "react";

export default function Realtime() {
    const [trashData, setTrashData] = useState(null);

    useEffect(() => {
        const database = getFirestore(app);
        const trashCollection = collection(database, "trash");
        const unsubscribe = onSnapshot(trashCollection, (snapshot) => {
            const trashList = snapshot.docs.map(doc => doc.data());
            // Get the single trash item with the highest timestamp
            trashList.sort((a, b) => b.timestamp - a.timestamp);
            let trashItem = trashList.length > 0 ? trashList[0] : null;
            setTrashData(trashItem);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-4">Realtime: Latest Predicted Trash Item</h1>
            {trashData && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <img src={trashData.image_link} alt="Trash" className="mb-4 rounded-lg" style={{ maxWidth: "100%" }} />
                    <div className="mb-4">
                        <p className="text-lg font-semibold">Class: {trashData.prediction.name}</p>
                        <p className="text-lg font-semibold">Probability: {(trashData.prediction.probability * 100).toFixed(2)}%</p>
                    </div>
                    <p className="text-sm text-gray-600">Predicted on: {formatTimestamp(trashData.timestamp)}</p>
                </div>
            )}
        </div>
    );
}

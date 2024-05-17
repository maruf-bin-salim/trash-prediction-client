import { app } from '@/backend/firebase';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from "react";

const database = getFirestore(app);

export default function History() {
    const [trashData, setTrashData] = useState([]);
    const [classes, setClasses] = useState(["cardboard", "glass", "metal", "paper", "plastic", "trash"]);
    const [countOfClasses, setCountOfClasses] = useState({});
    const [severOn, setServerOn] = useState(false);
    const [serverLoading, setServerLoading] = useState(false);

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
        <div className="container p-4 mx-auto">
            <h1 className="mb-4 text-3xl font-bold">History</h1>
            <div className="flex gap-2">
                <button
                    className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-600"
                    onClick={handleRemoveAllPressed}
                >
                    Remove All
                </button>
                {
                    serverLoading &&
                    <div className="px-4 py-2 font-bold text-white bg-blue-500 rounded">
                        Turning On Server...
                    </div>
                }
                {
                    !serverLoading &&
                    <button className={`text-white font-bold py-2 px-4 rounded ${severOn ? "bg-green-500" : "bg-red-500"}`}
                        onClick={async () => {
                            try {
                                setServerLoading(true);
                                const response = await fetch('https://trash-prediction-server.onrender.com/', {
                                    method: 'GET', // or 'POST', 'PUT', etc.
                                    // You can include headers or body if required
                                });

                                if (response.ok) {
                                    // Request was successful
                                    let data = await response.json();
                                    setServerOn(true);
                                    setServerLoading(false);

                                    console.log('Request sent successfully.', data);
                                } else {
                                    // Request failed
                                    console.error('Request failed.');
                                    setServerOn(false);
                                    setServerLoading(false);
                                }
                            } catch (error) {
                                console.error('Error:', error);
                            }
                        }}
                    >
                        Turn On Server
                    </button>
                }


            </div>

            <h2 className="mt-4 text-xl">Total Trash Predicted: {trashData.length}</h2>
            <h2 className="mt-4 text-xl">Count of Classes</h2>
            <div className="grid grid-cols-2 gap-4">
                {classes.map((data, index) => (
                    <div key={index} className="p-4 bg-gray-200 rounded">
                        <p className="text-lg">{data}: {countOfClasses[data]}</p>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                {trashData.map((data, index) => (
                    <div key={index} className="p-4 bg-gray-200 rounded">
                        <img src={data.image_link} alt="Trash" className="mb-2" style={{ maxWidth: "100%" }} />
                        <p><strong>Class:</strong> {data.prediction.name}</p>
                        <p><strong>Probability:</strong> {(data.prediction.probability * 100).toFixed(2)}%</p>
                        <button className="px-4 py-2 mt-2 font-bold text-white bg-red-500 rounded hover:bg-red-600"
                            onClick={async () => {
                                const trashCollection = collection(database, "trash");
                                const q = query(trashCollection, where("timestamp", "==", data.timestamp));
                                const querySnapshot = await getDocs(q);
                                querySnapshot.forEach(async (doc) => {
                                    await deleteDoc(doc.ref);
                                });
                            }
                            }
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

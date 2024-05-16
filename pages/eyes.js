import useWindowSize from '@/hooks/useSize';
import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { app } from '@/backend/firebase';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
let classes = ["cardboard", "glass", "metal", "paper", "plastic", "trash"]

const CaptureComponent = () => {


  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [predictedClass, setPredictedClass] = useState(null);
  const [predictedProbability, setPredictedProbability] = useState(null);

  const [overallProbabilities, setOverallProbabilities] = useState([]);

  const [showDetails, setShowDetails] = useState(false);

  const webcamRef = useRef(null);

  async function captureImage() {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };



  useEffect(() => {
    if (capturedImage) getPrediction();
  }, [capturedImage]);


  const [captureLength, setCaptureLength] = useState(0);

  useEffect(() => {
    const database = getFirestore(app);
    const captureCollection = collection(database, "capture");
    const unsubscribe = onSnapshot(captureCollection, (snapshot) => {
      const captureList = snapshot.docs.map(doc => doc.data());
      // Get the single trash item with the highest timestamp
      if (captureList && captureList.length) {
        setCaptureLength(captureList.length);
      }

    });

    return () => {
      unsubscribe();
    };
  }, []);


  useEffect(() => {

    // simulate button Click 
    if (captureLength > 0) {
      captureImage();
    }

  }, [captureLength]);


  async function getPrediction() {

    setIsLoading(true);
    // Send data to API endpoint as a POST request
    try {

      const response = await fetch('https://trash-prediction-server.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_link: capturedImage }),
      });
      const data = await response.json();
      setPredictedClass(data.prediction.name);
      setPredictedProbability(data.prediction.probability);
      setOverallProbabilities(data.overall_probabilities);

    } catch (error) {
      console.error('Error sending the snapshot:', error);
    }

    setIsLoading(false);
  }

  const discardImage = () => {
    setCapturedImage(null);

    setPredictedClass(null);
    setPredictedProbability(null);
    setOverallProbabilities([]);
    setShowDetails(false);

  };

  let windowSize = useWindowSize();



  return (
    <div className="flex flex-col items-center justify-center h-screen">

      <div className="relative w-full h-full bg-[#1b1b1b] flex justifty-center items-center">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className='fixed bottom-0 right-0 min-w-full min-h-full'
          videoConstraints={{

            width: windowSize.width,
            height: windowSize.height,
            facingMode: 'environment',
          }}



        />
        <button
          className="absolute flex items-center justify-center w-16 h-16 text-white transform -translate-x-1/2 bg-gray-800 rounded-full bottom-8 left-1/2"
          onClick={captureImage}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>

        {predictedClass && (
          <div className="fixed top-0 left-0 w-full p-4 text-white bg-gray-800" onClick={() => setPredictedClass(null)}>
            <p>
              Prediction : <span className="font-bold">{predictedClass}</span> with a probability of <span className="font-bold">{(predictedProbability * 100)?.toPrecision(4)} % </span>
            </p>
          </div>
        )
        }

        {isLoading && (
          <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-75">
            <img src="/loading.svg" alt="loading" className="w-16 h-16" />
          </div>
        )}

      </div>

    </div>
  );
};

export default CaptureComponent;

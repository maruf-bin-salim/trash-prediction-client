import useWindowSize from '@/hooks/useSize';
import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';

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
    <div className="h-screen flex flex-col justify-center items-center">

      {!capturedImage ? (
        <div className="relative w-full h-full bg-red-100 flex justifty-center items-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className='fixed right-0 bottom-0 min-w-full min-h-full'
            videoConstraints={{

              width: windowSize.width,
              height: windowSize.height,
              facingMode: 'environment',
            }}



          />
          <button
            className="absolute bottom-8 w-16 h-16 bg-gray-800 text-white rounded-full flex items-center justify-center left-1/2 transform -translate-x-1/2"
            onClick={captureImage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
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
        </div>
      ) : (
        <div className="relative">
          <img src={capturedImage} alt="Captured" className='fixed right-0 bottom-0 min-w-full min-h-full' onClick={() => setShowDetails(false)} />
          <button
            className="fixed top-0 right-0 mt-4 mr-4 px-4 py-4 bg-gray-800 text-white rounded-full"
            onClick={discardImage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {
            !showDetails && predictedClass && (
              <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4" onClick={() => setShowDetails(true)}>
                <p>
                  Prediction : <span className="font-bold">{predictedClass}</span> with a probability of <span className="font-bold">{(predictedProbability * 100)?.toPrecision(4)} % </span>
                </p>
              </div>
            )
          }

          {
            showDetails && (
              <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4" onClick={() => setShowDetails(false)}>
                <h2 className="text-2xl font-bold">{predictedClass}</h2>
                <p className="text-lg">Probability: {(predictedProbability * 100)?.toPrecision(4)} % </p>


                <div className="border-b-2 border-white my-2"></div>
                {/* seperator */}

                <h3 className="text-xl font-bold">Overall Probabilities</h3>
                <ul>
                  {overallProbabilities.map((item, index) => (
                    <li key={index}>
                      <p>
                        <span className="font-bold">
                          {item.class} :
                        </span>
                        {/* space */}
                        &nbsp;

                        {` ${(item.probability * 100)?.toPrecision(3)}%`}

                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )
          }

          {isLoading && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center">
              <img src="/loading.svg" alt="loading" className="w-16 h-16" />
            </div>
          )}

        </div>

      )}
    </div>
  );
};

export default CaptureComponent;

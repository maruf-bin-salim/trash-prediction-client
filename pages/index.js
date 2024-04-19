import useWindowSize from '@/hooks/useSize';
import { useState, useRef } from 'react';
import Webcam from 'react-webcam';

const CaptureComponent = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const webcamRef = useRef(null);

  async function captureImage() {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);

    await getPrediction();
  };

  async function getPrediction() {

    setIsLoading(true);
    // Send data to API endpoint as a POST request
    try {

      const response = await fetch('https://trash-detection-server.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_link: capturedImage }),
      });
      const data = await response.json();

      // expected response
      // data = {"prediction":{"name":"cardboard","probability":0.7180725932121277},"overall_probabilities":[{"class":"cardboard","probability":0.7180725932121277},{"class":"metal","probability":0.2032327651977539},{"class":"trash","probability":0.04265006259083748},{"class":"plastic","probability":0.020296193659305573},{"class":"glass","probability":0.012044194154441357},{"class":"paper","probability":0.0037041513714939356}]}

      console.log('Prediction:', data.prediction);
      console.log('Overall probabilities:', data.overall_probabilities);

    } catch (error) {
      console.error('Error sending the snapshot:', error);
    }

    setIsLoading(false);
  }

  const discardImage = () => {
    setCapturedImage(null);
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
          <img src={capturedImage} alt="Captured" className='fixed right-0 bottom-0 min-w-full min-h-full' />
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

          {isLoading && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex justify-center items-center">
              <div className="text-white font-bold text-2xl">Loading...</div>
            </div>
          )}

        </div>

      )}
    </div>
  );
};

export default CaptureComponent;

import useWindowSize from '@/hooks/useSize';
import { useState, useRef } from 'react';
import Webcam from 'react-webcam';

const CaptureComponent = () => {
  const [capturedImage, setCapturedImage] = useState(null);

  const webcamRef = useRef(null);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

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
          <img src={capturedImage} alt="Captured" className="w-screen h-screen" />
          <button
            className="absolute top-0 right-0 mt-4 mr-4 px-4 py-2 bg-gray-800 text-white rounded"
            onClick={discardImage}
          >
            Discard
          </button>
        </div>

      )}
    </div>
  );
};

export default CaptureComponent;

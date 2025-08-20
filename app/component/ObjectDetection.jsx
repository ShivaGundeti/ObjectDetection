"use client"
import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam';
import {load as cocoSSDLoad} from "@tensorflow-models/coco-ssd"
import * as tf from "@tensorflow/tfjs"
import { renderPredictions } from '@/utils/Renderpredictions';
const ObjectDetection = () => {
    const [Loading, setLoading] = useState(false)
    let detectInterval;
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
//   console.log(canvasRef);
  
    const runcoco = async ()=>{
        setLoading(true)
        const net = await cocoSSDLoad();
        setLoading(false);
        detectInterval = setInterval(()=>{
            runObjectDetection(net)
        },10)
    }

     const showmyVideo = () => {
    if (
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      const myVideoWidth = webcamRef.current.video.videoWidth;
      const myVideoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = myVideoWidth;
      webcamRef.current.video.height = myVideoHeight;
    }
  };
    
      async function runObjectDetection(net) {
    if (
      canvasRef.current &&
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;

      // find detected objects
      const detectedObjects = await net.detect(
        webcamRef.current.video,
        undefined,
        0.6
      );

        console.log(detectedObjects);

      const context = canvasRef.current.getContext("2d");
      renderPredictions(detectedObjects, context);
    }
  }
    useEffect(()=>{
        runcoco();
        showmyVideo()

    })
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 w-full">
      
      {/* Left Section */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left md:w-1/2 space-y-5">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Show an Object & Let <span className="text-green-600">AI Detect</span> It
        </h2>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Place an object in front of the camera and instantly know details about it.  
          Your AI-powered assistant is just a click away!
        </p>
        <button className="bg-green-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:bg-green-600 transition-all">
          Know About Object
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center md:w-1/2 w-full h-64 sm:h-80 md:h-[400px] bg-gradient-to-br from-gray-50 to-white border-2 border-green-400 rounded-xl shadow-md overflow-hidden">
       { Loading ? "Ai is loading....":(
        <>
        <Webcam
          ref={webcamRef}
          className="w-full h-full object-cover rounded-md"
          muted
          mirrored
          />
     <canvas
  ref={canvasRef}
  className="absolute top-0 left-0 w-full h-full"
/>

            </>
    )
        
        }
      </div>
    </div>
  )
}

export default ObjectDetection

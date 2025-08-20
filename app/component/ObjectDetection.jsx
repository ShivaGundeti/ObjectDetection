"use client";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { renderPredictions } from "@/utils/renderPredictions";

const ObjectDetection = () => {
  const [loading, setLoading] = useState(true);
  const [object, setObject] = useState("");
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  const runCoco = async () => {
    const net = await cocoSSDLoad();
    setLoading(false);

    intervalRef.current = setInterval(() => {
      detectObjects(net);
    }, 100);
  };

  const detectObjects = async (net) => {
    if (
      canvasRef.current &&
      webcamRef.current?.video?.readyState === 4
    ) {
      const video = webcamRef.current.video;

      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;

      // const detectedObjects = await net.detect(video,1,0.6);
        const detectedObjects = await net.detect(
        webcamRef.current.video,
        1,
        0.6
      );
      // console.log(detectObjects);
      detectedObjects.forEach(prediction => {
  const objectName = prediction.class; // 👈 name of the object
  // const confidence = prediction.score; // 👈 probability

  // console.log(`Detected: ${objectName} (${(confidence * 100).toFixed(2)}%)`);
  setObject(objectName)
});
      
      
      
      const ctx = canvasRef.current.getContext("2d");
      renderPredictions(detectedObjects, ctx);
    }
  };

  useEffect(() => {
    runCoco();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-10 w-full">
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
           {object ? `Know about ${object}` : "Know about Object"}
        </button>
        <div className="p-2 mt-2">
    <p>Hey there dummy text</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative flex items-center justify-center md:w-1/2 w-full h-64 sm:h-80 md:h-[400px] bg-gradient-to-br from-gray-50 to-white border-2 border-green-400 rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full text-gray-600 font-medium">
            🚀 AI is loading...
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ObjectDetection;

"use client";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { renderPredictions } from "@/utils/Renderpredictions";

const ObjectDetection = () => {
  const [loading, setLoading] = useState(true);
  const [objectName, setObjectName] = useState("");

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const modelRef = useRef(null);
  const rafRef = useRef(null);
  const runningRef = useRef(false);

  const detectLoop = async () => {
    if (!runningRef.current) return;

    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;
    const net = modelRef.current;

    if (video && canvas && video.readyState === 4 && net) {
   
      if (
        canvas.width !== video.videoWidth ||
        canvas.height !== video.videoHeight
      ) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

   
      const detected = await net.detect(video, 1, 0.6);

      if (detected?.length) {
      
        setObjectName(detected[0].class || "");
      } else {
        setObjectName("");
      }

      const ctx = canvas.getContext("2d");
      renderPredictions(detected, ctx);
    }

    rafRef.current = requestAnimationFrame(detectLoop);
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      await tf.ready();
      const model = await cocoSSDLoad();
      if (!mounted) return;

      modelRef.current = model;
      setLoading(false);

      runningRef.current = true;
      rafRef.current = requestAnimationFrame(detectLoop);
    };

    load();

    const onVisibility = () => {
      const shouldRun = document.visibilityState === "visible";
      runningRef.current = shouldRun;

      if (shouldRun && !rafRef.current) {
        rafRef.current = requestAnimationFrame(detectLoop);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      mounted = false;

      document.removeEventListener("visibilitychange", onVisibility);

      runningRef.current = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      // dispose model to release GPU/CPU memory
      if (modelRef.current?.dispose) {
        try {
          modelRef.current.dispose();
        } catch {}
      }
      modelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // load once

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-10 w-full">
      {/* Left Section */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left md:w-1/2 space-y-5">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Show an Object & Let <span className="text-green-600">AI Detect</span> It
        </h2>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Place an object in front of the camera and instantly know about it.
        </p>
        <button className="bg-green-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:bg-green-600 transition-all">
          {objectName === "person" ? "A person" : objectName ? `It's a ${objectName}` : "Waiting..."}
        </button>
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
              videoConstraints={{ facingMode: "user" }}
            />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          </>
        )}
      </div>
    </div>
  );
};

export default ObjectDetection;

import React from 'react'
import ObjectDetection from './component/ObjectDetection'

const Page = () => {
 
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 sm:px-8 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      
      {/* Title Section */}
      <header className="text-center mb-10 px-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mt-4">
          AI <span className="text-green-600">Object Detector</span>
        </h1>
      
      </header>

      {/* Object Detection Component */}
      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl border border-gray-200 p-4 sm:p-8 md:p-10">
        <ObjectDetection />
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-gray-500 text-xs sm:text-sm">
        © {new Date().getFullYear()} AI Object Detector. Built with ❤️ by YourName.
      </footer>
    </div>
  )
}

export default Page

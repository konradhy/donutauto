"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function AuthSuccess() {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.close();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleManualClose = () => {
    window.close();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-yellow-100 to-blue-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <Image
          src="/donut-logo.svg"
          alt="DonutAuto Logo"
          width={80}
          height={80}
          className="mx-auto mb-6"
        />
        <h1 className="text-4xl font-extrabold text-pink-600 mb-4">
          Sweet Success!
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          Your Canva account is now connected to DonutAuto. Get ready for some
          delicious automation!
        </p>
        <div className="text-3xl mb-4">🍩</div>
        <p className="text-sm text-gray-500 mb-4">
          This window will close automatically in {countdown} seconds...
        </p>
        <button
          onClick={handleManualClose}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Close Window
        </button>
      </div>
    </div>
  );
}

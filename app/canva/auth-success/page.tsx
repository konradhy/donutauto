"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function AuthSuccess() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.close();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
        <p className="text-sm text-gray-500">
          This window will close automatically in a few seconds...
        </p>
      </div>
    </div>
  );
}

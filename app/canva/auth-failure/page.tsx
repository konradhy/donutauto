"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function AuthFailure() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const handleManualClose = () => {
    window.close();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      window.close();
    }, 5000);

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
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">
          Oops! A Glaze Mishap
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          We couldn&rsquo;t connect your Canva account to DonutAuto. Let&rsquo;s
          try again!
        </p>
        <div className="text-3xl mb-4">🍩❌</div>
        {error && (
          <p className="text-sm text-red-500 mb-4 bg-red-100 p-2 rounded">
            Error: {decodeURIComponent(error)}
          </p>
        )}
        <p className="text-sm text-gray-500">
          This window will close automatically in a few seconds...
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

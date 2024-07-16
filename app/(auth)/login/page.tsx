"use client";
import React from "react";
import { SignIn } from "@clerk/clerk-react";
import Image from "next/image";

const LoginPage = () => {
  return (
    <div className="flex h-screen">
      {/* Left side - Login form */}
      <div className="w-1/2 flex items-center justify-center bg-gradient-to-b from-pink-100 via-yellow-100 to-blue-100 dark:from-pink-900 dark:via-yellow-900 dark:to-blue-900 p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-50">
            Welcome to DonutAuto
          </h1>
          <SignIn />
        </div>
      </div>

      {/* Right side - Image */}
      <div className="w-1/2 relative overflow-hidden">
        <Image
          src="/donutshop.jpg"
          alt="Donut shop interior"
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 transform hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-white text-center px-8 py-6 bg-black bg-opacity-50 rounded-xl backdrop-blur-sm">
            <h2 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-500">
              Automate Your Marketing
            </h2>
            <p className="text-2xl font-semibold">
              Create stunning campaigns in minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

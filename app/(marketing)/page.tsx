"use client";
import React from "react";
import { SignInButton } from "@clerk/clerk-react";

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is a basic home page.</p>
      <SignInButton />
    </div>
  );
};

export default HomePage;

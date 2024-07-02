// MainDashboard.tsx
"use client"
import React from 'react';
import {StickyHeader} from "../_components/sticky-header"
import { SignInButton, UserButton } from "@clerk/clerk-react";


const MainDashboard = () => {
  return (
    <div>
        <StickyHeader className="flex justify-between p-2 ">
            <h1>Dashboard</h1>
            <UserButton />
        </StickyHeader>
      <h1>Main Dashboard</h1>
      <p>Welcome to your dashboard. Here you can find quick links to your most used features.</p>
      <div>
        <button>View Profile</button>
        <button>Settings</button>
        <button>Log Out</button>
      </div>
    </div>
  );
};

export default MainDashboard;
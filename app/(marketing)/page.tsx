"use client";
import brandConfig from "@/lib/brandConfig";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-yellow-100 to-blue-100">
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image
            src="/donut-logo.svg"
            alt={`${brandConfig.name} Logo`}
            width={50}
            height={50}
          />
          <span className="text-3xl font-bold text-pink-600">
            {brandConfig.name}
          </span>
        </div>
        <nav>
          <Link
            href="/features"
            className="text-gray-700 hover:text-pink-600 mr-4"
          >
            Features
          </Link>
          <Link href="/pricing" className="text-gray-700 hover:text-pink-600">
            Pricing
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-12 flex flex-col items-center">
        <h1 className="text-6xl font-extrabold text-center text-gray-800 mb-6">
          Sweeten Your Design Workflow with ${brandConfig.name}
        </h1>
        <p className="text-2xl text-center text-gray-700 mb-12 max-w-3xl">
          Sprinkle some AI magic on your Canva designs, automate your content
          creation, and glaze your social media presence to perfection!
        </p>

        <div className="flex space-x-4">
          <SignInButton mode="modal" afterSignInUrl="/dashboard">
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105">
              Bite In
            </button>
          </SignInButton>
          <SignUpButton mode="modal" afterSignUpUrl="/dashboard">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105">
              Get Glazed
            </button>
          </SignUpButton>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard
            icon="🍩"
            title="AI Flavor Generator"
            description="Whip up delicious design ideas with our AI-powered suggestion tool. Never start with a blank canvas again!"
          />
          <FeatureCard
            icon="🤖"
            title="AutoMate Your Creations"
            description="Set it and forget it! Schedule your designs to be created, updated, and posted across all your channels."
          />
          <FeatureCard
            icon="🚀"
            title="Social Media Sprinkles"
            description="Automatically adapt your Canva designs for every social platform. One design, infinite possibilities!"
          />
        </div>

        <div className="mt-20 bg-white p-8 rounded-xl shadow-lg max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Why Agencies Love Our Special Recipe
          </h2>
          <ul className="list-disc pl-6 space-y-4 text-lg text-gray-700">
            <li>
              Bulk design creation for multiple clients with AI-assisted
              templates
            </li>
            <li>
              Automated brand consistency across all designs and platforms
            </li>
            <li>Real-time collaboration tools for seamless teamwork</li>
            <li>
              Advanced analytics to measure the impact of your delicious designs
            </li>
          </ul>
        </div>
      </main>

      <footer className="bg-gray-100 py-6 mt-12">
        <div className="container mx-auto px-6 text-center text-gray-600">
          {brandConfig.copyright}
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-300 hover:scale-105">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

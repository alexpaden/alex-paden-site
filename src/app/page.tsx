"use client"; // Add this to make it a client component

import React from "react";
import dynamic from 'next/dynamic'

const Animation = dynamic(() => import('@/components/Animation'), { 
  ssr: false,
  loading: () => <div className="w-full aspect-square max-w-[400px] mx-auto mb-4"></div>
})

export default function HomePage() {
  return (
    <main className="flex flex-col md:flex-row w-full min-h-screen bg-white text-gray-900">
      {/* Left Column */}
      <div className="md:fixed md:w-1/4 md:h-screen flex flex-col justify-center items-center py-8 px-4 md:px-8 md:border-r md:border-gray-200">
        <div className="w-full max-w-sm mx-auto flex flex-col items-center space-y-6">
          {/* Logo area */}
          <div className="w-full flex justify-center mb-4">
            <div className="w-full max-w-[400px] flex justify-center">
              <div className="w-[300px] h-[300px] translate-x-2">
                <Animation />
              </div>
            </div>
          </div>

          {/* Name */}
          <h1 className="text-3xl font-bold text-center">ALEX PADEN</h1>

          {/* Tagline */}
          <p className="text-center text-gray-600 text-sm">
            Hacking, writing, and sailing.
          </p>

          {/* Social Links */}
          <div className="flex flex-row gap-6 text-blue-600">
            <a href="https://github.com/alexpaden" target="_blank" rel="noopener noreferrer" className="hover:text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.239 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://warpcast.com/alexpaden" target="_blank" rel="noopener noreferrer" className="hover:text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.571 23.429c-4.269 0-7.571-3.183-7.571-7.143 0-5.143 4.571-10.286 12-16.286 7.429 6 12 11.143 12 16.286 0 4.019-3.183 7.143-7.571 7.143-2.768 0-5.143-1.6-6.429-3.429-1.286 1.829-3.661 3.429-6.429 3.429z"/>
              </svg>
            </a>
            <a href="https://twitter.com/shoni_eth" target="_blank" rel="noopener noreferrer" className="hover:text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
          </div>

          {/* Email subscription input and button */}
          <div className="w-full">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full p-2 mb-2 border border-gray-300 rounded text-sm"
            />
            <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded text-sm transition-transform hover:scale-105">
              Subscribe to newsletter
            </button>
          </div>
        </div>
      </div>

      {/* Spacer div for mobile layout */}
      <div className="block md:hidden py-8"></div>

      {/* Right Column */}
      <div className="w-full md:w-3/4 md:ml-auto p-4 md:p-8">
        {/* Writing / Blog List */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Writing</h2>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center"
              >
                Exploring Digital Identity in Web3 
                <span className="ml-1">↗︎</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center"
              >
                Lessons from Quitting My Second Startup
                <span className="ml-1">↗︎</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center"
              >
                Thoughts on Decentralized Social Networks
                <span className="ml-1">↗︎</span>
              </a>
            </li>
          </ul>
        </section>

        {/* Work & Projects */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Work &amp; Projects</h2>
          <ul className="space-y-2">
            <li>Data Engineer @ Energy Co (2022–Present)</li>
            <li>Founder @ Swish.id (Digital Identity Startup, 2020–2022)</li>
            <li>Co-founder/Product Lead @ Rocketr.net (Payments Startup, 2016–2019)</li>
            <li>Creator of the &quot;DITTI&quot; bot/tool for Farcaster</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

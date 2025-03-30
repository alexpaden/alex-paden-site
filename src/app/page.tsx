"use client"; // Add this to make it a client component

import React, { useState } from "react";
import dynamic from 'next/dynamic'
import Timeline from '@/components/Timeline';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/context/ThemeContext';

const Animation = dynamic(() => import('@/components/Animation'), { 
  ssr: false,
  loading: () => <div className="w-full aspect-square max-w-[400px] mx-auto mb-4"></div>
})

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading'>('idle');
  const { theme } = useTheme();
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      return;
    }
    
    setSubscribeStatus('loading');
    
    // Paragraph.xyz uses a redirect to their subscription page with the email as a query parameter
    const encodedEmail = encodeURIComponent(email);
    const subscribeUrl = `https://blog.alexpaden.tech/subscribe/create-account?email=${encodedEmail}`;
    
    // Open in a new tab or same window (user preference)
    window.open(subscribeUrl, '_blank');
    
    // Reset form state
    setEmail('');
    setSubscribeStatus('idle');
  };

  return (
    <main className={`flex flex-col xl:flex-row w-full min-h-screen pb-8 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} overflow-visible transition-colors duration-300`}>
      {/* Theme Toggle - positioned fixed on the page */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      
      {/* Left Column */}
      <div className={`xl:fixed xl:w-1/4 xl:h-screen flex flex-col justify-center items-center py-8 px-4 xl:px-8 xl:border-r ${theme === 'dark' ? 'xl:border-gray-700' : 'xl:border-gray-200'} relative`}>
        <div className="w-full max-w-sm mx-auto flex flex-col items-center space-y-6 transform xl:-translate-y-[15%]">
          {/* Logo area - removed fixed width/height constraints and added overflow-visible */}
          <div className="flex justify-center mb-4 relative overflow-visible" style={{ width: '300px', height: '300px' }}>
            <div className="w-full h-full overflow-visible absolute">
              <Animation />
            </div>
          </div>

          {/* Name */}
          <h1 className="text-3xl font-bold text-center">ALEX PADEN</h1>

          {/* Tagline */}
          <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            Hacking, writing, building.
          </p>

          {/* Social Links */}
          <div className={`flex flex-row gap-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
            <a href="https://github.com/alexpaden" target="_blank" rel="noopener noreferrer" className={`${theme === 'dark' ? 'hover:text-blue-300' : 'hover:text-blue-800'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.239 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://warpcast.com/alexpaden" target="_blank" rel="noopener noreferrer" className={`${theme === 'dark' ? 'hover:text-blue-300' : 'hover:text-blue-800'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2,3 Q12,0 22,3 L22,5 Q12,2 2,5 Z M6,7 H18 V9 H6 Z M6,9 H8 V22 H6 Z M16,9 H18 V22 H16 Z" />
            </svg>
            </a>
            <a href="https://twitter.com/shoni_eth" target="_blank" rel="noopener noreferrer" className={`${theme === 'dark' ? 'hover:text-blue-300' : 'hover:text-blue-800'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
          </div>

          {/* Email subscription form */}
          <form onSubmit={handleSubscribe} className="w-full">
            <input
              type="email"
              placeholder="your@email.com"
              className={`w-full p-2 mb-2 border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 text-gray-800'} rounded text-sm`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit" 
              className={`w-full py-2 px-4 ${theme === 'dark' ? 'bg-indigo-500 hover:bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded text-sm transition-all hover:scale-105 ${
                subscribeStatus === 'loading' ? 'opacity-70' : ''
              }`}
              disabled={subscribeStatus === 'loading'}
            >
              {subscribeStatus === 'idle' ? 'Subscribe to newsletter' : 'Redirecting...'}
            </button>
            
            <div className={`text-xs text-center mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Read <a 
                href="https://blog.alexpaden.tech" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                The OiD Blog
              </a> for crypto, AI, and identity insights
            </div>
          </form>
        </div>
      </div>

      {/* Spacer div for mobile layout */}
      <div className="block xl:hidden py-8"></div>

      {/* Right Column */}
      <div className="w-full xl:w-3/4 xl:ml-auto p-4 xl:p-8">
        {/* Combined Timeline */}
        <Timeline />
      </div>
    </main>
  );
}
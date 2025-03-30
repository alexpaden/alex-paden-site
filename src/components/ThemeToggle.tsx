"use client";

import { useTheme } from '@/context/ThemeContext';
import React, { useState } from 'react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 900); // Animation duration
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative flex items-center justify-center w-14 h-14 rounded-full focus:outline-none
        ${theme === 'dark' 
          ? 'bg-gray-800 shadow-lg shadow-gray-900/30' 
          : 'bg-white shadow-lg shadow-gray-300/50'
        }
        transition-all duration-300 hover:scale-110
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative">
        {/* Outer circle - changes color with theme */}
        <div className={`
          absolute inset-0 rounded-full w-11 h-11 
          transition-all duration-500 ease-in-out
          ${theme === 'light' 
            ? 'bg-white border-2 border-gray-200' 
            : 'bg-gray-800 border-2 border-gray-700'
          }
        `}></div>
        
        {/* Inner dot particles */}
        <div className="relative w-11 h-11 flex items-center justify-center overflow-hidden">
          {/* Central particle */}
          <div className={`
            absolute w-4 h-4 rounded-full 
            transition-all duration-500 ease-in-out
            ${theme === 'light' ? 'bg-black' : 'bg-white'}
            ${isAnimating ? 'scale-150 opacity-30' : 'scale-100 opacity-100'}
          `}></div>
          
          {/* Orbiting particles */}
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className={`
                absolute w-1.5 h-1.5 rounded-full 
                transition-all duration-500 
                ${theme === 'light' ? 'bg-blue-500' : 'bg-blue-300'}
                ${isAnimating ? 'opacity-100' : 'opacity-0'}
              `}
              style={{
                transformOrigin: 'center',
                transform: `
                  rotate(${i * 72}deg) 
                  translateX(${isAnimating ? 14 : 0}px)
                  scale(${isAnimating ? 1.5 : 0})
                `,
                transition: `
                  transform 800ms cubic-bezier(0.18, 0.89, 0.32, 1.15),
                  opacity 500ms ease-in-out
                `
              }}
            ></div>
          ))}
        </div>
        
        {/* Theme icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle; 
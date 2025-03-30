'use client';

import { useTheme } from '@/context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();
  
  return (
    <div className={`fixed bottom-0 left-0 right-0 py-2 text-center text-xs backdrop-blur-sm ${theme === 'dark' ? 'bg-gray-900/90 text-gray-500 border-t border-gray-800' : 'bg-white/90 text-gray-500 border-t border-gray-200'} transition-colors duration-300 z-10`}>
      <a 
        href="https://github.com/alexpaden/alex-paden-site" 
        target="_blank" 
        rel="noopener noreferrer"
        className={`${theme === 'dark' ? 'hover:text-gray-300' : 'hover:text-gray-700'} transition-colors`}
      >
        View source on GitHub
      </a>
    </div>
  );
} 
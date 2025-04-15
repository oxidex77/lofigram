// src/components/player/ThemeToggle.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';

const ThemeToggle = () => {
  const { theme, changeTheme } = useApp();
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile devices for optimization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const themes = [
    { id: 'pastel', name: 'Pastel', emoji: '🌸' },
    { id: 'night', name: 'Night', emoji: '🌙' },
    { id: 'cozy', name: 'Cozy', emoji: '☕' },
    { id: 'dark', name: 'Dark', emoji: '✨' },
  ];

  return (
    <div className={`w-full ${isMobile ? 'mt-1' : 'mt-3'}`}>
      <div className="flex justify-center space-x-3">
        {themes.map((t) => (
          <motion.button
            key={t.id}
            className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full flex items-center justify-center text-lg ${
              theme === t.id 
                ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-md' 
                : `${theme === 'night' || theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white bg-opacity-50 text-gray-700'}`
            }`}
            whileTap={{ scale: 0.9 }}
            // Reduce hover animation on mobile for performance
            whileHover={isMobile ? { scale: 1.05 } : { y: -2 }}
            onClick={() => changeTheme(t.id)}
          >
            {t.emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;
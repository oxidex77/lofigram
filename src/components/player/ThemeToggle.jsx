// src/components/player/ThemeToggle.jsx
// Replace the existing code with:

import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';

const ThemeToggle = () => {
  const { theme, changeTheme } = useApp();
  
  const themes = [
    { id: 'pastel', name: 'Pastel', emoji: '🌸' },
    { id: 'night', name: 'Night', emoji: '🌙' },
    { id: 'cozy', name: 'Cozy', emoji: '☕' },
    { id: 'dark', name: 'Dark', emoji: '✨' }, // Replaced beach with dark
  ];

  return (
    <div className="w-full mt-6">
      {/* Removed the "Theme" text */}
      <div className="flex justify-center space-x-3">
        {themes.map((t) => (
          <motion.button
            key={t.id}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
              theme === t.id 
                ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-md' 
                : `${theme === 'night' || theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white bg-opacity-50 text-gray-700'}`
            }`}
            whileTap={{ scale: 0.9 }}
            whileHover={{ y: -2 }}
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
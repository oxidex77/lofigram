// src/components/LoadingSpinner.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useThemeContext } from '../contexts/ThemeContext';

const LoadingSpinner = () => {
  const { themeColors } = useThemeContext();
  
  // Create a cute vinyl record spinner animation
  return (
    <div className="loading-spinner">
      <motion.div 
        className="vinyl-spinner"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg 
          width="60" 
          height="60" 
          viewBox="0 0 60 60" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="30" cy="30" r="29" stroke={themeColors.primary} strokeWidth="2"/>
          <circle cx="30" cy="30" r="20" stroke={themeColors.secondary} strokeWidth="2"/>
          <circle cx="30" cy="30" r="10" fill={themeColors.primary}/>
          <circle cx="30" cy="30" r="5" fill={themeColors.secondary}/>
          <path d="M30 0 L30 10" stroke={themeColors.primary} strokeWidth="2"/>
          <path d="M60 30 L50 30" stroke={themeColors.primary} strokeWidth="2"/>
          <path d="M30 60 L30 50" stroke={themeColors.primary} strokeWidth="2"/>
          <path d="M0 30 L10 30" stroke={themeColors.primary} strokeWidth="2"/>
        </svg>
      </motion.div>
      <motion.div 
        className="loading-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop"
        }}
      >
        Loading...
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
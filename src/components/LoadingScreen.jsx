// src/components/LoadingScreen.jsx
import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="kawaii-loading-screen">
      <div className="loading-container">
        <motion.div 
          className="vinyl-container"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="vinyl-record">
            <div className="vinyl-label">
              <span>Lofigram</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="loading-cat"
          initial={{ y: 20 }}
          animate={{ y: [20, 10, 20] }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="120" height="100" viewBox="0 0 120 100">
            {/* Cat ears */}
            <motion.path 
              d="M30,40 L15,15 L35,30 Z" 
              fill="#FFB7D5"
              initial={{ rotate: -5 }}
              animate={{ rotate: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.path 
              d="M90,40 L105,15 L85,30 Z" 
              fill="#FFB7D5"
              initial={{ rotate: 5 }}
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Cat head */}
            <circle cx="60" cy="55" r="30" fill="#FFE2F3" />
            
            {/* Cat eyes */}
            <motion.g
              animate={{ 
                scale: [1, 1.1, 1],
                y: [0, -2, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <circle cx="45" cy="50" r="5" fill="#555" />
              <circle cx="75" cy="50" r="5" fill="#555" />
              <circle cx="43" cy="48" r="2" fill="white" />
              <circle cx="73" cy="48" r="2" fill="white" />
            </motion.g>
            
            {/* Cat nose */}
            <path d="M60,60 L56,65 L64,65 Z" fill="#FFB7D5" />
            
            {/* Cat mouth */}
            <motion.path 
              d="M53,68 Q60,72 67,68" 
              stroke="#555" 
              fill="transparent"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Cat whiskers */}
            <motion.g
              animate={{ x: [0, -1, 0, 1, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <line x1="35" y1="65" x2="20" y2="62" stroke="#AAA" strokeWidth="1.5" />
              <line x1="35" y1="68" x2="20" y2="68" stroke="#AAA" strokeWidth="1.5" />
              <line x1="35" y1="71" x2="20" y2="74" stroke="#AAA" strokeWidth="1.5" />
              
              <line x1="85" y1="65" x2="100" y2="62" stroke="#AAA" strokeWidth="1.5" />
              <line x1="85" y1="68" x2="100" y2="68" stroke="#AAA" strokeWidth="1.5" />
              <line x1="85" y1="71" x2="100" y2="74" stroke="#AAA" strokeWidth="1.5" />
            </motion.g>
          </svg>
        </motion.div>
        
        <div className="loading-text">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Lofigram
          </motion.h1>
          
          <motion.div 
            className="loading-dots"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.span 
                key={i} 
                className="dot"
                animate={{ y: [0, -8, 0] }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity, 
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1] }}
            transition={{ delay: 0.7, duration: 2, repeat: Infinity }}
          >
            Loading your lofi vibes...
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
// src/components/screens/ProfileScreen.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { useApp } from '../../contexts/AppContext';
import { pageTransition, floatingAnimation } from '../../animations/animations';

const ProfileScreen = () => {
  const { userName } = useUser();
  const { navigateTo } = useApp();

  // Auto navigate to home after showing the profile screen
  useEffect(() => {
    const timer = setTimeout(() => {
      navigateTo('home');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigateTo]);

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 p-6 overflow-hidden"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Background decorative elements */}
      <motion.div 
        className="absolute top-20 left-1/4 w-16 h-16 bg-pink-200 rounded-full opacity-40"
        variants={floatingAnimation}
        initial="initial"
        animate="animate"
        custom={1.3}
      />
      <motion.div 
        className="absolute bottom-32 right-1/4 w-20 h-20 bg-purple-200 rounded-full opacity-40"
        variants={floatingAnimation}
        initial="initial"
        animate="animate"
        custom={1.7}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center max-w-md w-full bg-white bg-opacity-70 rounded-3xl p-8 shadow-lg backdrop-filter backdrop-blur-sm"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Welcome message */}
        <motion.div 
          className="text-center mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-purple-700">Welcome, {userName}!</h1>
          <p className="text-purple-500 mt-2">Your kawaii lo-fi journey begins...</p>
        </motion.div>

        {/* Mascots */}
        <div className="flex justify-center items-end space-x-8 my-6">
          <motion.div
            className="relative"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          >
            <img 
              src="/assets/characters/rainy.png" 
              alt="Kawaii Mascot" 
              className="w-32 h-32 object-contain"
            />
            <motion.div
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center text-white text-xs"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.4, type: "spring" }}
            >
              ♫
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
          >
            <img 
              src="/assets/characters/mascot2.png" 
              alt="Kawaii Mascot" 
              className="w-32 h-32 object-contain"
            />
            <motion.div
              className="absolute -bottom-2 -left-2 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center text-white text-xs"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, duration: 0.4, type: "spring" }}
            >
              ♪
            </motion.div>
          </motion.div>
        </div>

        {/* Loading message */}
        <motion.div
          className="text-center text-sm text-purple-400 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ 
            duration: 2,
            times: [0, 0.5, 1],
            repeat: Infinity
          }}
        >
          Preparing your music...
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileScreen;
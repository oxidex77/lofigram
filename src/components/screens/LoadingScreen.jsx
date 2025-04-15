// src/components/screens/LoadingScreen.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { useApp } from '../../contexts/AppContext';
import { loadingPulse, pageTransition, loadingDots, floatingAnimation } from '../../animations/animations';

const LoadingScreen = () => {
  const { isProfileComplete, completeProfile, isLoading } = useUser();
  const { navigateTo } = useApp();
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Simulate loading progress
  useEffect(() => {
    let timer;
    if (loadingProgress < 100) {
      timer = setInterval(() => {
        setLoadingProgress(prev => {
          const increment = Math.floor(Math.random() * 10) + 1;
          return Math.min(prev + increment, 100);
        });
      }, 200);
    } else if (!isLoading) {
      setTimeout(() => {
        if (isProfileComplete) {
          navigateTo('home');
        } else {
          setShowNameInput(true);
        }
      }, 500);
    }

    return () => clearInterval(timer);
  }, [loadingProgress, isLoading, isProfileComplete, navigateTo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      completeProfile(userName.trim());
      navigateTo('profile');
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 p-6 overflow-hidden"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Background floating elements */}
      <motion.div 
        className="absolute top-10 left-10 w-16 h-16 bg-yellow-200 rounded-full opacity-40"
        variants={floatingAnimation}
        initial="initial"
        animate="animate"
        custom={1}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-20 h-20 bg-blue-200 rounded-full opacity-40"
        variants={floatingAnimation}
        initial="initial"
        animate="animate"
        custom={1.5}
      />
      <motion.div 
        className="absolute top-1/4 right-1/4 w-12 h-12 bg-pink-300 rounded-full opacity-30"
        variants={floatingAnimation}
        initial="initial"
        animate="animate"
        custom={0.8}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        {/* Logo */}
        <motion.div
          className="mb-10"
          variants={loadingPulse}
          initial="initial"
          animate="animate"
        >
          <motion.div className="text-5xl font-bold text-center text-purple-600">
            Lofigram
          </motion.div>
          <div className="text-lg text-center text-purple-400 mt-2">
            your kawaii lo-fi companion
          </div>
        </motion.div>

        {/* Loading progress or name input */}
        {!showNameInput ? (
          <div className="w-full">
            <div className="relative h-3 bg-purple-100 rounded-full overflow-hidden mb-2 w-full">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-400 to-purple-500"
                initial={{ width: '0%' }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            <div className="flex justify-center space-x-1 mt-4">
              <motion.span 
                custom={0}
                variants={loadingDots}
                initial="initial"
                animate="animate"
                className="inline-block w-2 h-2 bg-purple-500 rounded-full"
              />
              <motion.span 
                custom={0.2}
                variants={loadingDots}
                initial="initial"
                animate="animate"
                className="inline-block w-2 h-2 bg-purple-500 rounded-full"
              />
              <motion.span 
                custom={0.4}
                variants={loadingDots}
                initial="initial"
                animate="animate"
                className="inline-block w-2 h-2 bg-purple-500 rounded-full"
              />
            </div>
          </div>
        ) : (
          <motion.form 
            onSubmit={handleSubmit}
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-6 text-purple-700">
              Welcome to Lofigram! <br />
              What's your name?
            </div>
            
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-full bg-white bg-opacity-80 border-2 border-purple-300 focus:border-purple-500 focus:outline-none text-purple-700 placeholder-purple-300 text-center mb-4"
              autoFocus
            />
            
            <motion.button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-medium rounded-full hover:opacity-90 focus:outline-none shadow-md"
              whileTap={{ scale: 0.97 }}
              disabled={!userName.trim()}
            >
              Let's Go!
            </motion.button>
          </motion.form>
        )}
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
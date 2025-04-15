// src/components/screens/LoadingScreen.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { useApp } from '../../contexts/AppContext';

const LoadingScreen = () => {
  const { isProfileComplete, completeProfile, isLoading } = useUser();
  const { navigateTo } = useApp();
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
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

  // Simulate loading progress
  useEffect(() => {
    let timer;
    if (loadingProgress < 100) {
      timer = setInterval(() => {
        setLoadingProgress(prev => {
          const increment = Math.floor(Math.random() * 5) + 1;
          return Math.min(prev + increment, 100);
        });
      }, 100);
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

  // Animation variants for smoother transitions
  const pageVariants = {
    initial: {
      opacity: 0
    },
    in: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
    out: {
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  // Improved floating animation for decorative elements
  const floatingAnimation = (delay) => ({
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }
  });

  // Staggered children animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-pink-200" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top blobs */}
        <motion.div 
          className="absolute top-[5%] left-[10%] w-32 h-32 rounded-full bg-pink-300 opacity-20 blur-2xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 10, 0],
            y: [0, -5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        <motion.div 
          className="absolute top-[20%] right-[15%] w-40 h-40 rounded-full bg-purple-300 opacity-20 blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            x: [0, -15, 0],
            y: [0, 10, 0]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Bottom blobs */}
        <motion.div 
          className="absolute bottom-[15%] right-[20%] w-36 h-36 rounded-full bg-pink-300 opacity-20 blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -10, 0],
            y: [0, 5, 0]
          }}
          transition={{ 
            duration: 9, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <motion.div 
          className="absolute bottom-[25%] left-[15%] w-44 h-44 rounded-full bg-purple-300 opacity-20 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, 20, 0],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Floating particles (only on non-mobile) */}
        {!isMobile && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute rounded-full bg-white"
                style={{
                  width: Math.random() * 4 + 2,
                  height: Math.random() * 4 + 2,
                  left: `${Math.random() * 90 + 5}%`,
                  top: `${Math.random() * 90 + 5}%`,
                }}
                animate={{
                  y: [0, -30],
                  x: i % 2 === 0 ? [0, 10] : [0, -10],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: Math.random() * 5 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md p-6">
        {/* Logo and Loading State */}
        {!showNameInput ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            {/* Logo */}
            <motion.div 
              variants={itemVariants}
              className="text-center mb-10"
            >
              <h1 className="text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-display">
                Lofigram
              </h1>
              <p className="text-base sm:text-lg text-purple-500 mt-1">
                your kawaii lo-fi companion
              </p>
            </motion.div>

            {/* Animated Lo-fi Cat */}
            <motion.div
              variants={itemVariants}
              className="w-48 h-48 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-10 relative overflow-hidden gpu-accelerated"
            >
              {/* Cat container with drop shadow and subtle glow */}
              <div className="relative w-32 h-32 filter drop-shadow-md">
                {/* Cat body - soft circle */}
                <div className="absolute inset-0 bg-gray-100 rounded-full shadow-inner"></div>
                
                {/* Cat ears */}
                <motion.div 
                  className="absolute -top-5 -left-2 w-10 h-10 bg-gray-200"
                  style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                  animate={{ rotate: [-2, 2, -2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <motion.div 
                  className="absolute -top-5 -right-2 w-10 h-10 bg-gray-200"
                  style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                  animate={{ rotate: [2, -2, 2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Cat eyes - blinking animation */}
                <div className="absolute top-1/3 left-0 right-0 flex justify-center space-x-8">
                  <motion.div 
                    className="w-2.5 h-3 bg-gray-800 rounded-full"
                    animate={{ scaleY: [1, 0.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
                  />
                  
                  <motion.div 
                    className="w-2.5 h-3 bg-gray-800 rounded-full"
                    animate={{ scaleY: [1, 0.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
                  />
                </div>
                
                {/* Cat nose */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1 w-3 h-3 bg-pink-300 rounded-full" />
                
                {/* Cat mouth - happy curve */}
                <motion.div 
                  className="absolute top-[60%] left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-gray-800 rounded-b-full"
                  animate={{ scaleY: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Cat headphones */}
                <motion.div
                  className="absolute -top-1 left-0 right-0 w-full pointer-events-none"
                  animate={{ y: [-1, 1, -1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-pink-400 rounded" />
                    <div className="absolute -left-6 top-0 w-6 h-9 bg-pink-400 rounded-md" />
                    <div className="absolute -right-6 top-0 w-6 h-9 bg-pink-400 rounded-md" />
                  </div>
                </motion.div>
              </div>
              
              {/* Decorative musical notes that float around the cat */}
              <motion.div 
                className="absolute top-6 right-6 text-purple-400 text-xl"
                animate={floatingAnimation(0.5)}
              >
                ♫
              </motion.div>
              
              <motion.div 
                className="absolute bottom-8 left-8 text-pink-400 text-lg"
                animate={floatingAnimation(1)}
              >
                ♪
              </motion.div>
              
              {/* Coffee cup decoration */}
              <motion.div 
                className="absolute bottom-6 right-8 text-lg"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ☕
              </motion.div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div variants={itemVariants} className="w-64 mb-4">
              <div className="h-2 bg-white bg-opacity-50 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full relative"
                  style={{ width: `${loadingProgress}%` }}
                  transition={{ type: "tween" }}
                >
                  {/* Sparkle at the end of progress bar */}
                  {loadingProgress > 10 && (
                    <motion.div
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                      animate={{ 
                        scale: [0.8, 1.2, 0.8],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <div className="w-3 h-3 bg-white rounded-full opacity-70 blur-[1px]" />
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
            
            {/* Loading Text */}
            <motion.p 
              variants={itemVariants}
              className="text-purple-600 text-sm font-medium flex items-center"
            >
              Creating your vibe...
              <motion.span
                className="ml-2 font-semibold"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {loadingProgress}%
              </motion.span>
            </motion.p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {/* Name Input Form */}
            <motion.form 
              onSubmit={handleSubmit}
              className="w-full max-w-md bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-3xl p-8 shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
            >
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <motion.div 
                  className="text-3xl mb-4 inline-block"
                  animate={{ 
                    rotate: [-5, 5, -5],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                  }}
                >
                  ✨
                </motion.div>
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                  What's your name?
                </h2>
              </motion.div>
              
              <motion.div 
                className="relative mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >              
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-6 py-4 rounded-2xl bg-white bg-opacity-90 border-2 border-purple-200 focus:border-purple-400 focus:outline-none text-purple-700 placeholder-purple-300 text-center shadow-md pr-12"
                  autoFocus
                />
                
                {/* Bouncing headphone emoji */}
                <motion.div
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-2xl pointer-events-none"
                  animate={{ 
                    y: [0, -3, 0],
                    rotate: [-5, 5, -5]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                >
                  🎧
                </motion.div>
              </motion.div>
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-medium rounded-xl focus:outline-none shadow-md relative overflow-hidden"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 20px rgba(219, 39, 119, 0.25)"
                }}
                whileTap={{ scale: 0.98 }}
                disabled={!userName.trim()}
              >
                <span className="relative z-10">Let's Get Cozy</span>
                
                {/* Button glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-0"
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>
              
              {/* Decorative floating dots */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-8 flex justify-center"
              >
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div
                    key={i}
                    className="mx-1 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
                    animate={{ 
                      y: [0, -15, 0],
                      opacity: [0.4, 1, 0.4]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut" 
                    }}
                  />
                ))}
              </motion.div>
            </motion.form>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
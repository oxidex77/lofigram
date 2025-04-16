// src/components/screens/ProfileScreen.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { useApp } from '../../contexts/AppContext';

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

  // Improved animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96],
        when: "beforeChildren",
        staggerChildren: 0.1,
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.43, 0.13, 0.23, 0.96],
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  // Child element animations
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96],
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      transition: { 
        duration: 0.3,
        ease: [0.43, 0.13, 0.23, 0.96],
      }
    }
  };

  // Floating animation for decorative elements
  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 p-6 overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Background decorative elements */}
      <motion.div 
        className="absolute top-20 left-1/4 w-32 h-32 bg-pink-200 rounded-full opacity-40 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-32 right-1/4 w-40 h-40 bg-purple-200 rounded-full opacity-40 blur-3xl"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center max-w-md w-full bg-white bg-opacity-70 rounded-3xl p-8 shadow-lg backdrop-filter backdrop-blur-sm"
        variants={itemVariants}
      >
        {/* Welcome message */}
        <motion.div 
          className="text-center mb-6"
          variants={itemVariants}
        >
          <h1 className="text-2xl font-bold text-purple-700">Welcome, {userName}!</h1>
          <p className="text-purple-500 mt-2">Your kawaii lo-fi journey begins...</p>
        </motion.div>

        {/* Mascots - enhanced with better animations */}
        {/* <div className="flex justify-center items-end space-x-8 my-6">
          <motion.div
            className="relative"
            variants={itemVariants}
          >
            <motion.img 
              src="/assets/characters/mascot1.png" 
              alt="Kawaii Mascot" 
              className="w-32 h-32 object-contain"
              whileHover={{ rotate: [-5, 5, -5], transition: { duration: 0.5 } }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center text-white text-xs"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4, type: "spring" }}
            >
              ♫
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            variants={itemVariants}
          >
            <motion.img 
              src="/assets/characters/mascot2.png" 
              alt="Kawaii Mascot" 
              className="w-32 h-32 object-contain"
              whileHover={{ rotate: [5, -5, 5], transition: { duration: 0.5 } }}
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />
            <motion.div
              className="absolute -bottom-2 -left-2 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center text-white text-xs"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.4, type: "spring" }}
            >
              ♪
            </motion.div>
          </motion.div>
        </div> */}

        {/* Loading message with improved animation */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-4"
        >
          <motion.div 
            className="inline-flex items-center justify-center space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-purple-600">Preparing your music</span>
            {[0, 1, 2].map((dot, i) => (
              <motion.span
                key={i}
                className="text-purple-600"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  y: [0, -3, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              >
                .
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Floating notes around the screen */}
      <motion.div 
        className="absolute top-1/4 right-1/4 text-pink-500 text-2xl opacity-50"
        variants={floatingAnimation}
        animate="animate"
      >
        ♫
      </motion.div>
      <motion.div 
        className="absolute bottom-1/3 left-1/3 text-purple-500 text-3xl opacity-50"
        variants={floatingAnimation}
        animate="animate"
      >
        ♪
      </motion.div>
      <motion.div 
        className="absolute top-1/2 right-1/3 text-pink-400 text-xl opacity-50"
        variants={floatingAnimation}
        animate="animate"
      >
        ♩
      </motion.div>
    </motion.div>
  );
};

export default ProfileScreen;
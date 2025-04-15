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

  // Particles for ambient atmosphere
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    delay: Math.random() * 5,
  }));

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #ffcdd2 0%, #e1bee7 50%, #ffccbc 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            'linear-gradient(135deg, #ffcdd2 0%, #e1bee7 50%, #ffccbc 100%)',
            'linear-gradient(135deg, #f8bbd0 0%, #d1c4e9 50%, #ffccbc 100%)',
            'linear-gradient(135deg, #ffcdd2 0%, #e1bee7 50%, #ffccbc 100%)',
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Blurred bokeh orbs */}
      <motion.div 
        className="absolute top-[10%] left-[10%] w-80 h-80 rounded-full bg-pink-200 opacity-30 z-0 blur-3xl"
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
        className="absolute bottom-[10%] right-[10%] w-96 h-96 rounded-full bg-purple-300 opacity-30 z-0 blur-3xl"
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

      {/* Ambient floating sparkles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white z-0"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -100],
            x: [0, particle.id % 2 === 0 ? 20 : -20],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 8 + particle.delay,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
        {!showNameInput ? (
          <>
            {/* Logo with breathing effect */}
            <motion.div
              className="mb-8 text-center"
              animate={{ 
                scale: [1, 1.03, 1],
                filter: ["drop-shadow(0 0 0px rgba(236,72,153,0.3))", "drop-shadow(0 0 8px rgba(236,72,153,0.6))", "drop-shadow(0 0 0px rgba(236,72,153,0.3))"]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-pink-500 to-purple-600 font-display tracking-wider">
                Lofigram
              </h1>
              <p className="text-lg text-purple-400 mt-1 font-medium">
                your kawaii lo-fi companion
              </p>
            </motion.div>

            {/* Animated Mascot: Lo-Fi Cat */}
            <motion.div
              className="w-48 h-48 bg-white p-5 rounded-2xl shadow-lg mb-10 relative overflow-hidden"
              animate={{ 
                boxShadow: ["0px 4px 12px rgba(0,0,0,0.1)", "0px 10px 30px rgba(0,0,0,0.15)", "0px 4px 12px rgba(0,0,0,0.1)"],
                y: [0, -5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              {/* Cat body */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Cat head & body */}
                <div className="w-28 h-28 bg-gray-200 rounded-full relative">
                  {/* Ears */}
                  <motion.div 
                    className="absolute -top-5 -left-2 w-10 h-10 bg-gray-300"
                    style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute -top-5 right-0 w-10 h-10 bg-gray-300"
                    style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                    animate={{ rotate: [2, -2, 2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  {/* Eyes */}
                  <div className="flex justify-center space-x-6 absolute top-1/3 w-full">
                    <motion.div 
                      className="w-3 h-3 bg-gray-800 rounded-full"
                      animate={{ scaleY: [1, 0.2, 1] }}
                      transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
                    />
                    <motion.div 
                      className="w-3 h-3 bg-gray-800 rounded-full"
                      animate={{ scaleY: [1, 0.2, 1] }}
                      transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
                    />
                  </div>
                  
                  {/* Nose and mouth */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                    <div className="w-3 h-3 bg-pink-300 rounded-full" />
                    <div className="w-6 h-3 border-t-0 border-l-2 border-r-2 border-b-0 border-gray-800 rounded-b-lg mt-1" />
                  </div>

                  {/* Headphones */}
                  <motion.div
                    className="absolute -top-1 left-0 right-0 w-full"
                    animate={{ y: [-1, 1, -1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="relative">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-purple-400 rounded" />
                      <div className="absolute -left-4 top-0 w-5 h-8 bg-pink-400 rounded-md" />
                      <div className="absolute -right-4 top-0 w-5 h-8 bg-pink-400 rounded-md" />
                    </div>
                  </motion.div>
                </div>

                {/* Stickers on card */}
                <motion.div 
                  className="absolute bottom-0 right-2 text-xl"
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  ☕
                </motion.div>
                <motion.div 
                  className="absolute top-2 left-2 text-xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⭐
                </motion.div>

                {/* Floating music notes */}
                <AnimatePresence>
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute text-purple-500 text-xl"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5],
                        y: [-20, -60],
                        x: i % 2 === 0 ? 10 : -10
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 1.5,
                      }}
                      style={{
                        bottom: "20%",
                        right: `${30 + i * 10}%`,
                      }}
                    >
                      {i % 2 === 0 ? '♪' : '♫'}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Floating hearts */}
                {[1, 2].map((i) => (
                  <motion.div
                    key={`heart-${i}`}
                    className="absolute text-pink-400 text-sm"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 0.8, 0],
                      scale: [0.5, 1, 0.5],
                      y: [-10, -40],
                      x: i === 1 ? 15 : -15
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 2.5,
                    }}
                    style={{
                      bottom: "10%",
                      left: `${20 + i * 20}%`,
                    }}
                  >
                    ❤️
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Progress Indicator */}
            <div className="w-64 relative mb-3">
              <div className="h-3 bg-white bg-opacity-50 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full relative"
                  initial={{ width: '0%' }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Sparkles that follow the progress */}
                  <motion.div
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 flex"
                    animate={{ scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <div className="w-1 h-1 bg-white rounded-full mr-1" />
                    <div className="w-2 h-2 bg-white rounded-full mr-1" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
            
            <motion.div 
              className="text-purple-600 text-sm font-medium flex items-center"
              animate={{ 
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              Creating your vibe... 
              <motion.span
                className="ml-1 font-bold"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {loadingProgress}%
              </motion.span>
            </motion.div>
          </>
        ) : (
          <motion.form 
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white bg-opacity-80 backdrop-filter backdrop-blur-md rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div 
              className="text-center mb-8"
              animate={{ 
                y: [0, -5, 0],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <span className="text-3xl mb-3 block">✨</span>
              <h2 className="text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                What's your name?
              </h2>
            </motion.div>
            
            <div className="relative mb-8">              
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
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl pointer-events-none"
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
            </div>
            
            <motion.button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-medium rounded-xl focus:outline-none shadow-md relative overflow-hidden"
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 8px 20px rgba(219, 39, 119, 0.25)"
              }}
              whileTap={{ scale: 0.97 }}
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
            <div className="mt-8 flex justify-center">
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
            </div>
          </motion.form>
        )}
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
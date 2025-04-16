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
  const [isNightMode, setIsNightMode] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("Warming up lo-fi vibes... ☁️");

  // Array of rotating messages
  const loadingMessages = [
    "Warming up lo-fi vibes... ☁️",
    "Brewing your cozy beats... ☕",
    "Syncing with chill mode... 🎧",
    "Collecting sleepy tunes... 😴",
    "Assembling kawaii sounds... 🌸",
    "Finding the perfect rhythm... 🎵",
    "Creating your zen space... 🧘‍♀️",
    "Mixing looped melodies... 💿",
    "Preparing study beats... 📚",
    "Ready to drift away... ✨"
  ];

  // Detect mobile devices for optimization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set night mode based on time of day
    const hours = new Date().getHours();
    setIsNightMode(hours < 6 || hours >= 18);
    
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
          const increment = Math.floor(Math.random() * 3) + 1;
          const newProgress = Math.min(prev + increment, 100);
          
          // Update message every 10%
          if (Math.floor(prev / 10) !== Math.floor(newProgress / 10)) {
            const messageIndex = Math.floor(newProgress / 10);
            if (messageIndex < loadingMessages.length) {
              setCurrentMessage(loadingMessages[messageIndex]);
            }
          }
          
          return newProgress;
        });
      }, 150);
    } else if (!isLoading) {
      setTimeout(() => {
        if (isProfileComplete) {
          navigateTo('home');
        } else {
          setShowNameInput(true);
        }
      }, 800);
    }

    return () => clearInterval(timer);
  }, [loadingProgress, isLoading, isProfileComplete, navigateTo, loadingMessages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      completeProfile(userName.trim());
      navigateTo('profile');
    }
  };

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    in: {
      opacity: 1,
      transition: {
        duration: 0.8,
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
      transition: { duration: 0.5 }
    }
  };

  // Floating animation
  const floatingAnimation = (delay) => ({
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }
  });

  // Calculate mascot emotion based on progress
  const getMascotEmotion = () => {
    if (loadingProgress < 30) return "😌";
    if (loadingProgress < 60) return "😊";
    if (loadingProgress < 90) return "😄";
    return "🥰";
  };

  // Get background gradient based on mode
  const getBackgroundGradient = () => {
    return isNightMode 
      ? "from-indigo-900 via-purple-900 to-indigo-800" 
      : "from-lavender-200 via-pink-100 to-sky-100";
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
      <div className={`absolute inset-0 bg-gradient-to-br ${getBackgroundGradient()}`} />
      
      {/* Toggle Day/Night Mode */}
      <motion.button
        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleNightMode}
      >
        {isNightMode ? "☀️" : "🌙"}
      </motion.button>
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Ambient Background Elements */}
        {!isMobile && (
          <>
            {/* Books - only in desktop */}
            <motion.div 
              className="absolute bottom-10 left-20 text-6xl"
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              {isNightMode ? "📚" : "📚"}
            </motion.div>
            
            {/* Coffee Cup - only in desktop */}
            <motion.div 
              className="absolute bottom-20 right-40 text-5xl"
              animate={{ rotate: [-3, 3, -3], y: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              {isNightMode ? "☕" : "☕"}
            </motion.div>
            
            {/* Plant - only in desktop */}
            <motion.div 
              className="absolute top-20 left-40 text-5xl"
              animate={{ rotate: [-3, 3, -3], y: [0, -2, 0] }}
              transition={{ duration: 7, repeat: Infinity }}
            >
              {isNightMode ? "🪴" : "🌵"}
            </motion.div>
          </>
        )}
        
        {/* Animated Blobs */}
        <motion.div 
          className={`absolute top-[10%] left-[10%] w-32 h-32 rounded-full ${isNightMode ? 'bg-purple-800' : 'bg-pink-300'} opacity-20 blur-2xl`}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 15, 0],
            y: [0, -10, 0]
          }}
          transition={{ duration:
           8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className={`absolute top-[30%] right-[15%] w-40 h-40 rounded-full ${isNightMode ? 'bg-indigo-700' : 'bg-sky-200'} opacity-20 blur-3xl`}
          animate={{
            scale: [1.1, 1, 1.1],
            x: [0, -15, 0],
            y: [0, 10, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className={`absolute bottom-[20%] right-[25%] w-36 h-36 rounded-full ${isNightMode ? 'bg-purple-600' : 'bg-lavender-300'} opacity-20 blur-2xl`}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -10, 0],
            y: [0, 5, 0]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        {/* Night Mode Stars */}
        {isNightMode && (
          <>
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute rounded-full bg-white"
                style={{
                  width: Math.random() * 3 + 1,
                  height: Math.random() * 3 + 1,
                  left: `${Math.random() * 95}%`,
                  top: `${Math.random() * 95}%`,
                }}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </>
        )}
        
        {/* Floating notes and hearts */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`float-${i}`}
            className={`absolute text-lg ${isNightMode ? 'text-purple-300' : 'text-pink-400'}`}
            style={{
              left: `${Math.random() * 80 + 10}%`,
              bottom: `-5%`,
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: [0, -300],
              x: i % 2 === 0 ? [0, 20, -20, 0] : [0, -20, 20, 0],
              opacity: [0, 0.8, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
          >
            {i % 3 === 0 ? '♪' : i % 3 === 1 ? '♫' : '♥'}
          </motion.div>
        ))}
      </div>

      {/* Content Container */}
      <div className={`relative z-10 flex flex-col items-center justify-center w-${isMobile ? '11/12' : '96'} max-w-md p-6`}>
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
              className="text-center mb-8"
            >
              <h1 className={`text-5xl sm:text-6xl font-bold text-transparent bg-clip-text ${isNightMode ? 'bg-gradient-to-r from-pink-400 to-purple-300' : 'bg-gradient-to-r from-pink-500 to-purple-500'} font-display`}>
                Lofigram
              </h1>
              <p className={`text-base sm:text-lg ${isNightMode ? 'text-purple-300' : 'text-purple-500'} mt-1`}>
                your Dreamy lo-fi companion
              </p>
            </motion.div>

            {/* Mascot container */}
            <motion.div
              variants={itemVariants}
              className={`w-52 h-52 ${isNightMode ? 'bg-gray-800 bg-opacity-40' : 'bg-white bg-opacity-75'} backdrop-filter backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center mb-8 relative overflow-hidden border-2 ${isNightMode ? 'border-purple-700' : 'border-pink-200'}`}
            >
              {/* Vinyl record spinning under mascot */}
              <motion.div 
                className={`absolute w-40 h-40 rounded-full ${isNightMode ? 'bg-gray-900' : 'bg-gray-800'} z-0 flex items-center justify-center`}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                {/* Vinyl groove circles */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`groove-${i}`}
                    className={`absolute rounded-full border ${isNightMode ? 'border-gray-700' : 'border-gray-600'}`}
                    style={{
                      width: `${70 - i * 12}%`,
                      height: `${70 - i * 12}%`
                    }}
                  />
                ))}
                <motion.div className="w-6 h-6 rounded-full bg-white" />
              </motion.div>
              
              {/* Lo-fi Bunny */}
              <motion.div
                className="relative z-10 w-32 h-32"
                animate={{ 
                  y: [0, -5, 0],
                  rotate: [-2, 2, -2]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Bunny head */}
                <div className={`w-24 h-24 rounded-full ${isNightMode ? 'bg-gray-300' : 'bg-white'} absolute top-0 left-1/2 transform -translate-x-1/2 shadow-md`}>
                  {/* Blush cheeks */}
                  <div className="absolute w-4 h-2 rounded-full bg-pink-200 left-2 top-12" />
                  <div className="absolute w-4 h-2 rounded-full bg-pink-200 right-2 top-12" />
                  
                  {/* Eyes */}
                  <motion.div 
                    className="absolute w-2 h-3 bg-gray-800 rounded-full left-6 top-8"
                    animate={{ 
                      scaleY: loadingProgress === 100 ? [1, 0.1, 1] : [1], 
                      x: [0, loadingProgress / 50, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      repeatDelay: 2
                    }}
                  />
                  <motion.div 
                    className="absolute w-2 h-3 bg-gray-800 rounded-full right-6 top-8"
                    animate={{ 
                      scaleY: loadingProgress === 100 ? [1, 0.1, 1] : [1],
                      x: [0, -loadingProgress / 50, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      repeatDelay: 2
                    }}
                  />
                  
                  {/* Mouth - changes with progress */}
                  <div className="absolute text-sm top-14 left-1/2 transform -translate-x-1/2">
                    {getMascotEmotion()}
                  </div>
                </div>
                
                {/* Bunny ears */}
                <motion.div 
                  className={`absolute w-6 h-16 ${isNightMode ? 'bg-gray-300' : 'bg-white'} rounded-full -top-12 left-4 transform -rotate-6 shadow-sm`}
                  animate={{ rotate: [-8, -4, -8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div 
                  className={`absolute w-6 h-16 ${isNightMode ? 'bg-gray-300' : 'bg-white'} rounded-full -top-12 right-4 transform rotate-6 shadow-sm`}
                  animate={{ rotate: [8, 4, 8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Headphones */}
                <div className="absolute top-0 w-full">
                  <div className={`absolute h-1.5 w-24 ${isNightMode ? 'bg-purple-400' : 'bg-pink-400'} left-1/2 -top-1 transform -translate-x-1/2 rounded-full`} />
                  <div className={`absolute w-6 h-8 ${isNightMode ? 'bg-purple-400' : 'bg-pink-400'} rounded-md -left-2 top-2`} />
                  <div className={`absolute w-6 h-8 ${isNightMode ? 'bg-purple-400' : 'bg-pink-400'} rounded-md -right-2 top-2`} />
                </div>
              </motion.div>
              
              {/* Sparkling effects */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className={`absolute w-2 h-2 ${isNightMode ? 'bg-purple-300' : 'bg-pink-200'} rounded-full`}
                  style={{
                    top: `${30 + Math.random() * 60}%`,
                    left: `${30 + Math.random() * 60}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.6,
                  }}
                />
              ))}
            </motion.div>

            {/* Progress Ring */}
            <motion.div 
              variants={itemVariants}
              className="relative w-40 h-40 mb-6 flex items-center justify-center"
            >
              {/* Background Ring */}
              <div className={`absolute w-40 h-40 rounded-full border-4 ${isNightMode ? 'border-gray-700' : 'border-gray-200'} border-opacity-40`} />
              
              {/* Progress Circle */}
              <svg className="absolute w-40 h-40" viewBox="0 0 100 100">
                <motion.circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  strokeWidth="4"
                  stroke={isNightMode ? "#9f7aea" : "#ec4899"}
                  strokeLinecap="round"
                  strokeDasharray="289.027"
                  strokeDashoffset={289.027 - (289.027 * loadingProgress) / 100}
                  transform="rotate(-90 50 50)"
                  className={`filter ${isNightMode ? 'drop-shadow-glow-purple' : 'drop-shadow-glow-pink'}`}
                  style={{ filter: `drop-shadow(0 0 2px ${isNightMode ? "#9f7aea" : "#ec4899"})` }}
                />
              </svg>
              
              {/* Percentage Text */}
              <motion.div 
                className={`text-xl font-medium ${isNightMode ? 'text-purple-300' : 'text-pink-500'}`}
                animate={{ 
                  scale: loadingProgress === 100 ? [1, 1.2, 1] : [1],
                }}
                transition={{ duration: 0.5 }}
              >
                {loadingProgress}%
              </motion.div>
            </motion.div>

            {/* Loading Message */}
            <motion.p
              variants={itemVariants}
              className={`text-lg ${isNightMode ? 'text-purple-300' : 'text-purple-600'} font-medium text-center`}
              animate={{ 
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentMessage}
            </motion.p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {/* Name Input Form */}
            <motion.form 
              onSubmit={handleSubmit}
              className={`w-full max-w-md ${isNightMode ? 'bg-gray-800 bg-opacity-50' : 'bg-white bg-opacity-70'} backdrop-filter backdrop-blur-sm rounded-3xl p-8 shadow-xl`}
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
                <h2 className={`text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r ${isNightMode ? 'from-pink-400 to-purple-300' : 'from-pink-500 to-purple-600'}`}>
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
                  className={`w-full px-6 py-4 rounded-2xl ${isNightMode ? 'bg-gray-700 bg-opacity-80 text-purple-200 placeholder-purple-400 border-purple-600' : 'bg-white bg-opacity-90 text-purple-700 placeholder-purple-300 border-purple-200'} border-2 focus:border-purple-400 focus:outline-none text-center shadow-md pr-12`}
                  autoFocus
                />
                
                {/* Bunny emoji that follows cursor */}
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
                  🐰
                </motion.div>
              </motion.div>
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                type="submit"
                className={`w-full py-4 px-6 bg-gradient-to-r ${isNightMode ? 'from-purple-600 to-indigo-600' : 'from-pink-400 to-purple-500'} text-white font-medium rounded-xl focus:outline-none shadow-md relative overflow-hidden`}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: isNightMode ? "0 8px 20px rgba(124, 58, 237, 0.25)" : "0 8px 20px rgba(219, 39, 119, 0.25)"
                }}
                whileTap={{ scale: 0.98 }}
                disabled={!userName.trim()}
              >
                <span className="relative z-10">Start Chilling</span>
                
                {/* Button glow effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${isNightMode ? 'from-purple-500 to-indigo-500' : 'from-pink-500 to-purple-600'} opacity-0`}
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>
              
              {/* Decorative floating musical notes */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-8 flex justify-center space-x-4"
              >
                {['♫', '♪', '♥'].map((symbol, i) => (
                  <motion.div
                    key={i}
                    className={`text-xl ${isNightMode ? 'text-purple-400' : 'text-pink-400'}`}
                    animate={{ 
                      y: [0, -10, 0],
                      opacity: [0.4, 1, 0.4]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut" 
                    }}
                  >
                    {symbol}
                  </motion.div>
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
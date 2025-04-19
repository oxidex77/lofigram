import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { useApp } from '../../contexts/AppContext';

const LOADING_INTERVAL = 150; 
const MAX_INCREMENT = 8; 
const MIN_INCREMENT = 2; 
const MESSAGE_UPDATE_THRESHOLD = 10; 
const TRANSITION_DURATION_PAGE = 0.6; 
const TRANSITION_DURATION_FORM = 0.4; 

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

const LoadingScreen = () => {
    const { isProfileComplete, completeProfile, isLoading: isUserContextLoading } = useUser();
    const { navigateTo } = useApp();
    const [userName, setUserName] = useState('');
    const [showNameInput, setShowNameInput] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isNightMode, setIsNightMode] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);
    const [hasReached100, setHasReached100] = useState(false); 

    const progressIntervalRef = useRef(null); 

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        const hours = new Date().getHours();
        setIsNightMode(hours < 6 || hours >= 18); 

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const setVhVariable = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVhVariable();

        window.addEventListener('resize', setVhVariable);
        window.addEventListener('orientationchange', setVhVariable);

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('resize', setVhVariable);
            window.removeEventListener('orientationchange', setVhVariable);
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, []);

    useEffect(() => {
        clearInterval(progressIntervalRef.current);

        if (loadingProgress < 100) {
            progressIntervalRef.current = setInterval(() => {
                setLoadingProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(progressIntervalRef.current);
                        return 100;
                    }

                    const increment = Math.floor(Math.random() * (MAX_INCREMENT - MIN_INCREMENT + 1)) + MIN_INCREMENT;
                    const newProgress = Math.min(prev + increment, 100);

                    const currentBand = Math.floor(prev / MESSAGE_UPDATE_THRESHOLD);
                    const newBand = Math.floor(newProgress / MESSAGE_UPDATE_THRESHOLD);

                    if (newBand > currentBand && newBand < loadingMessages.length) {
                        setCurrentMessage(loadingMessages[newBand]);
                    } else if (newProgress === 100 && currentBand < loadingMessages.length - 1) {
                        setCurrentMessage(loadingMessages[loadingMessages.length - 1]);
                    }


                    if (newProgress === 100) {
                        setHasReached100(true); 
                        clearInterval(progressIntervalRef.current); 
                    }

                    return newProgress;
                });
            }, LOADING_INTERVAL);
        }

        return () => clearInterval(progressIntervalRef.current);

    }, [loadingProgress]); 

    useEffect(() => {
        if (hasReached100 && !isUserContextLoading) {
            const transitionTimeout = setTimeout(() => {
                if (isProfileComplete) {
                    navigateTo('home');
                } else {
                    setShowNameInput(true); 
                }
            }, 400); 

            return () => clearTimeout(transitionTimeout); 
        }
    }, [hasReached100, isUserContextLoading, isProfileComplete, navigateTo]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedName = userName.trim();
        if (trimmedName) {
            completeProfile(trimmedName);
            navigateTo('home');
        }
    };

    const toggleNightMode = () => {
        setIsNightMode(!isNightMode);
    };

    const pageVariants = {
        initial: { opacity: 0, scale: 0.98 },
        in: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: TRANSITION_DURATION_PAGE,
                ease: "easeOut" 
            }
        },
        out: {
            opacity: 0,
            scale: 1.02,
            transition: {
                duration: TRANSITION_DURATION_PAGE * 0.8, 
                ease: "easeIn"
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08, 
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 15, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    const subtleBreath = {
        scale: [1, 1.02, 1],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    };


    const getMascotEmotion = () => {
        if (loadingProgress < 30) return "😌"; 
        if (loadingProgress < 60) return "😊"; 
        if (loadingProgress < 90) return "🎶"; 
        if (loadingProgress < 100) return "😄"; 
        return "✨"; 
    };

    const getBackgroundGradient = () => {
        return isNightMode
            ? "from-indigo-900 via-purple-900 to-slate-900" 
            : "from-sky-100 via-pink-100 to-lavender-100"; 
    };

    return (
        <motion.div
            key="loadingScreen"
            className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden z-50"
            style={{
                height: 'calc(var(--vh, 1vh) * 100)', 
                touchAction: 'none' 
            }}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
        >
            <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${getBackgroundGradient()}`}
                animate={{ opacity: [0.9, 1, 0.9] }} 
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.button
                aria-label={isNightMode ? "Switch to day mode" : "Switch to night mode"}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm text-xl shadow-md"
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleNightMode}
            >
                {isNightMode ? "☀️" : "🌙"}
            </motion.button>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {!isMobile && (
                    <>
                        {/* Books */}
                        <motion.div
                            className="absolute bottom-10 left-16 sm:left-20 text-5xl sm:text-6xl opacity-70"
                            animate={{ y: [0, -5, 0], rotate: [-1, 1, -1] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        >
                            {isNightMode ? "📚" : "📖"}
                        </motion.div>
                        {/* Coffee/Tea Cup */}
                        <motion.div
                            className="absolute bottom-16 right-20 sm:right-24 text-4xl sm:text-5xl opacity-70"
                            animate={{ y: [0, -4, 0], rotate: [2, -2, 2] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        >
                            {isNightMode ? "🍵" : "☕"}
                        </motion.div>
                        {/* Plant */}
                        <motion.div
                            className="absolute top-16 left-24 sm:left-32 text-4xl sm:text-5xl opacity-70"
                            animate={{ y: [0, -3, 0], rotate: [-2, 2, -2] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                            {isNightMode ? "🪴" : "🌵"}
                        </motion.div>
                    </>
                )}

                <motion.div
                    className={`absolute top-[15%] left-[10%] w-28 h-28 sm:w-36 sm:h-36 rounded-full ${isNightMode ? 'bg-purple-700' : 'bg-pink-300'} opacity-15 blur-3xl`}
                    animate={{ scale: [1, 1.15, 1], x: [0, 10, 0], y: [0, -8, 0] }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className={`absolute bottom-[15%] right-[10%] w-32 h-32 sm:w-40 sm:h-40 rounded-full ${isNightMode ? 'bg-indigo-600' : 'bg-sky-200'} opacity-15 blur-3xl`}
                    animate={{ scale: [1.1, 1, 1.1], x: [0, -10, 0], y: [0, 8, 0] }}
                    transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />

                {isNightMode && (
                    <>
                        {[...Array(isMobile ? 8 : 12)].map((_, i) => ( 
                            <motion.div
                                key={`star-${i}`}
                                className="absolute rounded-full bg-white"
                                style={{
                                    width: Math.random() * 2 + 1, 
                                    height: Math.random() * 2 + 1,
                                    left: `${Math.random() * 98}%`, 
                                    top: `${Math.random() * 98}%`,
                                }}
                                animate={{ opacity: [0.1, 0.7, 0.1], scale: [0.8, 1.1, 0.8] }} 
                                transition={{
                                    duration: Math.random() * 4 + 3, 
                                    repeat: Infinity,
                                    delay: Math.random() * 6,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </>
                )}

                {[...Array(isMobile ? 4 : 6)].map((_, i) => (
                    <motion.div
                        key={`float-${i}`}
                        className={`absolute text-lg ${isNightMode ? 'text-purple-300 opacity-60' : 'text-pink-400 opacity-70'}`}
                        style={{
                            left: `${Math.random() * 80 + 10}%`,
                            bottom: `-5%`, 
                        }}
                        initial={{ y: 0, opacity: 0 }}
                        animate={{
                            y: - (window.innerHeight * 0.8), 
                            x: i % 2 === 0 ? [0, 15 + i * 2, -15 - i * 2, 0] : [0, -15 - i * 2, 15 + i * 2, 0], 
                            opacity: [0, 0.7, 0.7, 0],
                            scale: [0.8, 1.1, 1],
                        }}
                        transition={{
                            duration: Math.random() * 6 + 10, 
                            repeat: Infinity,
                            delay: Math.random() * 12, 
                            ease: "linear" 
                        }}
                    >
                        {i % 3 === 0 ? '♪' : i % 3 === 1 ? '♫' : '♡'} 
                    </motion.div>
                ))}
            </div>

            <div className={`relative z-10 flex flex-col items-center justify-center w-11/12 sm:w-96 max-w-lg p-4`}>
                <AnimatePresence mode="wait"> 
                    {!showNameInput ? (
                        <motion.div
                            key="loadingContent"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, transition: { duration: 0.3 } }} 
                            className="flex flex-col items-center text-center" 
                        >
                            {/* Logo */}
                            <motion.div variants={itemVariants} className="mb-6" animate={subtleBreath}>
                                <h1
                                    className={`text-5xl sm:text-6xl font-bold text-transparent bg-clip-text ${isNightMode
                                        ? 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300' 
                                        : 'bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500'
                                        } font-display tracking-tight`} 
                                >
                                    Lofigram
                                </h1>
                                <p className={`text-sm sm:text-base ${isNightMode ? 'text-purple-300 opacity-80' : 'text-purple-500 opacity-90'} mt-1`}>
                                    your Dreamy lo-fi companion
                                </p>
                            </motion.div>

                            {/* Mascot Container - Added subtle scaling */}
                            <motion.div
                                variants={itemVariants}
                                className={`w-48 h-48 sm:w-52 sm:h-52 ${isNightMode ? 'bg-slate-800 bg-opacity-50' : 'bg-white bg-opacity-60'} backdrop-filter backdrop-blur-md rounded-full shadow-lg flex items-center justify-center mb-6 relative overflow-hidden border-2 ${isNightMode ? 'border-purple-600 border-opacity-50' : 'border-pink-200 border-opacity-70'}`}
                                animate={{ scale: [1, 1.01, 1] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <motion.div
                                    className={`absolute w-36 h-36 sm:w-40 sm:h-40 rounded-full ${isNightMode ? 'bg-gray-900' : 'bg-gray-700'} z-0 flex items-center justify-center`}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }} 
                                >
                                    {[...Array(3)].map((_, i) => (
                                        <div
                                            key={`groove-${i}`}
                                            className={`absolute rounded-full border ${isNightMode ? 'border-gray-700 opacity-50' : 'border-gray-500 opacity-50'}`}
                                            style={{ width: `${60 - i * 15}%`, height: `${60 - i * 15}%` }}
                                        />
                                    ))}
                                    <div className={`w-5 h-5 rounded-full ${isNightMode ? 'bg-slate-300' : 'bg-white'}`} />
                                </motion.div>

                                {/* Lo-fi Bunny */}
                                <motion.div
                                    className="relative z-10" 
                                    animate={{ y: [0, -4, 0], rotate: [-1.5, 1.5, -1.5] }} 
                                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <div className="relative w-24 h-24"> 
                                        <div className={`w-20 h-20 rounded-full ${isNightMode ? 'bg-slate-300' : 'bg-white'} absolute bottom-0 left-1/2 transform -translate-x-1/2 shadow-md border ${isNightMode ? 'border-slate-400' : 'border-gray-200'}`}>
                                            <div className="absolute w-3 h-1.5 rounded-full bg-pink-300 opacity-70 left-3 top-11" />
                                            <div className="absolute w-3 h-1.5 rounded-full bg-pink-300 opacity-70 right-3 top-11" />

                                            <motion.div className="absolute w-1.5 h-2.5 bg-gray-800 rounded-full left-5 top-7"
                                                animate={{ scaleY: hasReached100 && !showNameInput ? [1, 0.1, 1] : 1 }}
                                                transition={{ duration: 0.3, delay: 0.5, ease: "easeInOut" }}
                                            />
                                            <motion.div className="absolute w-1.5 h-2.5 bg-gray-800 rounded-full right-5 top-7"
                                                animate={{ scaleY: hasReached100 && !showNameInput ? [1, 0.1, 1] : 1 }}
                                                transition={{ duration: 0.3, delay: 0.55, ease: "easeInOut" }}
                                            />

                                            <div className="absolute text-xs sm:text-sm top-12 left-1/2 transform -translate-x-1/2 text-gray-700">
                                                {getMascotEmotion()}
                                            </div>
                                        </div>
                                        <motion.div className={`absolute w-5 h-14 ${isNightMode ? 'bg-slate-300 border-slate-400' : 'bg-white border-gray-200'} border rounded-full -top-8 left-5 transform -rotate-10 shadow-sm`}
                                            animate={{ rotate: [-12, -8, -12] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
                                        <motion.div className={`absolute w-5 h-14 ${isNightMode ? 'bg-slate-300 border-slate-400' : 'bg-white border-gray-200'} border rounded-full -top-8 right-5 transform rotate-10 shadow-sm`}
                                            animate={{ rotate: [12, 8, 12] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
                                    </div>
                                    <div className="absolute top-3 w-full scale-90"> 
                                        <div className={`absolute h-1 w-20 ${isNightMode ? 'bg-purple-400' : 'bg-pink-400'} left-1/2 transform -translate-x-1/2 top-0 rounded-full`} />
                                        <div className={`absolute w-5 h-6 ${isNightMode ? 'bg-purple-400' : 'bg-pink-400'} rounded -left-1 top-1.5`} />
                                        <div className={`absolute w-5 h-6 ${isNightMode ? 'bg-purple-400' : 'bg-pink-400'} rounded -right-1 top-1.5`} />
                                    </div>
                                </motion.div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="relative w-36 h-36 sm:w-40 sm:h-40 mb-4 flex items-center justify-center">
                                <div className={`absolute inset-0 rounded-full border-4 ${isNightMode ? 'border-gray-700' : 'border-gray-200'} border-opacity-30`} />
                                {/* Progress Arc */}
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                                    <motion.circle
                                        cx="50" cy="50" r="46" 
                                        fill="none"
                                        strokeWidth="5" 
                                        stroke={isNightMode ? "url(#gradientNight)" : "url(#gradientDay)"}
                                        strokeLinecap="round"
                                        strokeDasharray="289.027" 
                                        initial={{ strokeDashoffset: 289.027 }}
                                        animate={{ strokeDashoffset: 289.027 - (289.027 * loadingProgress) / 100 }}
                                        transition={{ duration: 0.3, ease: "linear" }} 
                                        transform="rotate(-90 50 50)"
                                    />
                                    <defs>
                                        <linearGradient id="gradientDay" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#ec4899" /> 
                                            <stop offset="100%" stopColor="#a855f7" /> 
                                        </linearGradient>
                                        <linearGradient id="gradientNight" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#a78bfa" /> 
                                            <stop offset="100%" stopColor="#f472b6" /> 
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <motion.div
                                    className={`text-lg sm:text-xl font-medium ${isNightMode ? 'text-purple-200' : 'text-purple-600'}`}
                                    key={loadingProgress} 
                                    initial={{ opacity: 0.8, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {loadingProgress}%
                                </motion.div>
                            </motion.div>

                            <motion.p
                                variants={itemVariants}
                                key={currentMessage} 
                                className={`text-base sm:text-lg ${isNightMode ? 'text-purple-300 opacity-90' : 'text-purple-600 opacity-90'} font-medium text-center h-6`} // Fixed height to prevent layout shifts
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                {currentMessage}
                            </motion.p>

                        </motion.div>
                    ) : (
                        <motion.form
                            key="nameInputForm"
                            onSubmit={handleSubmit}
                            className={`w-full max-w-sm ${isNightMode ? 'bg-slate-800 bg-opacity-60' : 'bg-white bg-opacity-70'} backdrop-filter backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-xl border ${isNightMode ? 'border-purple-700 border-opacity-40' : 'border-pink-200 border-opacity-60'}`}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }} 
                            transition={{ duration: TRANSITION_DURATION_FORM, ease: "easeOut" }}
                        >
                            <motion.div
                                className="text-center mb-6"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                            >
                                <motion.div
                                    className="text-3xl mb-2 inline-block"
                                    animate={{ rotate: [-5, 5, -5], scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    👋
                                </motion.div>
                                <h2 className={`text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r ${isNightMode ? 'from-pink-300 to-purple-300' : 'from-pink-500 to-purple-600'}`}>
                                    Welcome! What's your name?
                                </h2>
                            </motion.div>

                            <motion.div
                                className="relative mb-6"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                            >
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Your awesome name"
                                    className={`w-full px-5 py-3 rounded-xl ${isNightMode ? 'bg-slate-700 text-purple-200 placeholder-purple-400 border-purple-600' : 'bg-white bg-opacity-90 text-purple-700 placeholder-purple-400 border-purple-200'} border-2 focus:border-pink-400 focus:ring-2 focus:ring-pink-300 focus:outline-none text-center text-lg shadow-sm transition duration-200 ease-in-out`}
                                    autoFocus
                                    aria-label="Your name" 
                                />
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                                type="submit"
                                className={`w-full py-3 px-6 bg-gradient-to-r ${isNightMode ? 'from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500' : 'from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} text-white font-semibold rounded-xl focus:outline-none focus:ring-2 ${isNightMode ? 'focus:ring-indigo-400' : 'focus:ring-rose-300'} focus:ring-offset-2 ${isNightMode ? 'focus:ring-offset-slate-800' : 'focus:ring-offset-white'} shadow-md transition duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group`} // Added group for hover effect
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={!userName.trim()}
                            >
                                <span className="relative z-10">Start Chilling</span>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition duration-300"></div>
                            </motion.button>

                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
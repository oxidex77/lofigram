import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { useApp } from '../../contexts/AppContext';

// Constants for cleaner management
const LOADING_INTERVAL = 180; // ms per progress update step
const MAX_INCREMENT = 4; // Max random increment per step
const MIN_INCREMENT = 1; // Min random increment per step
const MESSAGE_UPDATE_THRESHOLD = 10; // Update message every X percent
const TRANSITION_DURATION_PAGE = 0.6; // Page fade in/out duration
const TRANSITION_DURATION_FORM = 0.4; // Form slide/fade duration

const loadingMessages = [
    "Warming up lo-fi vibes... ☁️", // 0-9%
    "Brewing your cozy beats... ☕", // 10-19%
    "Syncing with chill mode... 🎧", // 20-29%
    "Collecting sleepy tunes... 😴", // 30-39%
    "Assembling kawaii sounds... 🌸", // 40-49%
    "Finding the perfect rhythm... 🎵", // 50-59%
    "Creating your zen space... 🧘‍♀️", // 60-69%
    "Mixing looped melodies... 💿", // 70-79%
    "Preparing study beats... 📚", // 80-89%
    "Ready to drift away... ✨"  // 90-100%
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
    const [hasReached100, setHasReached100] = useState(false); // Track if 100% was hit

    const progressIntervalRef = useRef(null); // Ref to store interval ID

    // --- Effects ---

    // Detect mobile & set initial night mode
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        const hours = new Date().getHours();
        setIsNightMode(hours < 6 || hours >= 18); // Example: 6 PM to 6 AM is night

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Simulate loading progress
    useEffect(() => {
        // Clear any existing interval when component mounts or dependencies change
        clearInterval(progressIntervalRef.current);

        if (loadingProgress < 100) {
            progressIntervalRef.current = setInterval(() => {
                setLoadingProgress(prev => {
                    // Prevent updates if we already artificially hit 100
                    if (prev >= 100) {
                        clearInterval(progressIntervalRef.current);
                        return 100;
                    }

                    const increment = Math.floor(Math.random() * (MAX_INCREMENT - MIN_INCREMENT + 1)) + MIN_INCREMENT;
                    const newProgress = Math.min(prev + increment, 100);

                    // Update message based on progress bands
                    const currentBand = Math.floor(prev / MESSAGE_UPDATE_THRESHOLD);
                    const newBand = Math.floor(newProgress / MESSAGE_UPDATE_THRESHOLD);

                    if (newBand > currentBand && newBand < loadingMessages.length) {
                        // Use requestAnimationFrame for smoother UI updates if needed, but setState is usually fine
                        setCurrentMessage(loadingMessages[newBand]);
                    } else if (newProgress === 100 && currentBand < loadingMessages.length -1) {
                        // Ensure final message shows if jumps over last threshold
                        setCurrentMessage(loadingMessages[loadingMessages.length - 1]);
                    }


                    if (newProgress === 100) {
                        setHasReached100(true); // Mark 100% reached
                        clearInterval(progressIntervalRef.current); // Stop the interval
                    }

                    return newProgress;
                });
            }, LOADING_INTERVAL);
        }

        // Cleanup function to clear interval on unmount or if progress hits 100 early
        return () => clearInterval(progressIntervalRef.current);

    }, [loadingProgress]); // Rerun only if loadingProgress changes

    // Handle transition AFTER loading is complete
    useEffect(() => {
        // Only proceed if progress simulation hit 100% AND user context is no longer loading
        if (hasReached100 && !isUserContextLoading) {
            // Use a short delay to allow the 100% state to render visually if desired
            const transitionTimeout = setTimeout(() => {
                 if (isProfileComplete) {
                    navigateTo('home');
                } else {
                    setShowNameInput(true); // Trigger the name input form animation
                }
            }, 400); // Short delay (adjust as needed) for visual pause at 100%

             return () => clearTimeout(transitionTimeout); // Cleanup timeout
        }
    }, [hasReached100, isUserContextLoading, isProfileComplete, navigateTo]);


    // --- Event Handlers ---

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedName = userName.trim();
        if (trimmedName) {
            completeProfile(trimmedName);
            // Decide where to navigate after profile completion.
            // 'profile' might be okay if it's a quick confirmation screen,
            // otherwise navigate directly to 'home'. Let's assume 'home' for now.
            navigateTo('home');
            // If you have a dedicated 'welcome' or 'profile view' screen, navigate there:
            // navigateTo('profile');
        }
    };

    const toggleNightMode = () => {
        setIsNightMode(!isNightMode);
        // Consider updating the theme in AppContext as well if this toggle should persist
        // E.g., changeTheme(isNightMode ? 'pastel' : 'night');
    };

    // --- Animation Variants ---

    const pageVariants = {
        initial: { opacity: 0, scale: 0.98 },
        in: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: TRANSITION_DURATION_PAGE,
                ease: "easeOut" // Smoother ease-in
            }
        },
        out: {
            opacity: 0,
            scale: 1.02,
            transition: {
                duration: TRANSITION_DURATION_PAGE * 0.8, // Faster fade out
                ease: "easeIn"
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08, // Slightly faster stagger
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

    // Simplified subtle breathing animation
    const subtleBreath = {
        scale: [1, 1.02, 1],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    };

     // --- Helper Functions ---

    const getMascotEmotion = () => {
        if (loadingProgress < 30) return "😌"; // Relaxed
        if (loadingProgress < 60) return "😊"; // Smiling
        if (loadingProgress < 90) return "🎶"; // Music note / humming
        if (loadingProgress < 100) return "😄"; // Happy
        return "✨"; // Complete / Sparkle
    };

    const getBackgroundGradient = () => {
        return isNightMode
            ? "from-indigo-900 via-purple-900 to-slate-900" // Darker night
            : "from-sky-100 via-pink-100 to-lavender-100"; // Softer pastel
    };


    // --- Render ---

    return (
        // Ensure full screen coverage and prevent overflow issues
        <motion.div
            key="loadingScreen" // Add key for AnimatePresence tracking
            className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden min-h-screen z-50" // Higher z-index, min-h-screen
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
        >
            {/* Gradient Background - Animated for subtle shift */}
            <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${getBackgroundGradient()}`}
                animate={{ opacity: [0.9, 1, 0.9] }} // Subtle pulse
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            {/* Toggle Day/Night Mode */}
            <motion.button
                aria-label={isNightMode ? "Switch to day mode" : "Switch to night mode"}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm text-xl shadow-md"
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleNightMode}
            >
                {isNightMode ? "☀️" : "🌙"}
            </motion.button>

             {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Ambient Elements (Consider performance impact) */}
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

                 {/* Soft Animated Blobs (Fewer for performance) */}
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

                {/* Night Mode Stars (Reduced count) */}
                {isNightMode && (
                    <>
                        {[...Array(isMobile ? 8 : 12)].map((_, i) => ( // Fewer stars, especially on mobile
                            <motion.div
                                key={`star-${i}`}
                                className="absolute rounded-full bg-white"
                                style={{
                                    width: Math.random() * 2 + 1, // Smaller stars
                                    height: Math.random() * 2 + 1,
                                    left: `${Math.random() * 98}%`, // Use more of the screen edge
                                    top: `${Math.random() * 98}%`,
                                }}
                                animate={{ opacity: [0.1, 0.7, 0.1], scale: [0.8, 1.1, 0.8] }} // Softer twinkle
                                transition={{
                                    duration: Math.random() * 4 + 3, // Slower twinkle
                                    repeat: Infinity,
                                    delay: Math.random() * 6,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </>
                )}

                 {/* Floating Notes (Reduced count, slower animation) */}
                 {[...Array(isMobile ? 4 : 6)].map((_, i) => (
                     <motion.div
                         key={`float-${i}`}
                         className={`absolute text-lg ${isNightMode ? 'text-purple-300 opacity-60' : 'text-pink-400 opacity-70'}`}
                         style={{
                             left: `${Math.random() * 80 + 10}%`,
                             bottom: `-5%`, // Start below screen
                         }}
                         initial={{ y: 0, opacity: 0 }}
                         animate={{
                             y: - (window.innerHeight * 0.8), // Animate up 80% of screen height
                             x: i % 2 === 0 ? [0, 15+i*2, -15-i*2, 0] : [0, -15-i*2, 15+i*2, 0], // Subtle horizontal drift
                             opacity: [0, 0.7, 0.7, 0],
                             scale: [0.8, 1.1, 1],
                         }}
                         transition={{
                            duration: Math.random() * 6 + 10, // Longer duration (10-16s)
                            repeat: Infinity,
                            delay: Math.random() * 12, // Staggered start times
                            ease: "linear" // Consistent speed
                         }}
                     >
                         {i % 3 === 0 ? '♪' : i % 3 === 1 ? '♫' : '♡'} {/* Use ♡ for heart */}
                    </motion.div>
                 ))}
            </div>


             {/* Content Container */}
             {/* Use padding to prevent content hitting edges on mobile */}
            <div className={`relative z-10 flex flex-col items-center justify-center w-11/12 sm:w-96 max-w-lg p-4`}>
                <AnimatePresence mode="wait"> {/* Use mode='wait' for smoother transition between loading/form */}
                    {!showNameInput ? (
                        <motion.div
                            key="loadingContent"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, transition: { duration: 0.3 } }} // Simple fade out for content
                            className="flex flex-col items-center text-center" // Center text
                        >
                             {/* Logo */}
                            <motion.div variants={itemVariants} className="mb-6" animate={subtleBreath}>
                                <h1
                                    className={`text-5xl sm:text-6xl font-bold text-transparent bg-clip-text ${isNightMode
                                            ? 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300' // Lighter night gradient
                                            : 'bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500'
                                        } font-display tracking-tight`} // Use a display font if available
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
                                {/* Vinyl record (subtler) */}
                                <motion.div
                                    className={`absolute w-36 h-36 sm:w-40 sm:h-40 rounded-full ${isNightMode ? 'bg-gray-900' : 'bg-gray-700'} z-0 flex items-center justify-center`}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }} // Slower spin
                                >
                                    {/* Fewer, fainter grooves */}
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
                                    className="relative z-10" // No fixed size needed, let content dictate
                                    animate={{ y: [0, -4, 0], rotate: [-1.5, 1.5, -1.5] }} // Softer bounce/rotate
                                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    {/* Bunny structure (simplified slightly for clarity) */}
                                    <div className="relative w-24 h-24"> {/* Container for head + ears */}
                                         {/* Head */}
                                         <div className={`w-20 h-20 rounded-full ${isNightMode ? 'bg-slate-300' : 'bg-white'} absolute bottom-0 left-1/2 transform -translate-x-1/2 shadow-md border ${isNightMode ? 'border-slate-400' : 'border-gray-200'}`}>
                                             {/* Blush */}
                                            <div className="absolute w-3 h-1.5 rounded-full bg-pink-300 opacity-70 left-3 top-11" />
                                            <div className="absolute w-3 h-1.5 rounded-full bg-pink-300 opacity-70 right-3 top-11" />

                                             {/* Eyes (Blinking animation tied to progress completion) */}
                                             <motion.div className="absolute w-1.5 h-2.5 bg-gray-800 rounded-full left-5 top-7"
                                                 animate={{ scaleY: hasReached100 && !showNameInput ? [1, 0.1, 1] : 1 }}
                                                 transition={{ duration: 0.3, delay: 0.5, ease: "easeInOut" }}
                                             />
                                             <motion.div className="absolute w-1.5 h-2.5 bg-gray-800 rounded-full right-5 top-7"
                                                 animate={{ scaleY: hasReached100 && !showNameInput ? [1, 0.1, 1] : 1 }}
                                                 transition={{ duration: 0.3, delay: 0.55, ease: "easeInOut" }}
                                             />

                                             {/* Mouth */}
                                            <div className="absolute text-xs sm:text-sm top-12 left-1/2 transform -translate-x-1/2 text-gray-700">
                                                {getMascotEmotion()}
                                            </div>
                                         </div>
                                        {/* Ears */}
                                        <motion.div className={`absolute w-5 h-14 ${isNightMode ? 'bg-slate-300 border-slate-400' : 'bg-white border-gray-200'} border rounded-full -top-8 left-5 transform -rotate-10 shadow-sm`}
                                             animate={{ rotate: [-12, -8, -12] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}/>
                                        <motion.div className={`absolute w-5 h-14 ${isNightMode ? 'bg-slate-300 border-slate-400' : 'bg-white border-gray-200'} border rounded-full -top-8 right-5 transform rotate-10 shadow-sm`}
                                            animate={{ rotate: [12, 8, 12] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}/>
                                    </div>
                                    {/* Headphones */}
                                    <div className="absolute top-3 w-full scale-90"> {/* Slightly smaller */}
                                         <div className={`absolute h-1 w-20 ${isNightMode ? 'bg-purple-400' : 'bg-pink-400'} left-1/2 transform -translate-x-1/2 top-0 rounded-full`} />
                                         <div className={`absolute w-5 h-6 ${isNightMode ? 'bg-purple-400' : 'bg-pink-400'} rounded -left-1 top-1.5`} />
                                         <div className={`absolute w-5 h-6 ${isNightMode ? 'bg-purple-400' : 'bg-pink-400'} rounded -right-1 top-1.5`} />
                                    </div>
                                </motion.div>
                            </motion.div>

                             {/* Progress Ring & Text */}
                             <motion.div variants={itemVariants} className="relative w-36 h-36 sm:w-40 sm:h-40 mb-4 flex items-center justify-center">
                                {/* Background Ring */}
                                <div className={`absolute inset-0 rounded-full border-4 ${isNightMode ? 'border-gray-700' : 'border-gray-200'} border-opacity-30`} />
                                {/* Progress Arc */}
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                                    <motion.circle
                                        cx="50" cy="50" r="46" // Adjust radius to fit border width
                                        fill="none"
                                        strokeWidth="5" // Slightly thicker
                                        stroke={isNightMode ? "url(#gradientNight)" : "url(#gradientDay)"}
                                        strokeLinecap="round"
                                        strokeDasharray="289.027" // 2 * PI * 46
                                        initial={{ strokeDashoffset: 289.027 }}
                                        animate={{ strokeDashoffset: 289.027 - (289.027 * loadingProgress) / 100 }}
                                        transition={{ duration: 0.3, ease: "linear" }} // Smoother transition as progress updates
                                        transform="rotate(-90 50 50)"
                                    />
                                    {/* SVG Gradient Definitions */}
                                    <defs>
                                        <linearGradient id="gradientDay" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#ec4899" /> {/* Pink */}
                                            <stop offset="100%" stopColor="#a855f7" /> {/* Purple */}
                                        </linearGradient>
                                        <linearGradient id="gradientNight" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#a78bfa" /> {/* Lighter Purple */}
                                            <stop offset="100%" stopColor="#f472b6" /> {/* Lighter Pink */}
                                        </linearGradient>
                                    </defs>
                                </svg>
                                {/* Percentage Text */}
                                <motion.div
                                    className={`text-lg sm:text-xl font-medium ${isNightMode ? 'text-purple-200' : 'text-purple-600'}`}
                                    key={loadingProgress} // Animate change
                                    initial={{ opacity: 0.8, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {loadingProgress}%
                                </motion.div>
                            </motion.div>

                             {/* Loading Message */}
                            <motion.p
                                 variants={itemVariants}
                                 key={currentMessage} // Animate message change
                                 className={`text-base sm:text-lg ${isNightMode ? 'text-purple-300 opacity-90' : 'text-purple-600 opacity-90'} font-medium text-center h-6`} // Fixed height to prevent layout shifts
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                {currentMessage}
                            </motion.p>

                        </motion.div>
                    ) : (
                         // --- Name Input Form ---
                        <motion.form
                             key="nameInputForm"
                             onSubmit={handleSubmit}
                             className={`w-full max-w-sm ${isNightMode ? 'bg-slate-800 bg-opacity-60' : 'bg-white bg-opacity-70'} backdrop-filter backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-xl border ${isNightMode ? 'border-purple-700 border-opacity-40' : 'border-pink-200 border-opacity-60'}`}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }} // Exit animation for the form
                            transition={{ duration: TRANSITION_DURATION_FORM, ease: "easeOut" }}
                        >
                             {/* Form Header */}
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

                            {/* Input Field */}
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
                                    aria-label="Your name" // Accessibility
                                />
                                {/* Maybe a subtle input icon if desired */}
                            </motion.div>

                             {/* Submit Button */}
                            <motion.button
                                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                                 type="submit"
                                 className={`w-full py-3 px-6 bg-gradient-to-r ${isNightMode ? 'from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500' : 'from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} text-white font-semibold rounded-xl focus:outline-none focus:ring-2 ${isNightMode ? 'focus:ring-indigo-400' : 'focus:ring-rose-300'} focus:ring-offset-2 ${isNightMode ? 'focus:ring-offset-slate-800' : 'focus:ring-offset-white'} shadow-md transition duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group`} // Added group for hover effect
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={!userName.trim()}
                             >
                                 <span className="relative z-10">Start Chilling</span>
                                 {/* Subtle shimmer on hover */}
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
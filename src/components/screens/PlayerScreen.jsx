import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../../contexts/PlayerContext';
import { useApp } from '../../contexts/AppContext';
import { useUser } from '../../contexts/UserContext';
import { getArtistById, getAlbumById } from '../../../src/mockMusicData';

const PlayerScreen = () => {
  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    currentTime, 
    duration, 
    formatTime, 
    seek,
    next,
    previous,
    volume,
    setVolume
  } = usePlayer();
  
  const { minimizePlayer, theme, changeTheme } = useApp();
  const { isSongLiked, toggleLikeSong } = useUser();
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Theme options
  const themes = [
    { id: 'pastel', name: 'Pastel', emoji: '🌸' },
    { id: 'night', name: 'Night', emoji: '🌙' },
    { id: 'cozy', name: 'Cozy', emoji: '☕' },
    { id: 'dark', name: 'Dark', emoji: '✨' },
  ];

  // Detect mobile devices for optimization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Visualizer elements - reduced for mobile
  const barCount = isMobile ? 5 : 10;
  const [barHeights, setBarHeights] = useState(Array(barCount).fill(20));

  // Update visualizer if playing - optimized for mobile
  useEffect(() => {
    let interval;
    if (isPlaying && showVisualizer) {
      interval = setInterval(() => {
        setBarHeights(Array(barCount).fill(0).map(() => 
          Math.floor(Math.random() * 60) + 20
        ));
      }, isMobile ? 300 : 200); // Slower updates on mobile
    }

    return () => clearInterval(interval);
  }, [isPlaying, showVisualizer, barCount, isMobile]);

  if (!currentSong) {
    minimizePlayer();
    return null;
  }

  const artist = getArtistById(currentSong.artist);
  const album = getAlbumById(currentSong.album);
  const isLiked = isSongLiked(currentSong.id);
  const progress = duration ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e) => {
    const seekPosition = (e.nativeEvent.offsetX / e.target.clientWidth) * duration;
    seek(seekPosition);
  };

  // Get background based on theme
  const getThemeBackground = () => {
    switch (theme) {
      case 'night':
        return "bg-gradient-to-br from-indigo-900 to-purple-900";
      case 'cozy':
        return "bg-gradient-to-br from-amber-100 to-orange-200";
      case 'dark':
        return "bg-gradient-to-br from-gray-900 to-purple-900";
      default:
        return "bg-gradient-to-br from-pink-100 to-purple-200";
    }
  };

  const getThemeTextColor = () => {
    return theme === 'night' || theme === 'dark' ? "text-gray-100" : "text-purple-800";
  };
  
  const getThemeSecondaryColor = () => {
    return theme === 'night' || theme === 'dark' ? "text-gray-300" : "text-purple-600";
  };

  return (
    <motion.div 
      className={`fixed inset-0 ${getThemeBackground()} z-50 flex flex-col h-screen`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header with back button */}
      <div className="relative z-10 p-4 flex justify-between items-center">
        <button 
          className={`p-2 ${theme === 'night' || theme === 'dark' ? 'text-gray-300' : 'text-purple-700'}`}
          onClick={minimizePlayer}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Theme buttons in the header - NO NEED TO SCROLL */}
        <div className="flex space-x-2">
          {themes.map((t) => (
            <motion.button
              key={t.id}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                theme === t.id 
                  ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-md' 
                  : `${theme === 'night' || theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white bg-opacity-50 text-gray-700'}`
              }`}
              whileTap={{ scale: 0.9 }}
              onClick={() => changeTheme(t.id)}
            >
              {t.emoji}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main content container */}
      <div className="flex-1 flex flex-col px-4 justify-between">
        {/* Cover art and song info */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Album Cover */}
          <motion.div
            className="relative mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={currentSong.cover} 
                alt={currentSong.title} 
                className="w-full h-full object-cover"
              />
              
              {/* Overlay for visual effect */}
              <div className={`absolute inset-0 ${theme === 'night' || theme === 'dark' ? 'bg-indigo-900/20' : 'bg-pink-500/10'} rounded-2xl`} />
            </div>

            {/* Floating notes */}
            {isPlaying && (
              <>
                <motion.div 
                  className={`absolute -top-4 -right-4 ${theme === 'night' || theme === 'dark' ? 'text-indigo-400' : 'text-purple-500'} text-xl`}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  ♪
                </motion.div>
                <motion.div 
                  className={`absolute top-1/4 -right-6 ${theme === 'night' || theme === 'dark' ? 'text-violet-400' : 'text-pink-500'} text-2xl`}
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                >
                  ♫
                </motion.div>
                <motion.div 
                  className={`absolute -bottom-2 -left-4 ${theme === 'night' || theme === 'dark' ? 'text-indigo-400' : 'text-purple-500'} text-xl`}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
                >
                  ♩
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Audio Visualizer */}
          {isPlaying && showVisualizer && (
            <div className="flex items-end space-x-1 h-8 mb-3">
              {barHeights.map((height, index) => (
                <motion.div 
                  key={index}
                  className={`w-1 ${theme === 'night' || theme === 'dark' ? 'bg-indigo-400' : 'bg-purple-400'} rounded-full`}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>
          )}

          {/* Song Info */}
          <div className="text-center mb-6">
            <h2 className={`text-2xl font-bold ${getThemeTextColor()}`}>
              {currentSong.title}
            </h2>
            <p className={`${getThemeSecondaryColor()} mt-1`}>
              {artist?.name || 'Unknown Artist'} • {album?.title || 'Unknown Album'}
            </p>
          </div>
        </div>

        {/* Player controls */}
        <div className="pb-8">
          {/* Progress Bar */}
          <div 
            className={`h-1 ${theme === 'night' || theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full mb-2 cursor-pointer`}
            onClick={handleSeek}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          
          {/* Time Display */}
          <div className="flex justify-between text-xs text-gray-600 mb-4">
            <span className={theme === 'night' || theme === 'dark' ? 'text-gray-400' : ''}>{formatTime(currentTime)}</span>
            <span className={theme === 'night' || theme === 'dark' ? 'text-gray-400' : ''}>{formatTime(duration)}</span>
          </div>
          
          {/* Main Controls */}
          <div className="flex justify-between items-center mb-5">
            {/* Like Button */}
            <motion.button
              className="p-2"
              onClick={() => toggleLikeSong(currentSong.id)}
              whileTap={{ scale: 0.9 }}
            >
              {isLiked ? (
                <svg className="w-8 h-8 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </motion.button>
            
            {/* Previous Button */}
            <motion.button
              className={`p-2 ${theme === 'night' || theme === 'dark' ? 'text-gray-300' : 'text-purple-700'}`}
              onClick={previous}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </motion.button>
            
            {/* Play/Pause Button */}
            <motion.button
              className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white flex items-center justify-center shadow-lg"
              onClick={togglePlay}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </motion.button>
            
            {/* Next Button */}
            <motion.button
              className={`p-2 ${theme === 'night' || theme === 'dark' ? 'text-gray-300' : 'text-purple-700'}`}
              onClick={next}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </motion.button>
            
            {/* Toggle Visualizer Button */}
            <motion.button
              className="p-2 text-gray-500"
              onClick={() => setShowVisualizer(!showVisualizer)}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </motion.button>
          </div>
          
          {/* Volume Slider */}
          <div className="flex items-center mb-5">
            <svg className={`w-5 h-5 ${theme === 'night' || theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mr-2`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071a1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className={`w-full h-1 ${theme === 'night' || theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg appearance-none cursor-pointer`}
            />
            <svg className={`w-5 h-5 ${theme === 'night' || theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} ml-2`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071a1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerScreen;
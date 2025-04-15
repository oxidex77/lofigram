// src/components/player/MiniPlayer.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../../contexts/PlayerContext';
import { useApp } from '../../contexts/AppContext';
import { useUser } from '../../contexts/UserContext';
import { getArtistById } from '../../../src/mockMusicData';

const MiniPlayer = () => {
  const { currentSong, isPlaying, togglePlay, currentTime, duration, formatTime } = usePlayer();
  const { maximizePlayer, theme } = useApp();
  const { isSongLiked, toggleLikeSong } = useUser();
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

  if (!currentSong) return null;

  const artist = getArtistById(currentSong.artist);
  const isLiked = isSongLiked(currentSong.id);
  const progress = duration ? (currentTime / duration) * 100 : 0;

  const getBackground = () => {
    if (theme === 'night' || theme === 'dark') return 'bg-gray-900 bg-opacity-90';
    return 'bg-white bg-opacity-90';
  };

  const getTextColor = () => {
    if (theme === 'night' || theme === 'dark') return 'text-purple-300';
    return 'text-purple-800';
  };

  const getSubTextColor = () => {
    if (theme === 'night' || theme === 'dark') return 'text-gray-400';
    return 'text-gray-600';
  };

  return (
    <motion.div 
      className={`fixed bottom-0 left-0 right-0 ${getBackground()} backdrop-filter backdrop-blur-lg shadow-lg z-30 p-2 ${isMobile ? 'pb-4' : 'pb-6'}`}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20 }}
      onClick={maximizePlayer}
    >
      {/* Progress bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${theme === 'night' || theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <motion.div 
          className="h-full bg-gradient-to-r from-pink-400 to-purple-500"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="flex items-center">
        {/* Album cover with larger tap target on mobile */}
        <div className="relative mr-3">
          <motion.div
            className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-lg overflow-hidden shadow-md`}
            whileTap={{ scale: 0.95 }}
          >
            <img 
              src={currentSong.cover} 
              alt={currentSong.title} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {/* Simplified wave animation for mobile */}
            {isPlaying && (
              <div className={`absolute bottom-0 left-0 right-0 ${isMobile ? 'h-2' : 'h-3'} bg-gradient-to-t from-black/50 to-transparent flex justify-center items-end py-0.5`}>
                <div className="flex items-end space-x-0.5">
                  {[...(isMobile ? [1, 2, 3] : [1, 2, 3, 4])].map(i => (
                    <motion.div
                      key={i}
                      className="w-0.5 bg-white rounded-full"
                      animate={{
                        height: [
                          `${20 + Math.sin(i * 0.8) * 10}%`,
                          `${70 + Math.sin(i * 0.8) * 15}%`,
                          `${20 + Math.sin(i * 0.8) * 10}%`
                        ]
                      }}
                      transition={{
                        duration: isMobile ? 1.5 : 1,
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Song info - simplified for mobile */}
        <div className="flex-grow min-w-0">
          <h3 className={`text-sm font-semibold truncate ${getTextColor()}`}>
            {currentSong.title}
          </h3>
          <p className={`text-xs ${getSubTextColor()} truncate`}>
            {artist?.name || 'Unknown Artist'}
          </p>
        </div>

        {/* Controls - more compact layout for mobile */}
        <div className="flex items-center">
          {/* Time on desktop only */}
          {!isMobile && (
            <div className={`text-xs ${getSubTextColor()} mr-2 hidden sm:block`}>
              {formatTime(currentTime)}/{formatTime(duration)}
            </div>
          )}
          
          {/* Like button */}
          <motion.button
            className={isMobile ? "p-1 mx-0.5" : "p-1.5 mx-1"}
            onClick={(e) => {
              e.stopPropagation();
              toggleLikeSong(currentSong.id);
            }}
            whileTap={{ scale: 0.9 }}
          >
            {isLiked ? (
              <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </motion.button>
          
          {/* Play/Pause button - slightly larger on mobile for easier tapping */}
          <motion.button
            className={`${isMobile ? 'w-9 h-9' : 'w-10 h-10'} rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white flex items-center justify-center shadow-md mx-1`}
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </motion.button>
          
          {/* Maximize button for desktop only */}
          {!isMobile && (
            <motion.button
              className="p-1.5 hidden sm:block"
              onClick={maximizePlayer}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MiniPlayer;
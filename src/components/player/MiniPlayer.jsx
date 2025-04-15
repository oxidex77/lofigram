// src/components/player/MiniPlayer.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../../contexts/PlayerContext';
import { useApp } from '../../contexts/AppContext';
import { useUser } from '../../contexts/UserContext';
import { getArtistById } from '../../../src/mockMusicData';
import { musicWave } from '../../animations/animations';

const MiniPlayer = () => {
  const { currentSong, isPlaying, togglePlay, currentTime, duration, formatTime } = usePlayer();
  const { maximizePlayer } = useApp();
  const { isSongLiked, toggleLikeSong } = useUser();

  if (!currentSong) return null;

  const artist = getArtistById(currentSong.artist);
  const isLiked = isSongLiked(currentSong.id);
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-lg z-30 p-3 pb-6"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20 }}
      onClick={maximizePlayer}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
        <motion.div 
          className="h-full bg-gradient-to-r from-pink-400 to-purple-500"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="flex items-center">
        {/* Album cover and music waves animation */}
        <div className="relative mr-3">
          <motion.div
            className="w-12 h-12 rounded-lg overflow-hidden shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            <img 
              src={currentSong.cover} 
              alt={currentSong.title} 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Music wave animation */}
          {isPlaying && (
            <div className="absolute -top-3 left-0 right-0 flex justify-center space-x-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1 bg-purple-500 rounded-full"
                  custom={i * 0.2}
                  variants={musicWave}
                  initial="initial"
                  animate="animate"
                />
              ))}
            </div>
          )}
        </div>

        {/* Song info */}
        <div className="flex-grow min-w-0">
          <h3 className="text-sm font-semibold text-purple-800 truncate">
            {currentSong.title}
          </h3>
          <p className="text-xs text-gray-600 truncate">
            {artist?.name || 'Unknown Artist'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          {/* Time */}
          <div className="text-xs text-gray-500 mr-1 hidden sm:block">
            {formatTime(currentTime)}/{formatTime(duration)}
          </div>
          
          {/* Like button */}
          <motion.button
            className="p-1.5"
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
          
          {/* Play/Pause button */}
          <motion.button
            className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white flex items-center justify-center shadow-md"
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
        </div>
      </div>
    </motion.div>
  );
};

export default MiniPlayer;
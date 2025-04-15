// src/components/common/PlaylistCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { albumCoverHover } from '../../animations/animations';
import { getSongById } from '../../../src/mockMusicData';

const PlaylistCard = ({ playlist, onDelete }) => {
  const handleClick = () => {
    // Future implementation: Navigate to playlist detail view
    console.log(`Playlist clicked: ${playlist.title}`);
  };

  // Get number of songs in the playlist
  const songCount = playlist.songs.length;

  // Get total duration of the playlist
  const getDuration = () => {
    let totalMinutes = 0;
    let totalSeconds = 0;

    playlist.songs.forEach(songId => {
      const song = getSongById(songId);
      if (song) {
        const [minutes, seconds] = song.duration.split(':');
        totalMinutes += parseInt(minutes);
        totalSeconds += parseInt(seconds);
      }
    });

    // Convert excess seconds to minutes
    totalMinutes += Math.floor(totalSeconds / 60);
    totalSeconds = totalSeconds % 60;

    return `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
  };

  return (
    <motion.div 
      className="flex items-center bg-white bg-opacity-60 rounded-xl p-3 mb-3 shadow-sm backdrop-filter backdrop-blur-sm"
      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.07)" }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      {/* Playlist Cover */}
      <motion.div 
        className="w-14 h-14 rounded-lg overflow-hidden shadow-sm mr-3 flex-shrink-0"
        variants={albumCoverHover}
        initial="rest"
        whileHover="hover"
      >
        <img 
          src={playlist.cover} 
          alt={playlist.title} 
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      {/* Playlist Info */}
      <div className="flex-grow min-w-0">
        <h3 className="text-sm font-semibold text-gray-800 truncate">
          {playlist.title}
        </h3>
        <p className="text-xs text-gray-500">
          {songCount} songs • {getDuration()}
        </p>
      </div>
      
      {/* Options Button - Don't propagate click to parent */}
      {onDelete && (
        <motion.button
          className="p-2 text-gray-400 hover:text-red-500"
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(playlist.id);
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </motion.button>
      )}
    </motion.div>
  );
};

export default PlaylistCard;
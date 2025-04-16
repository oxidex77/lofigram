// src/components/common/PlaylistCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import { albumCoverHover } from '../../animations/animations';
import { getSongById } from '../../../src/mockMusicData';

const PlaylistCard = ({ playlist, onDelete }) => {
  const { filterSongsByPlaylist, theme } = useApp();
  
  const handleClick = () => {
    // Add more robust error checking and logging
    if (!playlist) {
      console.error("No playlist provided to PlaylistCard");
      return;
    }
    
    if (!playlist.id) {
      console.error("Playlist has no ID:", playlist);
      return;
    }
    
    // Ensure the playlist ID is valid and passed as a string
    const playlistId = String(playlist.id);
    console.log("Opening playlist:", playlistId, playlist.title);
    
    // Add a small delay to ensure any state updates complete before navigation
    setTimeout(() => {
      filterSongsByPlaylist(playlistId);
    }, 10);
  };

  // Safety check for null playlist
  if (!playlist) {
    console.error("Null playlist provided to PlaylistCard");
    return null;
  }

  // Get number of songs in the playlist (with safety check)
  const songCount = playlist && playlist.songs ? playlist.songs.length : 0;

  // Get total duration of the playlist
  const getDuration = () => {
    if (!playlist || !playlist.songs || !Array.isArray(playlist.songs)) {
      return '0:00'; // Default return if no valid songs
    }
    
    let totalMinutes = 0;
    let totalSeconds = 0;

    playlist.songs.forEach(songId => {
      const song = getSongById(songId);
      if (song && song.duration) {
        const parts = song.duration.split(':');
        if (parts.length === 2) {
          const minutes = parseInt(parts[0]);
          const seconds = parseInt(parts[1]);
          
          if (!isNaN(minutes)) totalMinutes += minutes;
          if (!isNaN(seconds)) totalSeconds += seconds;
        }
      }
    });

    // Convert excess seconds to minutes
    totalMinutes += Math.floor(totalSeconds / 60);
    totalSeconds = totalSeconds % 60;

    return `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
  };

  const getBackground = () => {
    if (theme === 'night' || theme === 'dark') return 'bg-gray-800 bg-opacity-60';
    return 'bg-white bg-opacity-60';
  };

  const getTextColor = () => {
    if (theme === 'night' || theme === 'dark') return 'text-gray-200';
    return 'text-gray-800';
  };

  const getSubTextColor = () => {
    if (theme === 'night' || theme === 'dark') return 'text-gray-400';
    return 'text-gray-500';
  };

  return (
    <motion.div 
      className={`flex items-center ${getBackground()} rounded-xl p-3 mb-3 shadow-sm backdrop-filter backdrop-blur-sm`}
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
          src={playlist?.cover || '/assets/album-covers/playlist.jpeg'} // Default cover image
          alt={playlist?.title || 'Playlist'} 
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      {/* Playlist Info */}
      <div className="flex-grow min-w-0">
        <h3 className={`text-sm font-semibold ${getTextColor()} truncate`}>
          {playlist?.title || 'Untitled Playlist'}
        </h3>
        <p className={`text-xs ${getSubTextColor()}`}>
          {songCount} songs • {getDuration()}
        </p>
      </div>
      
      {/* Options Button - Don't propagate click to parent */}
      {onDelete && (
        <motion.button
          className={`p-2 ${getSubTextColor()} hover:text-red-500`}
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
// src/components/PlaylistDrawer.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { usePlayerContext } from '../contexts/PlayerContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { playlists } from '../mockMusicData';

const PlaylistDrawer = ({ onClose }) => {
  const { playPlaylist, currentPlaylist, userPlaylists } = usePlayerContext();
  const { themeColors } = useThemeContext();
  
  // Combine default playlists and user playlists
  const allPlaylists = [...playlists, ...userPlaylists];
  
  const handlePlaylistClick = (playlistId) => {
    playPlaylist(playlistId);
  };
  
  return (
    <motion.div 
      className="playlist-drawer"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        borderTop: `2px solid ${themeColors.primary}`
      }}
    >
      <div className="playlist-header">
        <h3>Playlists</h3>
        <motion.button 
          onClick={onClose}
          whileTap={{ scale: 0.9 }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </motion.button>
      </div>
      
      <div className="playlist-list">
        {allPlaylists.map((playlist) => (
          <motion.div 
            key={playlist.id} 
            className={`playlist-item ${currentPlaylist === playlist.id ? 'active' : ''}`} 
            onClick={() => handlePlaylistClick(playlist.id)}
            whileHover={{ 
              scale: 1.02, 
              backgroundColor: `rgba(${playlist.id.startsWith('user-') ? '255, 183, 213, 0.1' : '184, 224, 255, 0.1'})` 
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="playlist-cover">
              <img src={playlist.coverArt} alt={playlist.title} />
              {currentPlaylist === playlist.id && (
                <div className="now-playing-indicator">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="playlist-info">
              <h4>{playlist.title}</h4>
              <p>{playlist.description}</p>
              {playlist.id.startsWith('user-') && (
                <span className="user-playlist-badge">My Playlist</span>
              )}
            </div>
          </motion.div>
        ))}
        
        {allPlaylists.length === 0 && (
          <div className="empty-playlists">
            <p>No playlists yet! Create one in the playlist editor.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PlaylistDrawer;
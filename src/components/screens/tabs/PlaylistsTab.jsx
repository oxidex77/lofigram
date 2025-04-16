// src/components/screens/tabs/PlaylistsTab.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../../contexts/UserContext';
import { useApp } from '../../../contexts/AppContext';
import PlaylistCard from '../../common/PlaylistCard';
import { staggerContainer, staggerItem } from '../../../animations/animations';

const PlaylistsTab = () => {
  const { userPlaylists, createPlaylist, deletePlaylist } = useUser();
  const { theme } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setShowCreateModal(false);
    }
  };

  const handleDeletePlaylist = (playlistId) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      deletePlaylist(playlistId);
    }
  };

  const getBackground = () => {
    if (theme === 'night' || theme === 'dark') return 'bg-gray-800 bg-opacity-60';
    return 'bg-white bg-opacity-60';
  };

  const getTextColor = () => {
    if (theme === 'night' || theme === 'dark') return 'text-gray-200';
    return 'text-purple-800';
  };

  const getSubTextColor = () => {
    if (theme === 'night' || theme === 'dark') return 'text-gray-400';
    return 'text-gray-600';
  };

  return (
    <motion.div 
      className="px-4 py-2" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-bold ${getTextColor()}`}>
          Your Playlists
        </h2>
        
        {/* Create Playlist Button (Visible instead of FAB) */}
        <motion.button
          className={`px-3 py-1.5 text-sm rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-sm flex items-center`}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create
        </motion.button>
      </div>
      
      {/* Show message if no playlists */}
      {userPlaylists.length === 0 && (
        <motion.div 
          className={`flex flex-col items-center justify-center py-10 px-4 ${getBackground()} rounded-xl mb-4`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="text-6xl mb-4">🎵</div>
          <h3 className={`text-lg font-medium ${theme === 'night' || theme === 'dark' ? 'text-purple-300' : 'text-purple-700'} mb-2 text-center`}>
            No playlists yet
          </h3>
          <p className={`text-sm ${getSubTextColor()} text-center`}>
            Create your first playlist to organize your favorite songs!
          </p>
        </motion.div>
      )}
      
      {/* List of playlists */}
      <div className="mb-20"> {/* Added mb-20 to ensure content isn't cut off */}
        <motion.div
          className="space-y-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {userPlaylists.map(playlist => (
            <motion.div key={playlist.id} variants={staggerItem}>
              <PlaylistCard 
                playlist={playlist} 
                onDelete={handleDeletePlaylist} 
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Create Playlist Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
            />
            
            <motion.div
              className={`fixed top-1/3 left-0 right-0 mx-auto p-6 rounded-xl ${theme === 'night' || theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-xl z-50 max-w-md`}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <h3 className={`text-xl font-bold ${getTextColor()} mb-4`}>
                Create New Playlist
              </h3>
              
              <form onSubmit={handleCreatePlaylist}>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Playlist name"
                  className={`w-full px-4 py-3 rounded-xl ${theme === 'night' || theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-purple-50 border-purple-200 text-purple-700'} border focus:border-purple-500 focus:outline-none placeholder-purple-300 mb-4`}
                  autoFocus
                />
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    className={`flex-1 py-3 px-6 ${theme === 'night' || theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} font-medium rounded-xl hover:bg-opacity-90 focus:outline-none`}
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 focus:outline-none shadow-md"
                    disabled={!newPlaylistName.trim()}
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PlaylistsTab;
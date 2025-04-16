// src/components/screens/tabs/PlaylistsTab.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../../contexts/UserContext';
import { useApp } from '../../../contexts/AppContext';
import PlaylistCard from '../../common/PlaylistCard';
import { staggerContainer, staggerItem } from '../../../animations/animations';

const PlaylistsTab = () => {
  const { userPlaylists, createPlaylist, deletePlaylist, lastCreatedPlaylist } = useUser();
  const { theme } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreationFeedback, setShowCreationFeedback] = useState(false);
  const [createdPlaylistInfo, setCreatedPlaylistInfo] = useState(null);
  
  // Handle showing creation feedback when a new playlist is created
  useEffect(() => {
    if (lastCreatedPlaylist && lastCreatedPlaylist.timestamp) {
      // Only show feedback for playlists created in the last 2 seconds
      const timeSinceCreation = Date.now() - lastCreatedPlaylist.timestamp;
      if (timeSinceCreation < 2000) {
        setCreatedPlaylistInfo(lastCreatedPlaylist);
        setShowCreationFeedback(true);
        
        // Hide the feedback after 3 seconds
        const timer = setTimeout(() => {
          setShowCreationFeedback(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [lastCreatedPlaylist, userPlaylists]);

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

  const getHighlightColor = () => {
    if (theme === 'night' || theme === 'dark') return 'bg-purple-700 bg-opacity-40';
    return 'bg-purple-200 bg-opacity-60';
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
        
        {/* Create Playlist Button */}
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
      
      {/* Creation feedback animation */}
      <AnimatePresence>
        {showCreationFeedback && createdPlaylistInfo && (
          <motion.div
            className={`mb-4 rounded-lg p-4 ${getHighlightColor()} flex items-center`}
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="mr-3 bg-gradient-to-r from-pink-400 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className={`font-medium ${getTextColor()}`}>Playlist Created!</h3>
              <p className={`text-sm ${getSubTextColor()}`}>
                "{createdPlaylistInfo.title}" has been added to your playlists
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
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
          {userPlaylists.map(playlist => {
            // Check if this is the newly created playlist
            const isNewlyCreated = lastCreatedPlaylist && 
                                  lastCreatedPlaylist.id === playlist.id && 
                                  Date.now() - lastCreatedPlaylist.timestamp < 2000;
            
            return (
              <motion.div 
                key={playlist.id} 
                variants={staggerItem}
                className={isNewlyCreated ? 'relative' : ''}
              >
                {/* Highlight effect for newly created playlist */}
                {isNewlyCreated && (
                  <motion.div 
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400 to-purple-500"
                    initial={{ opacity: 0.7, scale: 1.05 }}
                    animate={{ opacity: 0, scale: 1.15 }}
                    transition={{ duration: 1.5 }}
                  />
                )}
                
                <PlaylistCard 
                  playlist={playlist} 
                  onDelete={handleDeletePlaylist} 
                />
              </motion.div>
            );
          })}
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
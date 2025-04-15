// src/components/screens/tabs/PlaylistsTab.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../../contexts/UserContext';
import PlaylistCard from '../../common/PlaylistCard';
import { staggerContainer, staggerItem, modalAnimation, backdropAnimation } from '../../../animations/animations';

const PlaylistsTab = () => {
  const { userPlaylists, createPlaylist, deletePlaylist } = useUser();
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

  return (
    <motion.div 
      className="px-4 py-2 pb-24" // Extra padding at bottom for FAB
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-purple-800">
          Your Playlists
        </h2>
      </div>
      
      {userPlaylists.length > 0 ? (
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
      ) : (
        <motion.div 
          className="flex flex-col items-center justify-center py-10 px-4 bg-white bg-opacity-50 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-lg font-medium text-purple-700 mb-2 text-center">
            No playlists yet
          </h3>
          <p className="text-sm text-gray-600 text-center">
            Create your first playlist to organize your favorite songs!
          </p>
        </motion.div>
      )}

      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg flex items-center justify-center"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05, boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)" }}
        onClick={() => setShowCreateModal(true)}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </motion.button>

      {/* Create Playlist Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
              variants={backdropAnimation}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setShowCreateModal(false)}
            />
            
            <motion.div
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50"
              variants={modalAnimation}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h3 className="text-xl font-bold text-purple-800 mb-4">
                Create New Playlist
              </h3>
              
              <form onSubmit={handleCreatePlaylist}>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Playlist name"
                  className="w-full px-4 py-3 rounded-xl bg-purple-50 border border-purple-200 focus:border-purple-500 focus:outline-none text-purple-700 placeholder-purple-300 mb-4"
                  autoFocus
                />
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 focus:outline-none"
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
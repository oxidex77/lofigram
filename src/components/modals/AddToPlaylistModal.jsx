// src/components/modals/AddToPlaylistModal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { useApp } from '../../contexts/AppContext';
import { getSongById } from '../../../src/mockMusicData';
import { modalAnimation, backdropAnimation } from '../../animations/animations';

const AddToPlaylistModal = () => {
  const { userPlaylists, addSongToPlaylist, createPlaylist } = useUser();
  const { togglePlaylistModal, selectedPlaylistForAdd } = useApp();
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  
  const song = getSongById(selectedPlaylistForAdd);
  
  if (!song) {
    // If no song is selected, close the modal
    togglePlaylistModal();
    return null;
  }

  const handleAddToPlaylist = (playlistId) => {
    addSongToPlaylist(playlistId, song.id);
    togglePlaylistModal();
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const playlistId = createPlaylist(newPlaylistName.trim());
      addSongToPlaylist(playlistId, song.id);
      togglePlaylistModal();
    }
  };

  return (
    <>
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
        variants={backdropAnimation}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={() => togglePlaylistModal()}
      />
      
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 max-h-[70vh] overflow-y-auto"
        variants={modalAnimation}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-purple-800">
            Add to Playlist
          </h3>
          <button 
            className="p-2 text-gray-500 hover:text-gray-700"
            onClick={() => togglePlaylistModal()}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-14 h-14 rounded-lg overflow-hidden shadow-md flex-shrink-0">
            <img 
              src={song.cover} 
              alt={song.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-medium text-gray-800">{song.title}</h4>
            <p className="text-sm text-gray-500">Select a playlist below</p>
          </div>
        </div>
        
        {!showCreateInput ? (
          <>
            <div className="space-y-2 mb-5">
              {userPlaylists.map(playlist => (
                <motion.button
                  key={playlist.id}
                  className="flex items-center w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAddToPlaylist(playlist.id)}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden shadow-sm mr-3 flex-shrink-0">
                    <img 
                      src={playlist.cover} 
                      alt={playlist.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <h5 className="font-medium text-gray-800">{playlist.title}</h5>
                    <p className="text-xs text-gray-500">{playlist.songs.length} songs</p>
                  </div>
                </motion.button>
              ))}
            </div>
            
            <motion.button
              className="w-full py-3 px-4 bg-white border-2 border-dashed border-purple-300 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors flex items-center justify-center"
              onClick={() => setShowCreateInput(true)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Playlist
            </motion.button>
          </>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist name"
              className="w-full px-4 py-3 rounded-xl bg-purple-50 border border-purple-200 focus:border-purple-500 focus:outline-none text-purple-700 placeholder-purple-300"
              autoFocus
            />
            
            <div className="flex space-x-2">
              <motion.button
                className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                onClick={() => setShowCreateInput(false)}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              
              <motion.button
                className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-xl hover:opacity-90 transition-colors"
                onClick={handleCreatePlaylist}
                whileTap={{ scale: 0.98 }}
                disabled={!newPlaylistName.trim()}
              >
                Create & Add
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default AddToPlaylistModal;
// src/components/modals/AddToPlaylistModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { useApp } from '../../contexts/AppContext';
import { getSongById } from '../../../src/mockMusicData';
import { modalAnimation, backdropAnimation } from '../../animations/animations';

const AddToPlaylistModal = () => {
  const { userPlaylists, addSongToPlaylist, createPlaylist } = useUser();
  const { togglePlaylistModal, selectedPlaylistForAdd, theme } = useApp();
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [playlistCreated, setPlaylistCreated] = useState(false);
  const [playlistAddedTo, setPlaylistAddedTo] = useState(null);
  
  // Detect mobile for optimized positioning
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const song = getSongById(selectedPlaylistForAdd);
  
  // Return early if no song is selected to prevent errors
  if (!song) {
    return null;
  }

  const handleAddToPlaylist = (playlistId) => {
    if (!playlistId) return;
    
    addSongToPlaylist(playlistId, song.id);
    
    // Show feedback that song was added
    setPlaylistAddedTo(userPlaylists.find(p => p.id === playlistId)?.title || 'Playlist');
    
    // Close modal after short delay to show feedback
    setTimeout(() => {
      togglePlaylistModal(null);
    }, 1000);
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const playlistId = createPlaylist(newPlaylistName.trim());
      addSongToPlaylist(playlistId, song.id);
      
      // Show creation feedback
      setPlaylistCreated(true);
      
      // Close modal after feedback
      setTimeout(() => {
        togglePlaylistModal(null);
      }, 1500);
    }
  };

  // Adjust positioning for mobile to prevent keyboard issues
  const getModalPosition = () => {
    if (showCreateInput && isMobile) {
      return "fixed top-1/4 left-0 right-0 max-h-[60vh]";
    }
    return "fixed bottom-0 left-0 right-0 max-h-[70vh]";
  };

  // Get theme-appropriate styling
  const getBackground = () => {
    if (theme === 'night' || theme === 'dark') return 'bg-gray-900';
    return 'bg-white';
  };

  const getTextColor = () => {
    if (theme === 'night' || theme === 'dark') return 'text-gray-200';
    return 'text-gray-800';
  };

  const getSubTextColor = () => {
    if (theme === 'night' || theme === 'dark') return 'text-gray-400';
    return 'text-gray-500';
  };

  const getInputBackground = () => {
    if (theme === 'night' || theme === 'dark') return 'bg-gray-800 border-gray-700';
    return 'bg-purple-50 border-purple-200';
  };

  return (
    <>
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
        variants={backdropAnimation}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={() => togglePlaylistModal(null)}
      />
      
      <motion.div
        className={`${getModalPosition()} ${getBackground()} rounded-t-3xl p-6 z-50 overflow-y-auto`}
        variants={modalAnimation}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <AnimatePresence mode="wait">
          {playlistCreated ? (
            <motion.div
              key="success"
              className="flex flex-col items-center justify-center py-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h3 className={`text-xl font-bold ${getTextColor()} mb-2 text-center`}>
                Playlist Created!
              </h3>
              <p className={`text-sm ${getSubTextColor()} text-center`}>
                "{newPlaylistName}" has been created and song added
              </p>
            </motion.div>
          ) : playlistAddedTo ? (
            <motion.div
              key="added"
              className="flex flex-col items-center justify-center py-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h3 className={`text-xl font-bold ${getTextColor()} mb-2 text-center`}>
                Song Added!
              </h3>
              <p className={`text-sm ${getSubTextColor()} text-center`}>
                Added to "{playlistAddedTo}"
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="main"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-bold ${getTextColor()}`}>
                  Add to Playlist
                </h3>
                <button 
                  className={`p-2 ${getSubTextColor()} hover:opacity-70`}
                  onClick={() => togglePlaylistModal(null)}
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
                  <h4 className={`font-medium ${getTextColor()}`}>{song.title}</h4>
                  <p className={`text-sm ${getSubTextColor()}`}>Select a playlist below</p>
                </div>
              </div>
              
              {!showCreateInput ? (
                <>
                  <div className="space-y-2 mb-5">
                    {userPlaylists.map(playlist => (
                      <motion.button
                        key={playlist.id}
                        className={`flex items-center w-full p-3 ${
                          theme === 'night' || theme === 'dark' 
                            ? 'bg-gray-800 hover:bg-gray-700' 
                            : 'bg-purple-50 hover:bg-purple-100'
                        } rounded-xl transition-colors`}
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
                          <h5 className={`font-medium ${getTextColor()}`}>{playlist.title}</h5>
                          <p className={`text-xs ${getSubTextColor()}`}>{playlist.songs.length} songs</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  
                  <motion.button
                    className={`w-full py-3 px-4 ${
                      theme === 'night' || theme === 'dark'
                        ? 'bg-gray-800 border-2 border-dashed border-gray-700 text-purple-400'
                        : 'bg-white border-2 border-dashed border-purple-300 text-purple-600'
                    } rounded-xl hover:opacity-80 transition-colors flex items-center justify-center`}
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
                    className={`w-full px-4 py-3 rounded-xl ${getInputBackground()} focus:border-purple-500 focus:outline-none ${getTextColor()} placeholder-purple-300 mb-4`}
                    autoFocus
                  />
                  
                  <div className="flex space-x-2">
                    <motion.button
                      className={`flex-1 py-3 px-4 ${
                        theme === 'night' || theme === 'dark'
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-200 text-gray-700'
                      } rounded-xl hover:opacity-80 transition-colors`}
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
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default AddToPlaylistModal;
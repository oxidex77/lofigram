import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { useApp } from '../../contexts/AppContext';
import { getSongById } from '../../../src/mockMusicData'; 
import { modalAnimation, backdropAnimation } from '../../animations/animations'; 
import { FaCheck, FaMusic, FaHeart, FaPlus, FaTimes, FaSpinner } from 'react-icons/fa'; 

const AddToPlaylistModal = () => {
  const { userPlaylists, addSongToPlaylist, createPlaylist } = useUser();
  const { togglePlaylistModal, selectedPlaylistForAdd, theme } = useApp();
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [feedbackState, setFeedbackState] = useState(null); 
  const [feedbackData, setFeedbackData] = useState({ name: '', songTitle: '' }); 

  const inputRef = useRef(null); 

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (showCreateInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCreateInput]);

  const song = getSongById(selectedPlaylistForAdd);

  useEffect(() => {
      if (!song && feedbackState !== 'creating') {
          togglePlaylistModal(null);
      }
  }, [song]);


  if (!song && !feedbackState) { 
    return null;
  }


  const handleAddToPlaylist = async (playlistId) => {
    if (!playlistId || !song) return;
    const playlist = userPlaylists.find(p => p.id === playlistId);
    if (!playlist) return;

    try {
      await addSongToPlaylist(playlistId, song.id);

      setFeedbackData({ name: playlist.title, songTitle: song.title });
      setFeedbackState('added');

      setTimeout(() => {
        togglePlaylistModal(null);
        setTimeout(() => setFeedbackState(null), 500);
      }, 1800); 
    } catch (error) {
      console.error("Failed to add song:", error);
    }
  };

  const handleCreatePlaylist = async () => {
    const name = newPlaylistName.trim();
    if (!name || !song || feedbackState === 'creating') return;

    setFeedbackState('creating');
    setFeedbackData({ name: name, songTitle: song.title }); 

    try {
      const playlistId = await createPlaylist(name);

      if (playlistId) {
        await addSongToPlaylist(playlistId, song.id);
      } else {
        throw new Error("Playlist creation did not return an ID.");
      }

      setNewPlaylistName(''); 
      setFeedbackState('created');

      setTimeout(() => {
        togglePlaylistModal(null);
        setTimeout(() => setFeedbackState(null), 500);
      }, 2200); // Slightly longer for create feedback

    } catch (error) {
      console.error("Failed to create playlist and add song:", error);
      setFeedbackState(null); 
      setShowCreateInput(true); 
    }
  };

  const handleCancelCreate = () => {
      setShowCreateInput(false);
      setNewPlaylistName(''); 
  }

  const handleCloseModal = () => {
      if (feedbackState !== 'creating') {
          togglePlaylistModal(null);
          setTimeout(() => setFeedbackState(null), 500);
      }
  }


  const getModalPosition = () => {
    if (showCreateInput && isMobile) {
      return "fixed bottom-0 sm:bottom-auto sm:top-1/3 left-0 right-0 max-h-[70vh] sm:max-h-[60vh]";
    }
    return "fixed bottom-0 left-0 right-0 max-h-[75vh] sm:max-h-[70vh]"; 
  };

  const getBackground = () => {
    if (theme === 'night' || theme === 'dark') return 'bg-gradient-to-b from-gray-800 to-gray-900 border-t border-gray-700';
    return 'bg-gradient-to-b from-white to-purple-50 border-t border-gray-200';
  };

  const getTextColor = (intensity = 'high') => {
      if (theme === 'night' || theme === 'dark') {
          return intensity === 'high' ? 'text-gray-100' : 'text-gray-300';
      }
      return intensity === 'high' ? 'text-gray-800' : 'text-gray-600';
  };

  const getSubTextColor = () => {
      if (theme === 'night' || theme === 'dark') return 'text-gray-400';
      return 'text-gray-500';
  };

  const getInputBackground = () => {
      if (theme === 'night' || theme === 'dark') return 'bg-gray-700 border-gray-600 focus:border-purple-400 focus:ring-purple-400/30';
      return 'bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-300/40';
  };

  const getButtonBackground = (type = 'default') => {
      if (theme === 'night' || theme === 'dark') {
          return type === 'primary'
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
              : type === 'secondary'
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'; 
      } else {
          return type === 'primary'
              ? 'bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white'
              : type === 'secondary'
              ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              : 'bg-purple-50 hover:bg-purple-100 border border-transparent'; 
      }
  };

  const getCreateButtonStyle = () => {
      if (theme === 'night' || theme === 'dark') {
          return 'bg-transparent border-2 border-dashed border-gray-600 text-purple-400 hover:border-purple-400 hover:bg-gray-800/50';
      } else {
          return 'bg-white border-2 border-dashed border-purple-300 text-purple-600 hover:border-purple-400 hover:bg-purple-50/50';
      }
  }

  const renderFeedbackContent = () => {
    switch (feedbackState) {
      case 'creating':
        return (
          <motion.div
            key="creating"
            className="flex flex-col items-center justify-center py-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mb-4"
            >
                <FaSpinner className={`w-10 h-10 ${getTextColor('low')}`}/>
            </motion.div>
            <h3 className={`text-lg font-semibold ${getTextColor()} mb-1`}>Creating Playlist...</h3>
            <p className={`${getSubTextColor()} text-sm`}>Adding "{feedbackData.songTitle}" to "{feedbackData.name}"</p>
          </motion.div>
        );
      case 'created':
        return (
          <motion.div
            key="created"
            className="flex flex-col items-center justify-center py-10 text-center"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: [0.17, 0.67, 0.83, 0.67] }} 
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mb-4 shadow-lg"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 10, delay: 0.1 }}
            >
              <FaMusic className="w-7 h-7 text-white" />
            </motion.div>
            <h3 className={`text-xl font-bold ${getTextColor()} mb-1`}>Playlist Created!</h3>
            <p className={`${getSubTextColor()} text-sm`}>"{feedbackData.songTitle}" added to "{feedbackData.name}"</p>
          </motion.div>
        );
      case 'added':
        return (
          <motion.div
            key="added"
            className="flex flex-col items-center justify-center py-10 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center mb-4 shadow-md"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 12 }}
            >
              <FaCheck className="w-7 h-7 text-white" />
            </motion.div>
            <h3 className={`text-xl font-bold ${getTextColor()} mb-1`}>Song Added!</h3>
            <p className={`${getSubTextColor()} text-sm`}>Added "{feedbackData.songTitle}" to "{feedbackData.name}"</p>
          </motion.div>
        );
      default:
        return null;
    }
  };

  const renderMainContent = () => (
      <motion.div
        key="main"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }} // 
        transition={{ duration: 0.2 }}
      >
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className={`text-xl font-bold ${getTextColor()}`}>
            Add to Playlist
          </h3>
          <button
            className={`p-1.5 rounded-full ${getSubTextColor()} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
            onClick={handleCloseModal}
            aria-label="Close modal"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Song Info */}
        {song && (
          <div className="flex items-center space-x-3 mb-5 px-1">
            <div className="w-14 h-14 rounded-lg overflow-hidden shadow-md flex-shrink-0 border border-black/10">
              <img
                src={song.cover}
                alt={song.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className={`font-medium ${getTextColor()}`}>{song.title}</h4>
              <p className={`text-sm ${getSubTextColor()}`}>Select or create a playlist</p>
            </div>
          </div>
        )}


        {/* Playlist List OR Create Input */}
        <div className="max-h-[40vh] overflow-y-auto pr-1 space-y-2 mb-5 custom-scrollbar">
          {!showCreateInput ? (
            <>
              {userPlaylists.map(playlist => (
                <motion.button
                  key={playlist.id}
                  layout 
                  className={`flex items-center w-full p-3 ${getButtonBackground('default')} rounded-xl transition-colors`}
                  whileTap={{ scale: 0.98, backgroundColor: theme === 'night' || theme === 'dark' ? '#4B5563' : '#E5E7EB' }} 
                  onClick={() => handleAddToPlaylist(playlist.id)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: (userPlaylists.indexOf(playlist) * 0.05) }} 
                >
                   {/* Playlist Cover/Icon */}
                   <div className={`w-10 h-10 rounded-lg overflow-hidden shadow-sm mr-3 flex-shrink-0 flex items-center justify-center ${theme === 'night' || theme === 'dark' ? 'bg-gray-700' : 'bg-purple-100'}`}>
                       {playlist.cover ? (
                           <img
                               src={playlist.cover}
                               alt={playlist.title}
                               className="w-full h-full object-cover"
                           />
                       ) : (
                           <FaMusic className={`w-5 h-5 ${getSubTextColor()}`}/> 
                       )}
                  </div>
                  <div className="text-left overflow-hidden">
                    <h5 className={`font-medium truncate ${getTextColor()}`}>{playlist.title}</h5>
                    <p className={`text-xs ${getSubTextColor()}`}>{playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}</p>
                  </div>
                  <FaPlus className={`ml-auto w-4 h-4 ${getSubTextColor()} opacity-50`} />
                </motion.button>
              ))}

              {/* Create New Button */}
              <motion.button
                layout
                className={`w-full mt-3 py-3 px-4 ${getCreateButtonStyle()} rounded-xl transition-all duration-150 flex items-center justify-center`}
                onClick={() => setShowCreateInput(true)}
                whileHover={{ scale: 1.02, y: -1, borderColor: theme === 'night' || theme === 'dark' ? '#a78bfa' : '#c084fc' }} // Subtle hover lift + color change
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (userPlaylists.length * 0.05) + 0.1 }}
              >
                <FaPlus className="w-4 h-4 mr-2" />
                Create New Playlist
              </motion.button>
            </>
          ) : (
            <motion.div
                key="createInput"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-3 pt-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Enter playlist name..."
                className={`w-full px-4 py-3 rounded-xl border-2 ${getInputBackground()} focus:outline-none focus:ring-2 ${getTextColor()} placeholder-purple-400/70 dark:placeholder-gray-500 transition duration-150 ease-in-out`}
                maxLength={50} 
              />

              <div className="flex space-x-2">
                <motion.button
                  className={`flex-1 py-3 px-4 ${getButtonBackground('secondary')} rounded-xl transition-colors font-medium`}
                  onClick={handleCancelCreate}
                  whileTap={{ scale: 0.97 }}
                >
                  Cancel
                </motion.button>

                <motion.button
                  className={`flex-1 py-3 px-4 ${getButtonBackground('primary')} rounded-xl transition-opacity font-medium disabled:opacity-60 disabled:cursor-not-allowed`}
                  onClick={handleCreatePlaylist}
                  whileTap={{ scale: 0.97 }}
                  disabled={!newPlaylistName.trim() || feedbackState === 'creating'}
                >
                  {feedbackState === 'creating' ? (
                     <FaSpinner className="animate-spin h-5 w-5 mx-auto" />
                  ) : (
                    "Create & Add"
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
  );


  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40" 
        variants={backdropAnimation}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={handleCloseModal} 
      />

      <motion.div
        className={`shadow-2xl ${getModalPosition()} ${getBackground()} rounded-t-3xl p-5 z-50 flex flex-col`} 
        variants={modalAnimation}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title" 
      >
          <AnimatePresence mode="wait">
              {feedbackState ? renderFeedbackContent() : renderMainContent()}
          </AnimatePresence>

      </motion.div>
    </>
  );
};

export default AddToPlaylistModal;



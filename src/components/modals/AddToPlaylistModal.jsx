import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { useApp } from '../../contexts/AppContext';
import { getSongById } from '../../../src/mockMusicData';
import { FaCheck, FaMusic, FaPlus, FaTimes, FaSpinner } from 'react-icons/fa';

const AddToPlaylistModal = () => {
  const { userPlaylists, addSongToPlaylist, createPlaylist } = useUser();
  const { togglePlaylistModal, selectedPlaylistForAdd, theme } = useApp();
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [feedbackState, setFeedbackState] = useState(null);
  const [feedbackData, setFeedbackData] = useState({ name: '', songTitle: '' });
  const [isVisible, setIsVisible] = useState(false);

  const inputRef = useRef(null);
  const shouldCloseRef = useRef(false);
  const songRef = useRef(null);
  const resizeTimeoutRef = useRef(null);
  const menuLockRef = useRef(false);
  const modalClosingRef = useRef(false);
  const globalMenuStateRef = useRef(true); // Tracks if menu system is available
  const modalRef = useRef(null); // Reference for the modal element

  // Memoize checking if on mobile - optimize with cache
  const checkMobile = useMemo(() => {
    let lastResult = null;
    let lastWidth = 0;

    return () => {
      const currentWidth = window.innerWidth;
      if (lastWidth === currentWidth) return lastResult;

      lastWidth = currentWidth;
      lastResult = currentWidth < 768;
      return lastResult;
    };
  }, []);

  // Get song info only once and store in ref to prevent re-renders
  useEffect(() => {
    if (selectedPlaylistForAdd) {
      songRef.current = getSongById(selectedPlaylistForAdd);
    } else {
      songRef.current = null;
    }
  }, [selectedPlaylistForAdd]);

  // Detect if we should show the modal at all - using refs to prevent loops
  useEffect(() => {
    const shouldRender = !!(songRef.current || feedbackState);

    // Use RAF for smoother animations with better timing
    if (shouldRender) {
      // Double RAF for more reliable animation timing
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
    }
  }, [feedbackState, selectedPlaylistForAdd]);

  // Handle resize with improved debounce for better performance
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // Use requestAnimationFrame to align with browser paint cycles
      requestAnimationFrame(() => {
        resizeTimeoutRef.current = setTimeout(() => {
          const isMobileView = checkMobile();
          if (isMobileView !== isMobile) {
            setIsMobile(isMobileView);
          }
        }, 50); // Reduced debounce time for faster response
      });
    };

    // Set initial mobile state
    setIsMobile(checkMobile());

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [isMobile, checkMobile]);

  // Focus the input when create mode is active
  useEffect(() => {
    if (showCreateInput && inputRef.current) {
      const focusTimer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100); // Slightly increased delay to ensure animation completes
      return () => clearTimeout(focusTimer);
    }
  }, [showCreateInput]);

  // Apply CSS will-change optimization on mount
  useEffect(() => {
    // Apply hardware acceleration hints
    if (modalRef.current) {
      modalRef.current.style.willChange = 'transform, opacity';

      // Remove hardware acceleration hints when not needed
      return () => {
        if (modalRef.current) {
          modalRef.current.style.willChange = 'auto';
        }
      };
    }
  }, []);

  // Close modal safely without causing infinite loops
  useEffect(() => {
    // Check if we should close the modal on mount
    if (!songRef.current && feedbackState !== 'creating' && !shouldCloseRef.current) {
      shouldCloseRef.current = true;
      togglePlaylistModal(null);
    }

    // Reset menu state when component mounts
    globalMenuStateRef.current = true;

    // Cleanup function
    return () => {
      // Reset menu state when component unmounts
      modalClosingRef.current = false;
      menuLockRef.current = false;
      globalMenuStateRef.current = true;

      // Signal menu system is available again on unmount
      try {
        document.dispatchEvent(new CustomEvent('menuAvailable', { detail: { forceReset: true } }));
      } catch (e) {
        console.error("Error dispatching menuAvailable event:", e);
      }
    };
  }, [feedbackState, togglePlaylistModal]);

  // Enhanced event management with optimized handlers
  const triggerMenuAvailable = () => {
    // Set a timeout to ensure animations complete before allowing new menu actions
    setTimeout(() => {
      menuLockRef.current = false;
      globalMenuStateRef.current = true;
      try {
        document.dispatchEvent(new CustomEvent('menuAvailable', { detail: { forceReset: true } }));
      } catch (e) {
        console.error("Error dispatching menuAvailable event:", e);
      }
    }, 100);
  };

  const triggerMenuClosed = () => {
    try {
      document.dispatchEvent(new CustomEvent('menuClosed'));
    } catch (e) {
      console.error("Error dispatching menuClosed event:", e);
    }
  };

  // Handle adding a song to a playlist
  const handleAddToPlaylist = async (playlistId) => {
    if (!playlistId || !songRef.current) return;
    const playlist = userPlaylists.find(p => p.id === playlistId);
    if (!playlist) return;

    // Set menu lock to prevent simultaneous actions
    menuLockRef.current = true;
    globalMenuStateRef.current = false;

    try {
      await addSongToPlaylist(playlistId, songRef.current.id);

      setFeedbackData({ name: playlist.title, songTitle: songRef.current.title });
      setFeedbackState('added');

      triggerMenuClosed();

      // Use modalClosingRef to track modal closing state
      modalClosingRef.current = true;
      setTimeout(() => {
        togglePlaylistModal(null);
        setTimeout(() => {
          setFeedbackState(null);
          modalClosingRef.current = false;
          triggerMenuAvailable();
        }, 300);
      }, 1500);
    } catch (error) {
      console.error("Failed to add song:", error);
      triggerMenuAvailable();
    }
  };

  // Handle creating a new playlist
  const handleCreatePlaylist = async () => {
    const name = newPlaylistName.trim();
    if (!name || !songRef.current || feedbackState === 'creating') return;

    // Set menu lock to prevent simultaneous actions
    menuLockRef.current = true;
    globalMenuStateRef.current = false;

    setFeedbackState('creating');
    setFeedbackData({ name: name, songTitle: songRef.current.title });

    try {
      const playlistId = await createPlaylist(name);

      if (playlistId) {
        await addSongToPlaylist(playlistId, songRef.current.id);
      } else {
        throw new Error("Playlist creation did not return an ID.");
      }

      setNewPlaylistName('');
      setFeedbackState('created');

      triggerMenuClosed();

      // Use modalClosingRef to track modal closing state
      modalClosingRef.current = true;
      setTimeout(() => {
        togglePlaylistModal(null);
        setTimeout(() => {
          setFeedbackState(null);
          modalClosingRef.current = false;
          triggerMenuAvailable();
        }, 300);
      }, 1800);
    } catch (error) {
      console.error("Failed to create playlist and add song:", error);
      setFeedbackState(null);
      setShowCreateInput(true);
      triggerMenuAvailable();
    }
  };

  const handleCancelCreate = () => {
    setShowCreateInput(false);
    setNewPlaylistName('');
  }

  const handleCloseModal = (e) => {
    if (e) e.stopPropagation();

    if (feedbackState !== 'creating' && !modalClosingRef.current) {
      menuLockRef.current = true;
      modalClosingRef.current = true;

      triggerMenuClosed();

      togglePlaylistModal(null);
      setTimeout(() => {
        setFeedbackState(null);
        modalClosingRef.current = false;
        triggerMenuAvailable();
      }, 300);
    }
  }

  const styles = useMemo(() => {
    return {
      modalPosition: showCreateInput && isMobile
        ? "fixed bottom-0 sm:bottom-auto sm:top-1/3 left-0 right-0 max-h-[70vh] sm:max-h-[60vh]"
        : "fixed bottom-0 sm:bottom-0 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:max-w-lg w-full max-h-[75vh] sm:max-h-[70vh] sm:rounded-t-3xl overflow-hidden",

      background: theme === 'night' || theme === 'dark'
        ? 'bg-gradient-to-b from-gray-800 to-gray-900 border-t border-gray-700'
        : 'bg-gradient-to-b from-white to-purple-50 border-t border-gray-200',

      textColor: (intensity = 'high') => {
        if (theme === 'night' || theme === 'dark') {
          return intensity === 'high' ? 'text-gray-100' : 'text-gray-300';
        }
        return intensity === 'high' ? 'text-gray-800' : 'text-gray-600';
      },

      subTextColor: theme === 'night' || theme === 'dark' ? 'text-gray-400' : 'text-gray-500',

      inputBackground: theme === 'night' || theme === 'dark'
        ? 'bg-gray-700 border-gray-600 focus:border-purple-400 focus:ring-purple-400/30'
        : 'bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-300/40',

      buttonBackground: (type = 'default') => {
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
      },

      createButtonStyle: theme === 'night' || theme === 'dark'
        ? 'bg-transparent border-2 border-dashed border-gray-600 text-purple-400 hover:border-purple-400 hover:bg-gray-800/50'
        : 'bg-white border-2 border-dashed border-purple-300 text-purple-600 hover:border-purple-400 hover:bg-purple-50/50'
    };
  }, [theme, showCreateInput, isMobile]);

  // Enhanced backdrop animation - smoother transitions
  const optimizedBackdropAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.22,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  // Improved modal animation - smoother and more subtle
  const optimizedModalAnimation = {
    hidden: {
      y: 80,
      opacity: 0,
      scale: 0.98,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 24,
        stiffness: 230,
        mass: 1,
        opacity: { duration: 0.25 },
      }
    },
    exit: {
      y: 20,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.22,
        ease: [0.32, 0, 0.67, 0]
      }
    }
  };

  // Refined list item animations - more subtle and performant
  const listItemAnimation = {
    hidden: { opacity: 0, y: 8 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: Math.min(i * 0.025, 0.15), // Cap the maximum delay
        duration: 0.25,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    })
  };

  // Gentle hover animation for playlist items - less dramatic
  const playlistItemHover = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.015,
      y: -1,
      transition: {
        duration: 0.15,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.985,
      transition: {
        duration: 0.1
      }
    }
  };

  // Safely get current song
  const song = songRef.current;

  // If we shouldn't render, return null immediately
  if (!song && !feedbackState) {
    return null;
  }

  // Render the feedback content with optimized animations
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
              <FaSpinner className={`w-10 h-10 ${styles.textColor('low')}`} />
            </motion.div>
            <h3 className={`text-lg font-semibold ${styles.textColor('high')} mb-1`}>Creating Playlist...</h3>
            <p className={`${styles.subTextColor} text-sm`}>Adding "{feedbackData.songTitle}" to "{feedbackData.name}"</p>
          </motion.div>
        );
      case 'created':
        return (
          <motion.div
            key="created"
            className="flex flex-col items-center justify-center py-10 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mb-4 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.05
              }}
            >
              <FaMusic className="w-7 h-7 text-white" />
            </motion.div>
            <h3 className={`text-xl font-bold ${styles.textColor('high')} mb-1`}>Playlist Created!</h3>
            <p className={`${styles.subTextColor} text-sm`}>"{feedbackData.songTitle}" added to "{feedbackData.name}"</p>
          </motion.div>
        );
      case 'added':
        return (
          <motion.div
            key="added"
            className="flex flex-col items-center justify-center py-10 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center mb-4 shadow-md"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.05
              }}
            >
              <FaCheck className="w-7 h-7 text-white" />
            </motion.div>
            <h3 className={`text-xl font-bold ${styles.textColor('high')} mb-1`}>Song Added!</h3>
            <p className={`${styles.subTextColor} text-sm`}>Added "{feedbackData.songTitle}" to "{feedbackData.name}"</p>
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Render the main content
  const renderMainContent = () => (
    <motion.div
      key="main"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className={`text-xl font-bold ${styles.textColor('high')}`}>
          Add to Playlist
        </h3>
        <button
          className={`p-1.5 rounded-full ${styles.subTextColor} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
          onClick={handleCloseModal}
          aria-label="Close modal"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      {/* Song Info */}
      {song && (
        <motion.div
          className="flex items-center space-x-3 mb-5 px-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          <div className="w-14 h-14 rounded-lg overflow-hidden shadow-md flex-shrink-0 border border-black/10">
            <img
              src={song.cover}
              alt={song.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
          <div className="overflow-hidden">
            <h4 className={`font-medium truncate ${styles.textColor('high')}`}>{song.title}</h4>
            <p className={`text-sm truncate ${styles.subTextColor}`}>Select or create a playlist</p>
          </div>
        </motion.div>
      )}

      {/* Playlist List OR Create Input */}
      <div className="max-h-[40vh] overflow-y-auto pr-1 space-y-2 mb-5 custom-scrollbar overscroll-contain">
        {!showCreateInput ? (
          <>
            {/* Render playlists with staggered animation - less aggressive */}
            {userPlaylists.map((playlist, index) => (
              <motion.button
                key={playlist.id}
                custom={index}
                variants={listItemAnimation}
                initial="hidden"
                animate="visible"
                className={`flex items-center w-full p-3 ${styles.buttonBackground('default')} rounded-xl transition-colors`}
                whileHover={{ scale: 1.015, y: -1, transition: { duration: 0.15, ease: "easeOut" } }}
                whileTap={{ scale: 0.985, transition: { duration: 0.1 } }}
                onClick={() => handleAddToPlaylist(playlist.id)}
              >
                {/* Playlist Cover/Icon */}
                <div className={`w-10 h-10 rounded-lg overflow-hidden shadow-sm mr-3 flex-shrink-0 flex items-center justify-center ${theme === 'night' || theme === 'dark' ? 'bg-gray-700' : 'bg-purple-100'}`}>
                  {playlist.cover ? (
                    <img
                      src={playlist.cover}
                      alt={playlist.title}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  ) : (
                    <FaMusic className={`w-5 h-5 ${styles.subTextColor}`} />
                  )}
                </div>
                <div className="text-left overflow-hidden">
                  <h5 className={`font-medium truncate ${styles.textColor('high')}`}>{playlist.title}</h5>
                  <p className={`text-xs ${styles.subTextColor}`}>{playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}</p>
                </div>
                <FaPlus className={`ml-auto w-4 h-4 ${styles.subTextColor} opacity-50`} />
              </motion.button>
            ))}

            {/* Create New Button - with enhanced animation */}
            <motion.button
              className={`w-full mt-3 py-3 px-4 ${styles.createButtonStyle} rounded-xl transition-all duration-150 flex items-center justify-center`}
              onClick={() => setShowCreateInput(true)}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: Math.min(0.025 * userPlaylists.length, 0.15) + 0.05,
                  duration: 0.3
                }
              }}
              whileHover={{
                scale: 1.02,
                y: -1,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)"
              }}
              whileTap={{ scale: 0.98 }}
              transition={{
                duration: 0.15,
                ease: "easeOut"
              }}
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
            transition={{ duration: 0.25, ease: [0.2, 1, 0.3, 1] }}
            className="space-y-3 pt-2"
          >
            <motion.div
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.25, delay: 0.05 }}
            >
              <input
                ref={inputRef}
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Enter playlist name..."
                className={`w-full px-4 py-3 rounded-xl border-2 ${styles.inputBackground} focus:outline-none focus:ring-2 ${styles.textColor('high')} placeholder-purple-400/70 dark:placeholder-gray-500 transition duration-150 ease-in-out`}
                maxLength={50}
              />
            </motion.div>

            <motion.div
              className="flex space-x-2"
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.25, delay: 0.1 }}
            >
              <motion.button
                className={`flex-1 py-3 px-4 ${styles.buttonBackground('secondary')} rounded-xl transition-colors font-medium`}
                onClick={handleCancelCreate}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                Cancel
              </motion.button>

              <motion.button
                className={`flex-1 py-3 px-4 ${styles.buttonBackground('primary')} rounded-xl transition-opacity font-medium disabled:opacity-60 disabled:cursor-not-allowed`}
                onClick={handleCreatePlaylist}
                whileHover={{ scale: 1.02, filter: "brightness(1.03)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                disabled={!newPlaylistName.trim() || feedbackState === 'creating'}
              >
                {feedbackState === 'creating' ? (
                  <FaSpinner className="animate-spin h-5 w-5 mx-auto" />
                ) : (
                  "Create & Add"
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  return (
    <>
      {/* Backdrop with enhanced animation */}
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
        variants={optimizedBackdropAnimation}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={handleCloseModal}
        style={{ willChange: 'opacity' }}
      />

      <motion.div
        ref={modalRef}
        className={`shadow-2xl ${styles.modalPosition} ${styles.background} rounded-t-3xl p-5 z-50 flex flex-col`}
        variants={optimizedModalAnimation}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <AnimatePresence mode="wait" initial={false}>
          {feedbackState ? renderFeedbackContent() : renderMainContent()}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default AddToPlaylistModal;
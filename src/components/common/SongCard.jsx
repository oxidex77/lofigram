// src/components/common/SongCard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../../contexts/PlayerContext';
import { useUser } from '../../contexts/UserContext';
import { useApp } from '../../contexts/AppContext';
import { getArtistById } from '../../../src/mockMusicData';

const SongCard = ({ song }) => {
    const { play, currentSong, isPlaying, togglePlay } = usePlayer();
    const { isSongLiked, toggleLikeSong } = useUser();
    const { togglePlaylistModal, maximizePlayer, theme } = useApp();
    const [showOptions, setShowOptions] = useState(false);
    const [menuActive, setMenuActive] = useState(false);
    const menuRef = useRef(null);
    const optionsButtonRef = useRef(null);
    const cardRef = useRef(null);
    
    const artist = getArtistById(song.artist);
    const isActive = currentSong?.id === song.id;
    const isLiked = isSongLiked(song.id);

    // Custom event listener to close all other menus when one is opened
    useEffect(() => {
        const handleCloseAllMenus = (e) => {
            if (e.detail.except !== song.id) {
                setShowOptions(false);
                setMenuActive(false);
            }
        };

        document.addEventListener('closeAllMenus', handleCloseAllMenus);
        return () => {
            document.removeEventListener('closeAllMenus', handleCloseAllMenus);
        };
    }, [song.id]);

    // Enhanced click outside handling
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showOptions &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                optionsButtonRef.current &&
                !optionsButtonRef.current.contains(event.target)) {
                
                // Only close if we're not clicking inside the menu or button
                setShowOptions(false);
                setMenuActive(false);
            }
        };

        // Use both mouse and touch events for better device coverage
        document.addEventListener('mousedown', handleClickOutside, true);
        document.addEventListener('touchstart', handleClickOutside, true);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside, true);
            document.removeEventListener('touchstart', handleClickOutside, true);
        };
    }, [showOptions]);

    // Immediately set menuActive state based on showOptions
    // This removes the delay that was causing issues
    useEffect(() => {
        setMenuActive(showOptions);
    }, [showOptions]);

    const handlePlayClick = (e) => {
        // Exit early if clicking on options button or like button
        if (optionsButtonRef.current?.contains(e.target) ||
            e.target.closest('button[aria-label="Like button"]')) {
            return;
        }

        if (isActive) {
            togglePlay();
        } else {
            play(song.id);
            maximizePlayer();
        }
    };

    // Theme-based styling functions
    const getCardBackground = () => {
        if (theme === 'night' || theme === 'dark') {
            return isActive
                ? 'bg-gray-800 bg-opacity-80'
                : 'bg-gray-800 bg-opacity-60';
        }
        return isActive
            ? 'bg-white bg-opacity-80'
            : 'bg-white bg-opacity-60';
    };

    const getTextColor = () => {
        if (theme === 'night' || theme === 'dark') {
            return isActive ? 'text-purple-300' : 'text-gray-300';
        }
        return isActive ? 'text-purple-600' : 'text-gray-800';
    };

    const getSubTextColor = () => {
        if (theme === 'night' || theme === 'dark') return 'text-gray-400';
        return 'text-gray-500';
    };

    const getMenuBackground = () => {
        if (theme === 'night' || theme === 'dark') return 'bg-gray-800 shadow-lg shadow-black/30';
        return 'bg-white shadow-lg';
    };

    // Heart Animation Variants
    const heartVariants = {
        initial: {
            scale: 1,
            transition: { duration: 0.2, ease: "easeOut" }
        },
        liked: {
            scale: [1, 1.3, 1.1], 
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    // Determine if this is likely the first item in a list
    const isFirstInList = song.position === 0 || song.id === 1 || song.title === "Raindrops on Windowpanes";

    return (
        <motion.div
            ref={cardRef}
            style={{ zIndex: showOptions ? 10 : 'auto' }}
            className={`flex items-center ${getCardBackground()} rounded-xl p-3 mb-3 shadow-sm backdrop-filter backdrop-blur-sm relative`}
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.07)" }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handlePlayClick}
        >
            {/* Album Cover */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-sm mr-3 flex-shrink-0">
                <img
                    src={song.cover}
                    alt={song.title}
                    className={`w-full h-full object-cover transition-all duration-300 ${isActive ? 'brightness-90' : ''}`}
                />

                {/* Active State Overlay */}
                {isActive && (
                    <div className={`absolute inset-0 flex items-center justify-center ${isPlaying ? 'bg-gradient-to-br from-pink-400/70 to-purple-500/70' : 'bg-black/40'}`}>
                        {isPlaying ? (
                            <div className="flex items-end h-6 space-x-0.5 px-1">
                                {[1, 2, 3, 4].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1 bg-white rounded-full"
                                        animate={{
                                            height: [
                                                `${20 + Math.sin(i * 0.8) * 15}%`,
                                                `${70 + Math.sin(i * 0.8) * 20}%`,
                                                `${20 + Math.sin(i * 0.8) * 15}%`
                                            ]
                                        }}
                                        transition={{
                                            duration: 1.2,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                            ease: "easeInOut"
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                )}
            </div>

            {/* Song Info */}
            <div className="flex-grow min-w-0">
                <h3 className={`text-sm font-semibold truncate ${getTextColor()}`}>
                    {song.title}
                </h3>
                <p className={`text-xs ${getSubTextColor()} truncate`}>
                    {artist?.name || 'Unknown Artist'}
                </p>
            </div>

            {/* Duration */}
            <div className={`text-xs ${getSubTextColor()} mx-2 flex-shrink-0`}>
                {song.duration}
            </div>

            {/* Like Button with Heart Animation */}
            <motion.button
                aria-label="Like button"
                className="ml-2 p-1.5 flex-shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50"
                onClick={(e) => {
                    e.stopPropagation();
                    toggleLikeSong(song.id);
                }}
                variants={heartVariants}
                animate={isLiked ? "liked" : "initial"}
                whileTap={{ scale: 0.9 }}
            >
                {isLiked ? (
                    <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-gray-400 hover:text-gray-500 transition-colors duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                )}
            </motion.button>

            {/* Options Menu Button - Fixed and Enhanced Reliability */}
            <div className="relative ml-1 flex-shrink-0">
                <motion.button
                    ref={optionsButtonRef}
                    // Added data-testid for easier debugging
                    data-testid={`options-button-${song.id}`}
                    className="p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        
                        // Explicitly remove focus to prevent issues with sequential clicks
                        optionsButtonRef.current?.blur();
                        
                        // Force close any open menus in other cards
                        document.dispatchEvent(new CustomEvent('closeAllMenus', { 
                            detail: { except: song.id } 
                        }));
                        
                        // Toggle menu state directly for better responsiveness
                        setShowOptions(prev => !prev);
                    }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="More options"
                >
                    {/* Vertical dots icon */}
                    <svg className="w-5 h-5 text-gray-400 hover:text-gray-500 transition-colors duration-150" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </motion.button>

                {/* Dropdown Menu with Smart Positioning */}
                <AnimatePresence>
                    {showOptions && (
                        <motion.div
                            ref={menuRef}
                            data-testid={`options-menu-${song.id}`}
                            className={`absolute right-0 z-50 rounded-lg overflow-hidden ${getMenuBackground()}`}
                            style={{ 
                                width: '145px',
                                // Smart positioning based on position in list
                                ...(isFirstInList
                                    ? { 
                                        bottom: 'auto', 
                                        top: '100%',
                                        marginTop: '5px' 
                                      } 
                                    : { 
                                        bottom: '100%',
                                        top: 'auto',
                                        marginBottom: '5px' 
                                      }
                                )
                            }}
                            initial={{ 
                                opacity: 0, 
                                scale: 0.9, 
                                ...(isFirstInList
                                    ? { y: -5 } 
                                    : { y: 5 }
                                )
                            }}
                            animate={{ 
                                opacity: 1, 
                                scale: 1, 
                                y: 0 
                            }}
                            exit={{ 
                                opacity: 0, 
                                scale: 0.9, 
                                ...(isFirstInList
                                    ? { y: -5 } 
                                    : { y: 5 }
                                ),
                                transition: { duration: 0.15 } 
                            }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            // Added click handler directly on menu container to prevent bubbling
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="py-1">
                                {/* Add to Playlist option - Unchanged */}
                                <motion.button
                                    className={`flex items-center w-full px-3 py-1.5 text-xs text-left rounded-md transition-colors duration-200 ${
                                        theme === 'night' || theme === 'dark'
                                            ? 'text-gray-200 hover:bg-gray-700/70'
                                            : 'text-gray-600 hover:bg-purple-50'
                                        }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        togglePlaylistModal(song.id);
                                        setShowOptions(false);
                                    }}
                                    whileHover={{ scale: 1.02, x: 1 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <svg className="w-3 h-3 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span className="font-medium">Add to Playlist</span>
                                </motion.button>

                                {/* Share Song button - Unchanged */}
                                <motion.button
                                    className={`flex items-center w-full px-3 py-1.5 text-xs text-left rounded-md transition-colors duration-200 ${
                                        theme === 'night' || theme === 'dark'
                                            ? 'text-gray-200 hover:bg-gray-700/70'
                                            : 'text-gray-600 hover:bg-purple-50'
                                        }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log("Share action for:", song.title);
                                        setShowOptions(false);
                                    }}
                                    whileHover={{ scale: 1.02, x: 1 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <svg className="w-3 h-3 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    <span className="font-medium">Share Song</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default SongCard;
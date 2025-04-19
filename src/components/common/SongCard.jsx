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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showOptions &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                optionsButtonRef.current &&
                !optionsButtonRef.current.contains(event.target)) {

                setShowOptions(false);
                setMenuActive(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside, true);
        document.addEventListener('touchstart', handleClickOutside, true);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside, true);
            document.removeEventListener('touchstart', handleClickOutside, true);
        };
    }, [showOptions]);

    useEffect(() => {
        setMenuActive(showOptions);
    }, [showOptions]);

    const handlePlayClick = (e) => {
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

    const heartVariants = {
        initial: {
            scale: 1,
            color: theme === 'night' || theme === 'dark' ? "rgb(156, 163, 175)" : "rgb(156, 163, 175)", // gray-400
            transition: { duration: 0.2, ease: "easeOut" }
        },
        liked: {
            scale: [1, 1.4, 0.9, 1.15, 1],
            color: "rgb(236, 72, 153)", // pink-500
            transition: {
                duration: 0.5, // Shorter duration for smoother animation
                ease: [0.17, 0.67, 0.83, 0.67], // Optimized spring-like motion
                times: [0, 0.2, 0.35, 0.5, 1]
            }
        }
    };

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

            <motion.button
                aria-label="Like button"
                className="relative ml-2 p-1.5 flex-shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50"
                onClick={(e) => {
                    e.stopPropagation();
                    toggleLikeSong(song.id);
                }}
                whileTap={{ scale: 0.9 }}
            >
                {/* Heart Background Pulse Effect - Optimized */}
                <AnimatePresence>
                    {isLiked && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: [0, 1.8, 0],
                                opacity: [0, 0.25, 0]
                            }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full"
                        />
                    )}
                </AnimatePresence>

                {/* Heart Icon with Premium Animation */}
                <motion.div
                    variants={heartVariants}
                    initial="initial"
                    animate={isLiked ? "liked" : "initial"}
                    className="relative z-10"
                >
                    {isLiked ? (
                        // Solid Heart (When Liked)
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            {/* Classic Heart Shape */}
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />

                            {/* Optimized particles that won't slow down animation */}
                            <g>
                                {[...Array(6)].map((_, i) => (
                                    <motion.circle
                                        key={i}
                                        cx={12 + (i % 3) * 4 - 4}
                                        cy={12 + Math.floor(i / 3) * 4 - 4}
                                        r={0.5}
                                        fill="#fff"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={isLiked ? {
                                            scale: [0, 1, 0],
                                            opacity: [0, 0.9, 0],
                                            x: [0, (i % 3 - 1) * 7],
                                            y: [0, (Math.floor(i / 3) - 1) * 7],
                                        } : {}}
                                        transition={{
                                            duration: 0.6,
                                            delay: i * 0.04,
                                            ease: "easeOut"
                                        }}
                                    />
                                ))}

                                {/* Simple sparkle effect that won't compromise performance */}
                                {[...Array(2)].map((_, i) => (
                                    <motion.path
                                        key={`sparkle-${i}`}
                                        d="M12 6L13 9H16L13.5 11L14.5 14L12 12L9.5 14L10.5 11L8 9H11Z"
                                        stroke="#fff"
                                        strokeWidth="0.3"
                                        fill="none"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={isLiked ? {
                                            scale: [0, 1, 0],
                                            opacity: [0, 0.8, 0],
                                            rotate: 0,
                                            x: i === 0 ? -8 : 8,
                                            y: i === 0 ? -6 : 6,
                                        } : {}}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.1 + i * 0.1,
                                            ease: "easeOut"
                                        }}
                                        style={{
                                            transformOrigin: 'center',
                                            transformBox: 'fill-box'
                                        }}
                                    />
                                ))}
                            </g>
                        </svg>
                    ) : (
                        // Outlined Heart (When Not Liked)
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </motion.div>
            </motion.button>

            <div className="relative ml-1 flex-shrink-0">
                <motion.button
                    ref={optionsButtonRef}
                    data-testid={`options-button-${song.id}`}
                    className="p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();

                        optionsButtonRef.current?.blur();

                        document.dispatchEvent(new CustomEvent('closeAllMenus', {
                            detail: { except: song.id }
                        }));

                        setShowOptions(prev => !prev);
                    }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="More options"
                >
                    <svg className="w-5 h-5 text-gray-400 hover:text-gray-500 transition-colors duration-150" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </motion.button>

                <AnimatePresence>
                    {showOptions && (
                        <motion.div
                            ref={menuRef}
                            data-testid={`options-menu-${song.id}`}
                            className={`absolute right-0 z-50 rounded-lg overflow-hidden ${getMenuBackground()}`}
                            style={{
                                width: '145px',
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
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="py-1">
                                <motion.button
                                    className={`flex items-center w-full px-3 py-1.5 text-xs text-left rounded-md transition-colors duration-200 ${theme === 'night' || theme === 'dark'
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

                                <motion.button
                                    className={`flex items-center w-full px-3 py-1.5 text-xs text-left rounded-md transition-colors duration-200 ${theme === 'night' || theme === 'dark'
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
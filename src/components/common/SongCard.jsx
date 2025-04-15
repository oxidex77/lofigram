// src/components/common/SongCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../../contexts/PlayerContext';
import { useUser } from '../../contexts/UserContext';
import { useApp } from '../../contexts/AppContext';
import { getArtistById } from '../../../src/mockMusicData';
import { heartBeat } from '../../animations/animations';

const SongCard = ({ song }) => {
    const { play, currentSong, isPlaying, togglePlay } = usePlayer();
    const { isSongLiked, toggleLikeSong } = useUser();
    const { togglePlaylistModal, maximizePlayer } = useApp();

    const artist = getArtistById(song.artist);
    const isActive = currentSong?.id === song.id;
    const isLiked = isSongLiked(song.id);

    const handlePlayClick = () => {
        if (isActive) {
            togglePlay();
        } else {
            play(song.id);
            maximizePlayer();
        }
    };
    const handleLongPress = () => {
        togglePlaylistModal(song.id);
    };

    return (
        <motion.div
            className="flex items-center bg-white bg-opacity-60 rounded-xl p-3 mb-3 shadow-sm backdrop-filter backdrop-blur-sm"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.07)" }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onContextMenu={(e) => {
                e.preventDefault();
                handleLongPress();
            }}
        >
            {/* Album Cover */}
            <div
                className="relative w-12 h-12 rounded-lg overflow-hidden shadow-sm mr-3 flex-shrink-0"
                onClick={handlePlayClick}
            >
                <img
                    src={song.cover}
                    alt={song.title}
                    className={`w-full h-full object-cover transition-all duration-300 ${isActive ? 'brightness-90' : ''}`}
                />

                {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-400/60 to-purple-500/60 flex items-center justify-center">
                        {isPlaying ? (
                            <div className="flex items-center space-x-1 px-1">
                                {[1, 2, 3].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1 h-4 bg-white rounded-full"
                                        animate={{
                                            height: ['40%', `${60 + i * 20}%`, '40%']
                                        }}
                                        transition={{
                                            duration: 0.8,
                                            repeat: Infinity,
                                            delay: i * 0.2
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
            <div className="flex-grow min-w-0 cursor-pointer" onClick={handlePlayClick}>
            <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-purple-600' : 'text-gray-800'}`}>
                    {song.title}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                    {artist?.name || 'Unknown Artist'}
                </p>
            </div>

            {/* Duration */}
            <div className="text-xs text-gray-400 mx-2 flex-shrink-0">
                {song.duration}
            </div>

            {/* Like Button */}
            <motion.button
                className="ml-2 p-1.5 flex-shrink-0"
                onClick={(e) => {
                    e.stopPropagation();
                    toggleLikeSong(song.id);
                }}
                variants={heartBeat}
                initial="initial"
                animate={isLiked ? "liked" : "initial"}
            >
                {isLiked ? (
                    <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                )}
            </motion.button>

            {/* Add to Playlist Button */}
            <motion.button
                className="ml-1 p-1.5 flex-shrink-0"
                onClick={(e) => {
                    e.stopPropagation();
                    handleLongPress();
                }}
                whileTap={{ scale: 0.9 }}
            >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
            </motion.button>
        </motion.div>
    );
};

export default SongCard;
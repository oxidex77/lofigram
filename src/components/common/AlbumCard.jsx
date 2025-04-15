// src/components/common/AlbumCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import { albumCoverHover } from '../../animations/animations';
import { getArtistById } from '../../../src/mockMusicData';

const AlbumCard = ({ album, size = 'md' }) => {
  const { filterSongsByAlbum, theme } = useApp();
  
  const artist = album.artist !== 'Various Artists' 
    ? getArtistById(album.artist) 
    : { name: 'Various Artists' };

  const handleClick = () => {
    filterSongsByAlbum(album.id);
  };

  // Size classes
  const sizes = {
    sm: 'w-28 h-28',
    md: 'w-36 h-36',
    lg: 'w-44 h-44'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const getTextColor = () => {
    if (theme === 'night') return 'text-gray-300';
    return 'text-gray-800';
  };

  const getSubTextColor = () => {
    if (theme === 'night') return 'text-gray-400';
    return 'text-gray-500';
  };

  return (
    <motion.div 
      className="flex flex-col items-center mb-4 mx-1"
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      <motion.div 
        className={`${sizes[size]} rounded-lg overflow-hidden shadow-md bg-purple-100`}
        variants={albumCoverHover}
        initial="rest"
        whileHover="hover"
      >
        <img 
          src={album.cover} 
          alt={album.title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </motion.div>
      <h3 className={`${textSizes[size]} font-medium text-center mt-2 ${getTextColor()} w-full truncate px-1`}>
        {album.title}
      </h3>
      <p className={`text-xs ${getSubTextColor()} text-center w-full truncate px-1`}>
        {artist?.name || 'Unknown Artist'} • {album.year}
      </p>
    </motion.div>
  );
};

export default AlbumCard;
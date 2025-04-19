import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import { albumCoverHover } from '../../animations/animations';

const ArtistCard = ({ artist }) => {
  const { filterSongsByArtist, theme } = useApp();

  const handleClick = () => {
    filterSongsByArtist(artist.id);
  };

  const getTextColor = () => {
    if (theme === 'night' || theme === 'dark') return 'text-gray-300';
    return 'text-gray-800';
  };

  const getSubTextColor = () => {
    if (theme === 'night' || theme === 'dark') return 'text-gray-400';
    return 'text-gray-500';
  };

  return (
    <motion.div 
      className="flex flex-col items-center mb-6 mx-2"
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={handleClick}
    >
      <motion.div 
        className="w-32 h-32 rounded-full overflow-hidden shadow-md border-2 border-white"
        variants={albumCoverHover}
        initial="rest"
        whileHover="hover"
      >
        <img 
          src={artist.image} 
          alt={artist.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </motion.div>
      
      <div className="text-center mt-3">
        <h3 className={`font-medium ${getTextColor()}`}>
          {artist.name}
        </h3>
        <p className={`text-xs ${getSubTextColor()} mt-1 px-4`}>
          {artist.description}
        </p>
      </div>
      
      {/* Decorative element */}
      <motion.div 
        className="w-8 h-1 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mt-2"
        initial={{ width: 0 }}
        animate={{ width: 32 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      />
    </motion.div>
  );
};

export default ArtistCard;
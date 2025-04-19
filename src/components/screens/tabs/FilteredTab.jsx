import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../../contexts/AppContext';
import SongCard from '../../common/SongCard';
import { staggerContainer, staggerItem } from '../../../animations/animations';
import { getArtistById } from '../../../../src/mockMusicData';

const FilteredTab = () => {
  const { filteredSongs, filterTitle, filterType, filterItemDetails, clearFilter, theme } = useApp();

  const getBackground = () => {
    if (theme === 'night' || theme === 'dark') return 'bg-gray-800 bg-opacity-50';
    return 'bg-white bg-opacity-60';
  };

  const getTextColor = () => {
    if (theme === 'night' || theme === 'dark') return 'text-gray-300';
    return 'text-purple-800';
  };

  const getSubTextColor = () => {
    if (theme === 'night' || theme === 'dark') return 'text-gray-400';
    return 'text-gray-600';
  };

  const getIcon = () => {
    switch (filterType) {
      case 'album':
        return '💿';
      case 'artist':
        return '🎤';
      case 'playlist':
        return '📚';
      default:
        return '🎵';
    }
  };

  const renderDetailHeader = () => {
    if (!filterItemDetails) return null;

    switch (filterType) {
      case 'album':
        const albumArtist = filterItemDetails.artist !== 'Various Artists' 
          ? getArtistById(filterItemDetails.artist) 
          : { name: 'Various Artists' };
          
        return (
          <div className={`flex items-center p-4 rounded-xl mb-6 ${getBackground()}`}>
            <motion.div 
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shadow-md mr-4 flex-shrink-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <img 
                src={filterItemDetails.cover} 
                alt={filterItemDetails.title} 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <div className="flex-grow">
              <div className="text-xs uppercase font-medium mb-1 tracking-wider opacity-70">
                {filterType}
              </div>
              <h2 className={`text-xl sm:text-2xl font-bold ${getTextColor()} mb-1`}>
                {filterItemDetails.title}
              </h2>
              <p className={`text-sm ${getSubTextColor()}`}>
                {albumArtist?.name || 'Unknown Artist'} • {filterItemDetails.year} • {filteredSongs.length} songs
              </p>
            </div>
          </div>
        );
        
      case 'artist':
        // Artist header with image, name, description
        return (
          <div className={`flex flex-col sm:flex-row items-center p-4 rounded-xl mb-6 ${getBackground()}`}>
            <motion.div 
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-md mb-4 sm:mb-0 sm:mr-6 flex-shrink-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <img 
                src={filterItemDetails.image} 
                alt={filterItemDetails.name} 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <div className="flex-grow text-center sm:text-left">
              <div className="text-xs uppercase font-medium mb-1 tracking-wider opacity-70">
                {filterType}
              </div>
              <h2 className={`text-xl sm:text-2xl font-bold ${getTextColor()} mb-2`}>
                {filterItemDetails.name}
              </h2>
              <p className={`text-sm ${getSubTextColor()} mb-3 max-w-md`}>
                {filterItemDetails.description}
              </p>
              <p className={`text-sm ${getSubTextColor()}`}>
                {filteredSongs.length} songs
              </p>
            </div>
          </div>
        );
        
      case 'playlist':
        // Playlist header with cover, title, stats
        return (
          <div className={`flex items-center p-4 rounded-xl mb-6 ${getBackground()}`}>
            <motion.div 
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shadow-md mr-4 flex-shrink-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <img 
                src={filterItemDetails.cover} 
                alt={filterItemDetails.title} 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <div className="flex-grow">
              <div className="text-xs uppercase font-medium mb-1 tracking-wider opacity-70">
                {filterType}
              </div>
              <h2 className={`text-xl sm:text-2xl font-bold ${getTextColor()} mb-1`}>
                {filterItemDetails.title}
              </h2>
              <p className={`text-sm ${getSubTextColor()}`}>
                {filteredSongs.length} songs
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="px-4 py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back button */}
      <div className="flex items-center justify-between mb-4">
        <motion.button 
          className={`text-xs ${theme === 'night' || theme === 'dark' ? 'text-purple-400 bg-gray-700' : 'text-purple-500 bg-purple-100'} px-3 py-1.5 rounded-full flex items-center`}
          onClick={clearFilter}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </motion.button>
      </div>
      
      {renderDetailHeader()}
      
      {/* Songs list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h3 className={`text-lg font-semibold ${getTextColor()} mb-3`}>
          Songs
        </h3>
        
        {filteredSongs.length > 0 ? (
          <motion.div
            className="space-y-3"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {filteredSongs.map(song => (
              <motion.div key={song.id} variants={staggerItem}>
                <SongCard song={song} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className={`flex flex-col items-center justify-center py-10 px-4 ${getBackground()} rounded-xl`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="text-6xl mb-4">
              {getIcon()}
            </div>
            <h3 className={`text-lg font-medium ${theme === 'night' || theme === 'dark' ? 'text-purple-300' : 'text-purple-700'} mb-2 text-center`}>
              No songs found
            </h3>
            <p className={`text-sm ${theme === 'night' || theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-center`}>
              {filterType === 'album' 
                ? "This album doesn't have any tracks yet" 
                : filterType === 'artist'
                ? "This artist doesn't have any songs yet"
                : "This playlist is empty"}
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default FilteredTab;
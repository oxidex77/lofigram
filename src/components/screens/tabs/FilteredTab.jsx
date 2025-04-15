// src/components/screens/tabs/FilteredTab.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../../contexts/AppContext';
import SongCard from '../../common/SongCard';
import { staggerContainer, staggerItem } from '../../../animations/animations';

const FilteredTab = () => {
  const { filteredSongs, filterTitle, filterType, clearFilter, theme } = useApp();

  const getBackground = () => {
    if (theme === 'night') return 'bg-gray-800 bg-opacity-50';
    return 'bg-white bg-opacity-60';
  };

  const getTextColor = () => {
    if (theme === 'night') return 'text-gray-300';
    return 'text-purple-800';
  };

  return (
    <motion.div 
      className="px-4 py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-bold ${getTextColor()}`}>
          {filterType === 'album' ? '💿 ' : '🎤 '}
          {filterTitle}
        </h2>
        <motion.button 
          className={`text-xs ${theme === 'night' ? 'text-purple-400 bg-gray-700' : 'text-purple-500 bg-purple-100'} px-2 py-1 rounded-full`}
          onClick={clearFilter}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back
        </motion.button>
      </div>
      
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
            {filterType === 'album' ? '💿' : '🎤'}
          </div>
          <h3 className={`text-lg font-medium ${theme === 'night' ? 'text-purple-300' : 'text-purple-700'} mb-2 text-center`}>
            No songs found
          </h3>
          <p className={`text-sm ${theme === 'night' ? 'text-gray-400' : 'text-gray-600'} text-center`}>
            {filterType === 'album' 
              ? "This album doesn't have any tracks yet" 
              : "This artist doesn't have any songs yet"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FilteredTab;
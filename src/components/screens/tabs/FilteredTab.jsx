// Create a new file: src/components/screens/tabs/FilteredTab.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../../contexts/AppContext';
import SongCard from '../../common/SongCard';
import { staggerContainer, staggerItem } from '../../../animations/animations';

const FilteredTab = () => {
  const { filteredSongs, filterTitle, filterType, clearFilter } = useApp();

  return (
    <motion.div 
      className="px-4 py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-purple-800">
          {filterTitle}
        </h2>
        <button 
          className="text-xs text-purple-500 px-2 py-1 rounded-full bg-purple-100"
          onClick={clearFilter}
        >
          Back to all
        </button>
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
        <div className="text-center py-8 text-purple-400">
          No songs found
        </div>
      )}
    </motion.div>
  );
};

export default FilteredTab;
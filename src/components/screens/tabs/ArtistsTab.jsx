import React from 'react';
import { motion } from 'framer-motion';
import { artists } from '../../../../src/mockMusicData';
import ArtistCard from '../../common/ArtistCard';
import { staggerContainer, staggerItem } from '../../../animations/animations';

const ArtistsTab = () => {
  return (
    <motion.div 
      className="px-4 py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold text-purple-800 mb-4">
        Artists
      </h2>
      
      <motion.div
        className="grid grid-cols-2 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {artists.map(artist => (
          <motion.div key={artist.id} variants={staggerItem}>
            <ArtistCard artist={artist} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ArtistsTab;
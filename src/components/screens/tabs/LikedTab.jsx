// src/components/screens/tabs/LikedTab.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../../contexts/UserContext';
import { getSongById } from '../../../../src/mockMusicData';
import SongCard from '../../common/SongCard';
import { staggerContainer, staggerItem } from '../../../animations/animations';

const LikedTab = () => {
  const { likedSongs } = useUser();
  
  // Get full song objects from the liked song IDs
  const likedSongsData = likedSongs.map(songId => getSongById(songId)).filter(Boolean);

  return (
    <motion.div 
      className="px-4 py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-purple-800 mb-3 flex items-center">
          <span className="mr-2">💖</span> Your Liked Songs
        </h2>
        
        {likedSongsData.length > 0 ? (
          <motion.div
            className="space-y-3"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {likedSongsData.map(song => (
              <motion.div key={song.id} variants={staggerItem}>
                <SongCard song={song} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="flex flex-col items-center justify-center py-10 px-4 bg-white bg-opacity-50 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="text-6xl mb-4">💜</div>
            <h3 className="text-lg font-medium text-purple-700 mb-2 text-center">
              No liked songs yet
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Tap the heart icon on a song to add it to your favorites!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default LikedTab;
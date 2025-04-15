// src/components/screens/tabs/SongsTab.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../../../contexts/PlayerContext';
import { songs, getTrendingSongs } from '../../../../src/mockMusicData';
import SongCard from '../../common/SongCard';
import { staggerContainer, staggerItem } from '../../../animations/animations';

const SongsTab = () => {
  const { currentSong } = usePlayer();
  const trendingSongs = getTrendingSongs();

  return (
    <motion.div 
      className="px-4 py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Trending Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-purple-800 mb-3">
          🔥 Trending
        </h2>
        <motion.div
          className="space-y-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {trendingSongs.map(song => (
            <motion.div key={song.id} variants={staggerItem}>
              <SongCard song={song} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* All Songs Section */}
      <div>
        <h2 className="text-xl font-bold text-purple-800 mb-3">
          All Songs
        </h2>
        <motion.div
          className="space-y-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {songs.map(song => (
            <motion.div key={song.id} variants={staggerItem}>
              <SongCard song={song} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SongsTab;
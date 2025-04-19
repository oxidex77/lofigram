import React from 'react';
import { motion } from 'framer-motion';
import { albums } from '../../../../src/mockMusicData';
import AlbumCard from '../../common/AlbumCard';
import { staggerContainer, staggerItem } from '../../../animations/animations';

const AlbumsTab = () => {
  const albumsByYear = albums.reduce((acc, album) => {
    if (!acc[album.year]) {
      acc[album.year] = [];
    }
    acc[album.year].push(album);
    return acc;
  }, {});

  const sortedYears = Object.keys(albumsByYear).sort((a, b) => b - a);

  return (
    <motion.div 
      className="px-4 py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Featured Albums */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-purple-800 mb-3">
          ✨ Featured Albums
        </h2>
        <div className="overflow-x-auto pb-4 scrollbar-hide">
          <motion.div 
            className="flex space-x-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {albums.slice(0, 3).map(album => (
              <motion.div 
                key={album.id} 
                variants={staggerItem}
                className="flex-shrink-0"
              >
                <AlbumCard album={album} size="lg" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Albums by Year */}
      {sortedYears.map(year => (
        <div key={year} className="mb-6">
          <h2 className="text-xl font-bold text-purple-800 mb-3">
            {year}
          </h2>
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <motion.div 
              className="flex space-x-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {albumsByYear[year].map(album => (
                <motion.div 
                  key={album.id} 
                  variants={staggerItem}
                  className="flex-shrink-0"
                >
                  <AlbumCard album={album} size="md" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default AlbumsTab;
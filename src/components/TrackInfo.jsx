// src/components/TrackInfo.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useThemeContext } from '../contexts/ThemeContext';

const TrackInfo = ({ title, artist, album }) => {
  const { themeColors } = useThemeContext();
  
  // Create variants for text animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };
  
  return (
    <motion.div 
      className="track-info"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div 
        className="now-playing"
        variants={item}
        style={{ color: themeColors.primary }}
      >
        Now Playing
      </motion.div>
      
      <motion.h2 
        className="track-title"
        variants={item}
      >
        {title || 'Unknown Track'}
      </motion.h2>
      
      <motion.h3 
        className="track-artist"
        variants={item}
      >
        {artist || 'Unknown Artist'}
      </motion.h3>
      
      <motion.p 
        className="track-album"
        variants={item}
      >
        {album || 'Unknown Album'}
      </motion.p>
      
      {/* Decorative elements */}
      <motion.div 
        className="decorative-line"
        initial={{ width: 0 }}
        animate={{ width: "80%" }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{ backgroundColor: themeColors.secondary }}
      ></motion.div>
      
      <div className="track-decorations">
        <motion.div 
          className="decoration-dot"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          style={{ backgroundColor: themeColors.primary }}
        ></motion.div>
        <motion.div 
          className="decoration-dot"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          style={{ backgroundColor: themeColors.secondary }}
        ></motion.div>
        <motion.div 
          className="decoration-dot"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          style={{ backgroundColor: themeColors.primary }}
        ></motion.div>
      </div>
    </motion.div>
  );
};

export default TrackInfo;
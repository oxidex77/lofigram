// src/components/LyricsView.jsx
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeContext } from '../contexts/ThemeContext';

// Sample lyrics with timestamps (we'll replace this with real data from an API in a production app)
const sampleLyrics = {
  track1: [
    { time: 0, text: "Raindrops falling gently" },
    { time: 7, text: "On my window pane" },
    { time: 14, text: "The sound is so soothing" },
    { time: 21, text: "It washes away the pain" },
    { time: 28, text: "I could sit here for hours" },
    { time: 35, text: "Just listening to the rain" },
    { time: 42, text: "As thoughts drift through my mind" },
    { time: 50, text: "Like clouds across the sky" },
    { time: 57, text: "Gentle raindrops falling" },
    { time: 64, text: "Create a peaceful melody" },
    { time: 71, text: "That wraps around my soul" },
    { time: 78, text: "And sets my spirit free" },
    { time: 85, text: "The rhythm of the rainfall" },
    { time: 92, text: "Is nature's lullaby" },
    { time: 100, text: "Easing all my worries" },
    { time: 107, text: "As time goes drifting by" },
    { time: 114, text: "Raindrops keep on falling" },
    { time: 121, text: "I hope they never stop" },
    { time: 128, text: "This moment is so perfect" },
    { time: 135, text: "I wish that time would stop" },
    { time: 142, text: "Just me and gentle raindrops" },
    { time: 150, text: "Creating memories" },
    { time: 157, text: "That I will keep forever" },
    { time: 164, text: "In my heart eternally" },
    { time: 172, text: "..." }
  ],
  // Add more tracks with lyrics as needed
};

// Function to get lyrics for a track
const getLyrics = (trackId) => {
  return sampleLyrics[trackId] || [{ time: 0, text: "No lyrics available for this track" }];
};

const LyricsView = ({ track, currentTime, onClose }) => {
  const { themeColors } = useThemeContext();
  const lyricsContainerRef = useRef(null);
  const [lyrics, setLyrics] = useState([]);
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);
  
  // Load lyrics when track changes
  useEffect(() => {
    if (track?.id) {
      setLyrics(getLyrics(track.id));
    }
  }, [track?.id]);
  
  // Update active lyric based on current time
  useEffect(() => {
    if (lyrics.length === 0) return;
    
    // Find the last lyric that should be displayed at the current time
    let newActiveIndex = 0;
    for (let i = 0; i < lyrics.length; i++) {
      if (lyrics[i].time <= currentTime) {
        newActiveIndex = i;
      } else {
        break;
      }
    }
    
    if (newActiveIndex !== activeLyricIndex) {
      setActiveLyricIndex(newActiveIndex);
    }
  }, [currentTime, lyrics, activeLyricIndex]);
  
  // Scroll to active lyric
  useEffect(() => {
    if (lyricsContainerRef.current && lyrics.length > 0) {
      const container = lyricsContainerRef.current;
      const activeLyricElement = container.querySelector(`.lyric-line[data-index="${activeLyricIndex}"]`);
      
      if (activeLyricElement) {
        const containerHeight = container.clientHeight;
        const activeLyricTop = activeLyricElement.offsetTop;
        const activeLyricHeight = activeLyricElement.clientHeight;
        
        // Scroll so that active lyric is centered in container
        container.scrollTo({
          top: activeLyricTop - (containerHeight / 2) + (activeLyricHeight / 2),
          behavior: 'smooth'
        });
      }
    }
  }, [activeLyricIndex]);

  return (
    <motion.div 
      className="lyrics-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="lyrics-header">
        <div className="track-mini-info">
          <div 
            className="track-mini-cover"
            style={{ backgroundImage: `url(${track?.coverArt})` }}
          ></div>
          <div className="track-mini-details">
            <h4>{track?.title || 'Unknown Track'}</h4>
            <p>{track?.artist || 'Unknown Artist'}</p>
          </div>
        </div>
        
        <button 
          className="close-lyrics-btn"
          onClick={onClose}
          aria-label="Close Lyrics"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
      
      <div className="lyrics-container" ref={lyricsContainerRef}>
        {lyrics.length === 0 ? (
          <div className="no-lyrics">
            <p>No lyrics available for this track</p>
          </div>
        ) : (
          lyrics.map((line, index) => (
            <div 
              key={index}
              className={`lyric-line ${index === activeLyricIndex ? 'active' : ''}`}
              data-index={index}
              style={{ 
                color: index === activeLyricIndex ? themeColors.primary : 'inherit',
                fontSize: index === activeLyricIndex ? '1.2rem' : '1rem',
                fontWeight: index === activeLyricIndex ? '700' : '400'
              }}
            >
              {line.text}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default LyricsView;
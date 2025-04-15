// src/components/BottomNav.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { usePlayerContext } from '../contexts/PlayerContext';

const BottomNav = ({ activeScreen, setActiveScreen, togglePlaylist, togglePlaylistEditor }) => {
  const { currentTrack, isPlaying, togglePlay } = usePlayerContext();
  
  const handleNavClick = (screen) => {
    setActiveScreen(screen);
  };
  
  return (
    <div className="bottom-nav">
      {/* Mini player always visible */}
      <div className="mini-player">
        <div 
          className="mini-album-art"
          style={{ backgroundImage: `url(${currentTrack?.coverArt})` }}
          onClick={() => setActiveScreen('player')}
        >
          {isPlaying && (
            <div className="mini-playing-indicator">
              <div className="playing-bar"></div>
              <div className="playing-bar"></div>
              <div className="playing-bar"></div>
            </div>
          )}
        </div>
        
        <div className="mini-track-info" onClick={() => setActiveScreen('player')}>
        <div className="mini-track-title">{currentTrack?.title || 'Unknown Track'}</div>
          <div className="mini-track-artist">{currentTrack?.artist || 'Unknown Artist'}</div>
        </div>
        
        <button 
          className="mini-play-btn"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        <button 
          className={`nav-tab ${activeScreen === 'home' ? 'active' : ''}`}
          onClick={() => handleNavClick('home')}
          aria-label="Home"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span>Home</span>
        </button>
        
        <button 
          className={`nav-tab ${activeScreen === 'search' ? 'active' : ''}`}
          onClick={() => handleNavClick('search')}
          aria-label="Search"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <span>Search</span>
        </button>
        
        <button 
          className={`nav-tab ${activeScreen === 'player' ? 'active' : ''}`}
          onClick={() => handleNavClick('player')}
          aria-label="Now Playing"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
          </svg>
          <span>Playing</span>
        </button>
        
        <button 
          className={`nav-tab ${activeScreen === 'library' ? 'active' : ''}`}
          onClick={() => togglePlaylist()}
          aria-label="Library"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 5h-3v5.5c0 1.38-1.12 2.5-2.5 2.5S10 13.88 10 12.5s1.12-2.5 2.5-2.5c.57 0 1.08.19 1.5.51V5h4v2zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z" />
          </svg>
          <span>Library</span>
        </button>
        
        <button 
          className={`nav-tab ${activeScreen === 'profile' ? 'active' : ''}`}
          onClick={() => togglePlaylistEditor()}
          aria-label="Profile"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span>Profile</span>
        </button>
      </nav>
      
      {/* Active Tab Indicator */}
      <motion.div 
        className="active-tab-indicator"
        initial={false}
        animate={{
          left: activeScreen === 'home' ? '10%' :
                activeScreen === 'search' ? '30%' :
                activeScreen === 'player' ? '50%' :
                activeScreen === 'library' ? '70%' : '90%',
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </div>
  );
};

export default BottomNav;
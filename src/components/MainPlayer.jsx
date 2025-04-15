// src/components/MainPlayer.jsx - Responsive version
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerContext } from '../contexts/PlayerContext';
import { useThemeContext } from '../contexts/ThemeContext';
import VinylRecord from './VinylRecord';
import AudioVisualizer from './AudioVisualizer';
import TrackInfo from './TrackInfo';
import PlaylistDrawer from './PlaylistDrawer';
import PlaylistEditor from './PlaylistEditor';
import LyricsView from './LyricsView';
import BottomNav from './BottomNav';

const MainPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playNextTrack,
    playPreviousTrack,
    currentTime,
    duration,
    seekTo,
    volume,
    setVolume,
    isLoading,
    isMuted,
    toggleMute,
    repeat,
    toggleRepeat,
    shuffle,
    toggleShuffle,
    isVisualizerOn,
    toggleVisualizer,
    showPlaylistEditor,
    setShowPlaylistEditor,
    showLyrics,
    toggleLyrics
  } = usePlayerContext();
  
  const {
    isDarkMode,
    toggleDarkMode,
    themeColors
  } = useThemeContext();
  
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [activeScreen, setActiveScreen] = useState('player'); // 'player', 'albums', 'playlists', 'search'
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  
  // Update progress bar width when current time changes
  useEffect(() => {
    if (duration > 0) {
      setProgressBarWidth((currentTime / duration) * 100);
    }
  }, [currentTime, duration]);
  
  // Format time (seconds) to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle progress bar click
  const handleProgressBarClick = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const newTime = position * duration;
    seekTo(newTime);
  };
  
  // Toggle playlist view
  const togglePlaylist = () => {
    setShowPlaylist(!showPlaylist);
    if (showPlaylistEditor) {
      setShowPlaylistEditor(false);
    }
  };
  
  // Dynamic style variables
  const dynamicStyles = {
    '--primary-color': themeColors.primary,
    '--secondary-color': themeColors.secondary,
    '--background-color': isDarkMode ? '#2A2E4A' : '#FFF5F9',
    '--text-color': isDarkMode ? '#E8E9F3' : '#5D5E7C',
  };

  return (
    <div 
      className={`main-player ${isDarkMode ? 'dark-theme' : 'light-theme'} ${showLyrics ? 'lyrics-view' : ''}`}
      style={dynamicStyles}
    >
      {/* Background gradient */}
      <div className="app-background">
        <div className="gradient-overlay" />
      </div>
      
      {/* Main Content Area */}
      <div className="player-container">
        {/* Player View */}
        {activeScreen === 'player' && (
          <div className="now-playing-view">
            {/* Album Art & Vinyl */}
            <div className="album-container">
              <VinylRecord 
                albumCover={currentTrack?.coverArt} 
                isPlaying={isPlaying} 
              />
              
              {/* Audio visualizer overlay (shown only when playing and visualizer is on) */}
              {isPlaying && isVisualizerOn && <AudioVisualizer />}
            </div>
            
            {/* Track Information */}
            <TrackInfo 
              title={currentTrack?.title}
              artist={currentTrack?.artist}
              album={currentTrack?.album}
            />
            
            {/* Progress Bar */}
            <div className="progress-container">
              <div 
                className="progress-bar"
                onClick={handleProgressBarClick}
              >
                <div 
                  className="progress-filled"
                  style={{ width: `${progressBarWidth}%` }}
                />
              </div>
              <div className="time-display">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            {/* Player Controls */}
            <div className="playback-controls">
              <button 
                className={`control-button shuffle ${shuffle ? 'active' : ''}`}
                onClick={toggleShuffle}
                aria-label="Shuffle"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm0.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
                </svg>
              </button>
              
              <button 
                className="control-button previous" 
                onClick={playPreviousTrack}
                aria-label="Previous"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>
              
              <button 
                className="control-button play-pause" 
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
              
              <button 
                className="control-button next" 
                onClick={playNextTrack}
                aria-label="Next"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
              
              <button 
                className={`control-button repeat ${repeat !== 'none' ? 'active' : ''}`}
                onClick={toggleRepeat}
                aria-label="Repeat"
              >
                {repeat === 'one' ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Secondary Controls */}
            <div className="secondary-controls">
              <button 
                className={`icon-button ${isVisualizerOn ? 'active' : ''}`}
                onClick={toggleVisualizer}
                aria-label="Toggle Visualizer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 18h2V6H7v12zm4-12v12h2V6h-2zm4 12h2V6h-2v12z" />
                </svg>
              </button>
              
              <div className="volume-control">
                <button 
                  className="icon-button"
                  onClick={toggleMute}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                    </svg>
                  ) : volume <= 0.33 ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 9v6h4l5 5V4l-5 5H7z" />
                    </svg>
                  ) : volume <= 0.66 ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 9v6h4l5 5V4l-5 5H7zm8-1.4v8.8c.9-.9 1.5-2.2 1.5-3.5v-1.8c0-1.3-.6-2.6-1.5-3.5z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 9v6h4l5 5V4l-5 5H7zm8-1.4v8.8c.9-.9 1.5-2.2 1.5-3.5v-1.8c0-1.3-.6-2.6-1.5-3.5zm4 0c1.2 1.3 2 3 2 4.9 0 1.9-.8 3.6-2 4.9v-9.8z" />
                    </svg>
                  )}
                </button>
                
                <AnimatePresence>
                  {showVolumeSlider && (
                    <motion.div 
                      className="volume-slider-container"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 100 }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      onMouseLeave={() => setShowVolumeSlider(false)}
                    >
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="volume-slider"
                        aria-label="Volume"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <button 
                className={`icon-button ${showLyrics ? 'active' : ''}`}
                onClick={toggleLyrics}
                aria-label="Show Lyrics"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z" />
                </svg>
              </button>
              
              <button 
                className="icon-button"
                onClick={toggleDarkMode}
                aria-label={isDarkMode ? "Light Mode" : "Dark Mode"}
              >
                {isDarkMode ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.37 5.51c-.18.64-.27 1.31-.27 1.99 0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27C17.45 17.19 14.93 19 12 19c-3.87 0-7-3.13-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* Lyrics View (conditionally rendered) */}
        <AnimatePresence>
          {showLyrics && (
            <LyricsView 
              track={currentTrack} 
              currentTime={currentTime} 
              onClose={toggleLyrics}
            />
          )}
        </AnimatePresence>
        
        {/* Bottom Navigation Bar */}
        <BottomNav 
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
          togglePlaylist={togglePlaylist}
          togglePlaylistEditor={() => setShowPlaylistEditor(!showPlaylistEditor)}
        />
      </div>
      
      {/* Playlist Drawer */}
      <AnimatePresence>
        {showPlaylist && (
          <PlaylistDrawer onClose={togglePlaylist} />
        )}
      </AnimatePresence>
      
      {/* Playlist Editor */}
      <AnimatePresence>
        {showPlaylistEditor && (
          <PlaylistEditor onClose={() => setShowPlaylistEditor(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainPlayer;
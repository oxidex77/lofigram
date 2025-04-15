// src/contexts/PlayerContext.jsx
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getSongById, songs } from '../../src/mockMusicData';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize audio when the song changes
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.file;
      audioRef.current.load();
      
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentSong]);

  useEffect(() => {
    // Handle play/pause
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    // Handle volume change
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const setupAudioEvents = () => {
    if (audioRef.current) {
      // Time update event
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current.currentTime);
      });

      // Duration change event
      audioRef.current.addEventListener('durationchange', () => {
        setDuration(audioRef.current.duration || 0);
      });

      // End of song event
      audioRef.current.addEventListener('ended', () => {
        next();
      });

      // Error event
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setIsPlaying(false);
      });
    }
  };

  useEffect(() => {
    // Setup audio element and events
    if (!audioRef.current) {
      audioRef.current = new Audio();
      setupAudioEvents();
    }

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const play = (songId) => {
    const song = getSongById(songId);
    if (song) {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (currentSong) {
      setIsPlaying(!isPlaying);
    }
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const stop = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setCurrentTime(0);
  };

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const next = () => {
    if (currentSong) {
      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
      if (currentIndex > -1 && currentIndex < songs.length - 1) {
        // Play next song
        play(songs[currentIndex + 1].id);
      } else if (songs.length > 0) {
        // Loop back to first song
        play(songs[0].id);
      }
    }
  };

  const previous = () => {
    if (currentSong) {
      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
      if (currentIndex > 0) {
        // Play previous song
        play(songs[currentIndex - 1].id);
      } else if (songs.length > 0) {
        // Loop to last song
        play(songs[songs.length - 1].id);
      }
    }
  };

  const setAudioVolume = (newVolume) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
  };

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds) return '0:00';
    
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const value = {
    currentSong,
    isPlaying,
    duration,
    currentTime,
    volume,
    play,
    togglePlay,
    pause,
    stop,
    seek,
    next,
    previous,
    setVolume: setAudioVolume,
    formatTime,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};
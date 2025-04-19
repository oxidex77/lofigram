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
  const [fallbackSongsUsed, setFallbackSongsUsed] = useState([]);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      try {
        const songFile = currentSong.file;
        
        if (!songFile) {
          console.error("Song has no file path:", currentSong.id);
          handlePlaybackError();
          return;
        }
        
        if (fallbackSongsUsed.includes(currentSong.id)) {
          console.warn("Already tried this song and failed, skipping to next:", currentSong.id);
          next();
          return;
        }
        
        audioRef.current.src = songFile;
        audioRef.current.load();
        
        if (isPlaying) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Playback failed:", error);
              handlePlaybackError();
            });
          }
        }
      } catch (error) {
        console.error("Error loading audio:", error);
        handlePlaybackError();
      }
    }
  }, [currentSong, fallbackSongsUsed]);

  useEffect(() => {
    if (audioRef.current && currentSong) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Playback failed:", error);
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlaybackError = () => {
    setIsPlaying(false);
    
    if (currentSong) {
      setFallbackSongsUsed(prev => [...prev, currentSong.id]);
      
      const validSongs = songs.filter(song => !fallbackSongsUsed.includes(song.id));
      
      if (validSongs.length > 0) {
        const randomIndex = Math.floor(Math.random() * validSongs.length);
        setTimeout(() => {
          play(validSongs[randomIndex].id);
        }, 500);
      }
    }
  };

  const setupAudioEvents = () => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current.currentTime);
      });

      audioRef.current.addEventListener('durationchange', () => {
        setDuration(audioRef.current.duration || 0);
      });

      audioRef.current.addEventListener('ended', () => {
        next();
      });

      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        
        if (audioRef.current.error) {
          const errorCodes = [
            'MEDIA_ERR_ABORTED',
            'MEDIA_ERR_NETWORK',
            'MEDIA_ERR_DECODE',
            'MEDIA_ERR_SRC_NOT_SUPPORTED'
          ];
          
          const code = audioRef.current.error.code;
          console.error(`Audio error code: ${errorCodes[code - 1] || 'Unknown'}`);
        }
        
        handlePlaybackError();
      });
    }
  };

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      setupAudioEvents();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const play = (songId) => {
    if (fallbackSongsUsed.includes(songId)) {
      console.warn("Skipping known problematic song:", songId);
      const validSongs = songs.filter(song => !fallbackSongsUsed.includes(song.id));
      if (validSongs.length > 0) {
        const randomIndex = Math.floor(Math.random() * validSongs.length);
        play(validSongs[randomIndex].id);
      }
      return;
    }

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
      let nextSong = null;
      
      for (let i = 1; i <= songs.length; i++) {
        const nextIndex = (currentIndex + i) % songs.length;
        if (!fallbackSongsUsed.includes(songs[nextIndex].id)) {
          nextSong = songs[nextIndex];
          break;
        }
      }
      
      if (nextSong) {
        play(nextSong.id);
      } else {
        setFallbackSongsUsed([]);
        if (songs.length > 0) {
          play(songs[0].id);
        }
      }
    } else if (songs.length > 0) {
      play(songs[0].id);
    }
  };

  const previous = () => {
    if (currentSong) {
      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
      let prevSong = null;
      
      for (let i = 1; i <= songs.length; i++) {
        const prevIndex = (currentIndex - i + songs.length) % songs.length;
        if (!fallbackSongsUsed.includes(songs[prevIndex].id)) {
          prevSong = songs[prevIndex];
          break;
        }
      }
      
      if (prevSong) {
        play(prevSong.id);
      } else {
        setFallbackSongsUsed([]);
        if (songs.length > 0) {
          play(songs[songs.length - 1].id);
        }
      }
    } else if (songs.length > 0) {
      play(songs[songs.length - 1].id);
    }
  };

  const setAudioVolume = (newVolume) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
  };

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return '0:00';
    
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
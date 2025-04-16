// src/contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { defaultPlaylists } from '../../src/mockMusicData';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCreatedPlaylist, setLastCreatedPlaylist] = useState(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        // Simulate loading
        setTimeout(() => {
          const storedUserName = localStorage.getItem('userName');
          const storedLikedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];
          const storedUserPlaylists = JSON.parse(localStorage.getItem('userPlaylists')) || [];
          
          if (storedUserName) {
            setUserName(storedUserName);
            setIsProfileComplete(true);
          }
          
          setLikedSongs(storedLikedSongs);
          
          // If no user playlists, initialize with default playlists
          if (storedUserPlaylists.length > 0) {
            // Make sure each playlist has songs array defined
            const validatedPlaylists = storedUserPlaylists.map(playlist => ({
              ...playlist,
              songs: Array.isArray(playlist.songs) ? playlist.songs : []
            }));
            setUserPlaylists(validatedPlaylists);
          } else {
            // Ensure default playlists have songs array defined
            const validatedDefaults = defaultPlaylists.map(playlist => ({
              ...playlist,
              songs: Array.isArray(playlist.songs) ? playlist.songs : []
            }));
            setUserPlaylists(validatedDefaults);
            localStorage.setItem('userPlaylists', JSON.stringify(validatedDefaults));
          }
          
          setIsLoading(false);
        }, 1000); // Reduced delay for better UX but still allow for animations
      } catch (error) {
        console.error('Error loading user data:', error);
        // Provide fallback default data
        setUserPlaylists(defaultPlaylists.map(playlist => ({
          ...playlist,
          songs: Array.isArray(playlist.songs) ? playlist.songs : []
        })));
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Save user data to localStorage when it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('userName', userName);
      localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
      localStorage.setItem('userPlaylists', JSON.stringify(userPlaylists));
    }
  }, [userName, likedSongs, userPlaylists, isLoading]);

  const completeProfile = (name) => {
    setUserName(name);
    setIsProfileComplete(true);
  };

  const toggleLikeSong = (songId) => {
    setLikedSongs(prev => {
      if (prev.includes(songId)) {
        return prev.filter(id => id !== songId);
      } else {
        return [...prev, songId];
      }
    });
  };

  const isSongLiked = (songId) => {
    return likedSongs.includes(songId);
  };

  const createPlaylist = (playlistName) => {
    // Generate a unique ID with a timestamp
    const playlistId = `playlist-${Date.now()}`;
    
    const newPlaylist = {
      id: playlistId,
      title: playlistName,
      cover: '/assets/album-covers/playlist.jpeg', // Default cover
      songs: []
    };
    
    setUserPlaylists(prev => [...prev, newPlaylist]);
    
    // Save immediately to localStorage for better consistency
    try {
      const updatedPlaylists = [...userPlaylists, newPlaylist];
      localStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists));
    } catch (error) {
      console.error('Error saving playlist:', error);
    }
    
    // Track the last created playlist for feedback
    setLastCreatedPlaylist({
      id: playlistId,
      title: playlistName,
      timestamp: Date.now()
    });
    
    return playlistId;
  };

  const deletePlaylist = (playlistId) => {
    setUserPlaylists(prev => {
      const updatedPlaylists = prev.filter(playlist => playlist.id !== playlistId);
      
      // Save immediately to localStorage
      try {
        localStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists));
      } catch (error) {
        console.error('Error saving after deletion:', error);
      }
      
      return updatedPlaylists;
    });
  };

  const addSongToPlaylist = (playlistId, songId) => {
    if (!playlistId || !songId) {
      console.error('Missing playlistId or songId in addSongToPlaylist');
      return;
    }
    
    setUserPlaylists(prev => {
      const updatedPlaylists = prev.map(playlist => {
        if (playlist.id === playlistId && !playlist.songs.includes(songId)) {
          return {
            ...playlist,
            songs: [...(playlist.songs || []), songId]
          };
        }
        return playlist;
      });
      
      // Save immediately to localStorage
      try {
        localStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists));
      } catch (error) {
        console.error('Error saving after adding song:', error);
      }
      
      return updatedPlaylists;
    });
  };

  const removeSongFromPlaylist = (playlistId, songId) => {
    if (!playlistId || !songId) {
      console.error('Missing playlistId or songId in removeSongFromPlaylist');
      return;
    }
    
    setUserPlaylists(prev => {
      const updatedPlaylists = prev.map(playlist => {
        if (playlist.id === playlistId) {
          return {
            ...playlist,
            songs: (playlist.songs || []).filter(id => id !== songId)
          };
        }
        return playlist;
      });
      
      // Save immediately to localStorage
      try {
        localStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists));
      } catch (error) {
        console.error('Error saving after removing song:', error);
      }
      
      return updatedPlaylists;
    });
  };

  const clearLastCreatedPlaylist = () => {
    setLastCreatedPlaylist(null);
  };

  const value = {
    userName,
    isProfileComplete,
    likedSongs,
    userPlaylists,
    isLoading,
    lastCreatedPlaylist,
    completeProfile,
    toggleLikeSong,isSongLiked,
    createPlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    clearLastCreatedPlaylist
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
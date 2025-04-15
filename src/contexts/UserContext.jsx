// src/contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { defaultPlaylists } from '../../src/mockMusicData'

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
            setUserPlaylists(storedUserPlaylists);
          } else {
            setUserPlaylists(defaultPlaylists);
            localStorage.setItem('userPlaylists', JSON.stringify(defaultPlaylists));
          }
          
          setIsLoading(false);
        }, 1500); // Simulate loading delay for nice animation experience
      } catch (error) {
        console.error('Error loading user data:', error);
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
    const newPlaylist = {
      id: `playlist-${Date.now()}`,
      title: playlistName,
      cover: '/assets/album-covers/cotton-candy-dreams.png', // Default cover
      songs: []
    };
    
    setUserPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist.id;
  };

  const deletePlaylist = (playlistId) => {
    setUserPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
  };

  const addSongToPlaylist = (playlistId, songId) => {
    setUserPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId && !playlist.songs.includes(songId)) {
        return {
          ...playlist,
          songs: [...playlist.songs, songId]
        };
      }
      return playlist;
    }));
  };

  const removeSongFromPlaylist = (playlistId, songId) => {
    setUserPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          songs: playlist.songs.filter(id => id !== songId)
        };
      }
      return playlist;
    }));
  };

  const value = {
    userName,
    isProfileComplete,
    likedSongs,
    userPlaylists,
    isLoading,
    completeProfile,
    toggleLikeSong,
    isSongLiked,
    createPlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
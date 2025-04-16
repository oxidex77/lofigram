// src/contexts/AppContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getSongsByAlbum, 
  getSongsByArtist, 
  getAlbumById, 
  getArtistById,
  getSongById,
  defaultPlaylists
} from '../../src/mockMusicData';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('loading'); // loading, profile, home, player
  const [activeTab, setActiveTab] = useState('songs'); // songs, albums, artists, liked, playlists, filtered
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(true);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedPlaylistForAdd, setSelectedPlaylistForAdd] = useState(null);
  const [theme, setTheme] = useState('pastel'); // pastel, night, cozy, dark
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [filterTitle, setFilterTitle] = useState('');
  const [filterType, setFilterType] = useState(''); // 'album', 'artist', 'playlist'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [filterItemDetails, setFilterItemDetails] = useState(null); // For storing album/artist/playlist details
  const [userPlaylists, setUserPlaylists] = useState([]);

  // Load playlists on init
  useEffect(() => {
    // Try to get saved playlists from localStorage
    const savedPlaylists = localStorage.getItem('userPlaylists');
    if (savedPlaylists) {
      try {
        const parsed = JSON.parse(savedPlaylists);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUserPlaylists(parsed);
          return;
        }
      } catch (e) {
        console.error("Error parsing saved playlists:", e);
      }
    }
    
    // Fall back to default playlists
    setUserPlaylists(defaultPlaylists);
  }, []);

  // Apply theme on change
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (themeName) => {
    // Set theme colors and styles
    const bodyEl = document.body;
    
    switch(themeName) {
      case 'night':
        bodyEl.style.backgroundColor = '#171626';
        bodyEl.classList.add('dark-theme');
        break;
      case 'cozy':
        bodyEl.style.backgroundColor = '#f8e9d6';
        bodyEl.classList.remove('dark-theme');
        break;
      case 'dark':
        bodyEl.style.backgroundColor = '#0f0f17';
        bodyEl.classList.add('dark-theme');
        break;
      default: // pastel
        bodyEl.style.backgroundColor = '#fcf1f7';
        bodyEl.classList.remove('dark-theme');
    }
  };

  const navigateTo = (screen) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(screen);
      setIsTransitioning(false);
    }, 400);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    // Clear any filtered content when switching tabs
    if (tab !== 'filtered') {
      setFilteredSongs([]);
      setFilterTitle('');
      setFilterType('');
      setFilterItemDetails(null);
    }
  };

  const togglePlayerView = () => {
    setIsPlayerMinimized(!isPlayerMinimized);
  };

  const maximizePlayer = () => {
    setIsPlayerMinimized(false);
  };

  const minimizePlayer = () => {
    setIsPlayerMinimized(true);
  };

  const togglePlaylistModal = (songId = null) => {
    setShowPlaylistModal(!showPlaylistModal);
    setSelectedPlaylistForAdd(songId);
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const filterSongsByAlbum = (albumId) => {
    const album = getAlbumById(albumId);
    if (!album) return;
    
    const songs = getSongsByAlbum(albumId);
    setFilteredSongs(songs);
    setFilterTitle(album.title);
    setFilterType('album');
    setFilterItemDetails(album);
    setActiveTab('filtered');
  };

  const filterSongsByArtist = (artistId) => {
    const artist = getArtistById(artistId);
    if (!artist) return;
    
    const songs = getSongsByArtist(artistId);
    setFilteredSongs(songs);
    setFilterTitle(artist.name);
    setFilterType('artist');
    setFilterItemDetails(artist);
    setActiveTab('filtered');
  };

  const filterSongsByPlaylist = (playlistId) => {
    // Find the playlist in our state or default playlists
    const playlist = userPlaylists.find(p => p.id === playlistId);
    
    if (playlist) {
      // Get the actual song objects from the IDs
      const playlistSongs = playlist.songs
        .map(songId => getSongById(songId))
        .filter(Boolean); // Filter out any undefined songs
        
      setFilteredSongs(playlistSongs);
      setFilterTitle(playlist.title);
      setFilterType('playlist');
      setFilterItemDetails(playlist);
      setActiveTab('filtered');
    } else {
      console.error("Playlist not found:", playlistId);
    }
  };

  const clearFilter = () => {
    setFilteredSongs([]);
    setFilterTitle('');
    setFilterType('');
    setFilterItemDetails(null);
    setActiveTab('songs');
  };

  const value = {
    currentScreen,
    activeTab,
    isPlayerMinimized,
    showPlaylistModal,
    selectedPlaylistForAdd,
    theme,
    filteredSongs,
    filterTitle,
    filterType,
    filterItemDetails,
    isTransitioning,
    userPlaylists,
    navigateTo,
    switchTab,
    togglePlayerView,
    maximizePlayer,
    minimizePlayer,
    togglePlaylistModal,
    changeTheme,
    setFilteredSongs,
    filterSongsByAlbum,
    filterSongsByArtist,
    filterSongsByPlaylist,
    clearFilter,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
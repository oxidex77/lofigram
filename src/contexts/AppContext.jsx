// src/contexts/AppContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { getSongsByAlbum, getSongsByArtist, getAlbumById, getArtistById } from '../../src/mockMusicData';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('loading'); // loading, profile, home, player
  const [activeTab, setActiveTab] = useState('songs'); // songs, albums, artists, liked, playlists, filtered
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(true);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedPlaylistForAdd, setSelectedPlaylistForAdd] = useState(null);
  const [theme, setTheme] = useState('pastel'); // pastel, night, cozy, beach
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [filterTitle, setFilterTitle] = useState('');
  const [filterType, setFilterType] = useState(''); // 'album' or 'artist'
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    const songs = getSongsByAlbum(albumId);
    setFilteredSongs(songs);
    setFilterTitle(album.title);
    setFilterType('album');
    setActiveTab('filtered');
  };

  const filterSongsByArtist = (artistId) => {
    const artist = getArtistById(artistId);
    const songs = getSongsByArtist(artistId);
    setFilteredSongs(songs);
    setFilterTitle(artist.name);
    setFilterType('artist');
    setActiveTab('filtered');
  };

  const clearFilter = () => {
    setFilteredSongs([]);
    setFilterTitle('');
    setFilterType('');
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
    isTransitioning,
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
    clearFilter,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
// src/contexts/AppContext.jsx
import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('loading'); // loading, profile, home, player
  const [activeTab, setActiveTab] = useState('songs'); // songs, albums, artists, liked, playlists
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(true);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedPlaylistForAdd, setSelectedPlaylistForAdd] = useState(null);
  const [theme, setTheme] = useState('pastel'); // pastel, night, etc.

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
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

  const togglePlaylistModal = (playlistId = null) => {
    setShowPlaylistModal(!showPlaylistModal);
    setSelectedPlaylistForAdd(playlistId);
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const value = {
    currentScreen,
    activeTab,
    isPlayerMinimized,
    showPlaylistModal,
    selectedPlaylistForAdd,
    theme,
    navigateTo,
    switchTab,
    togglePlayerView,
    maximizePlayer,
    minimizePlayer,
    togglePlaylistModal,
    changeTheme,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
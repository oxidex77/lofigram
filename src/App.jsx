// src/App.jsx
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './contexts/AppContext';
import { UserProvider } from './contexts/UserContext';
import { PlayerProvider, usePlayer } from './contexts/PlayerContext';

// Screens
import LoadingScreen from './components/screens/LoadingScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import HomeScreen from './components/screens/HomeScreen';
import PlayerScreen from './components/screens/PlayerScreen';

import './App.css';

// Main App content component
const AppContent = () => {
  const { currentScreen, isPlayerMinimized } = useApp();
  const { currentSong } = usePlayer();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'loading':
        return <LoadingScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'home':
        return <HomeScreen />;
      default:
        return <LoadingScreen />;
    }
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>

      <AnimatePresence>
        {currentSong && !isPlayerMinimized && <PlayerScreen />}
      </AnimatePresence>
    </div>
  );
};

// Main App component with all providers
function App() {
  return (
    <AppProvider>
      <UserProvider>
        <PlayerProvider>
          <AppContent />
        </PlayerProvider>
      </UserProvider>
    </AppProvider>
  );
}

export default App;
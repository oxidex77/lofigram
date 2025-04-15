// src/App.jsx
// Update your App.jsx with these improved transitions

import React, { useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './contexts/AppContext';
import { UserProvider } from './contexts/UserContext';
import { PlayerProvider, usePlayer } from './contexts/PlayerContext';

// Import screens
import LoadingScreen from './components/screens/LoadingScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import HomeScreen from './components/screens/HomeScreen';
import PlayerScreen from './components/screens/PlayerScreen';

import './App.css';

// Main App content component with improved transitions
const AppContent = () => {
  const { currentScreen, isPlayerMinimized } = useApp();
  const { currentSong } = usePlayer();
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  // Track if app is ready for smooth transitions
  const [isAppReady, setIsAppReady] = useState(false);

  // Check for mobile and low-end devices
  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check if device is low-end
    const checkDeviceCapability = () => {
      // Using navigator.deviceMemory if available (Chrome)
      const lowMemory = navigator.deviceMemory !== undefined && navigator.deviceMemory < 4;
      
      // Using hardwareConcurrency as a CPU indicator
      const lowCPU = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4;
      
      // Mobile + (Low memory OR Low CPU) = Low-end device
      setIsLowEndDevice(isMobile && (lowMemory || lowCPU));
    };
    
    checkMobile();
    checkDeviceCapability();
    
    // Apply optimizations for mobile
    if (isMobile) {
      document.body.classList.add('reduce-motion');
      
      // If very low-end device, further optimize
      if (isLowEndDevice) {
        document.body.classList.add('minimal-animations');
      }
    } else {
      document.body.classList.remove('reduce-motion', 'minimal-animations');
    }
    
    // Debounced resize handler
    const handleResize = () => {
      // Wait a small amount of time before updating
      if (!window.resizeTimer) {
        window.resizeTimer = setTimeout(() => {
          window.resizeTimer = null;
          checkMobile();
        }, 250);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Mark app as ready for animations after a short delay
    const readyTimer = setTimeout(() => {
      setIsAppReady(true);
    }, 100);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.resizeTimer) {
        clearTimeout(window.resizeTimer);
      }
      clearTimeout(readyTimer);
    };
  }, [isMobile, isLowEndDevice]);

  // Use a key for AnimatePresence to force clean transitions between screens
  const getScreenKey = () => {
    return `screen-${currentScreen}-${Date.now()}`;
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'loading':
        return <LoadingScreen key="loading-screen" />;
      case 'profile':
        return <ProfileScreen key="profile-screen" />;
      case 'home':
        return <HomeScreen key="home-screen" />;
      default:
        return <LoadingScreen key="default-screen" />;
    }
  };

  return (
    <div className={`app-container ${isMobile ? 'mobile-app' : ''} ${isLowEndDevice ? 'low-end-device' : ''}`}>
      {/* Main screen transitions - using custom mode and key to force clean transitions */}
      <AnimatePresence mode="wait" initial={false}>
        {renderScreen()}
      </AnimatePresence>

      {/* Player screen with improved transitions */}
      <AnimatePresence>
        {currentSong && !isPlayerMinimized && (
          <PlayerScreen 
            key="player-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.25, 0.1, 0.25, 1.0] 
            }}
          />
        )}
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
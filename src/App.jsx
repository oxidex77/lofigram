import React, { useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './contexts/AppContext';
import { UserProvider } from './contexts/UserContext';
import { PlayerProvider, usePlayer } from './contexts/PlayerContext';

import LoadingScreen from './components/screens/LoadingScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import HomeScreen from './components/screens/HomeScreen';
import PlayerScreen from './components/screens/PlayerScreen';

import './App.css';

const AppContent = () => {
  const { currentScreen, isPlayerMinimized, isTransitioning } = useApp();
  const { currentSong } = usePlayer();
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    if (isTransitioning) {
      document.body.classList.add('transitioning');
    } else {
      document.body.classList.remove('transitioning');
    }

    return () => {
      document.body.classList.remove('transitioning');
    };
  }, [isTransitioning]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const checkDeviceCapability = () => {
      const lowMemory = navigator.deviceMemory !== undefined && navigator.deviceMemory < 4;

      const lowCPU = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4;

      setIsLowEndDevice(isMobile && (lowMemory || lowCPU));
    };

    checkMobile();
    checkDeviceCapability();

    if (isMobile) {
      document.body.classList.add('reduce-motion');

      if (isLowEndDevice) {
        document.body.classList.add('minimal-animations');
      }
    } else {
      document.body.classList.remove('reduce-motion', 'minimal-animations');
    }

    const handleResize = () => {
      if (!window.resizeTimer) {
        window.resizeTimer = setTimeout(() => {
          window.resizeTimer = null;
          checkMobile();
        }, 250);
      }
    };

    window.addEventListener('resize', handleResize);

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
      <AnimatePresence mode="wait" initial={false}>
        {renderScreen()}
      </AnimatePresence>

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
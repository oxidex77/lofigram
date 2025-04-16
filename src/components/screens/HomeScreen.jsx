// src/components/screens/HomeScreen.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import { useUser } from '../../contexts/UserContext';
import { pageTransition } from '../../animations/animations';
import TabNavigation from '../layout/TabNavigation';
import MiniPlayer from '../player/MiniPlayer';
import SongsTab from './tabs/SongsTab';
import AlbumsTab from './tabs/AlbumsTab';
import ArtistsTab from './tabs/ArtistsTab';
import LikedTab from './tabs/LikedTab';
import PlaylistsTab from './tabs/PlaylistsTab';
import FilteredTab from './tabs/FilteredTab';
import AddToPlaylistModal from '../modals/AddToPlaylistModal';

const HomeScreen = () => {
  const { activeTab, showPlaylistModal, theme, isTransitioning } = useApp();
  const { userName } = useUser();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'songs':
        return <SongsTab />;
      case 'albums':
        return <AlbumsTab />;
      case 'artists':
        return <ArtistsTab />;
      case 'liked':
        return <LikedTab />;
      case 'playlists':
        return <PlaylistsTab />;
      case 'filtered':
        return <FilteredTab />;
      default:
        return <SongsTab />;
    }
  };

  const getHeaderBackground = () => {
    if (theme === 'night') return 'bg-gray-900 bg-opacity-60';
    if (theme === 'cozy') return 'bg-amber-50 bg-opacity-60';
    if (theme === 'dark') return 'bg-gray-900 bg-opacity-60';
    return 'bg-white bg-opacity-60';
  };

  const getTabsBackground = () => {
    if (theme === 'night') return 'bg-gray-900 bg-opacity-50';
    if (theme === 'cozy') return 'bg-amber-50 bg-opacity-50';
    if (theme === 'dark') return 'bg-gray-900 bg-opacity-50';
    return 'bg-white bg-opacity-50';
  };
  
  const getBackground = () => {
    if (theme === 'night') return 'bg-gradient-to-br from-indigo-900 to-purple-900';
    if (theme === 'cozy') return 'bg-gradient-to-br from-amber-100 to-orange-200';
    if (theme === 'dark') return 'bg-gradient-to-br from-gray-900 to-purple-900';
    return 'bg-gradient-to-br from-pink-100 to-purple-200';
  };

  const getTextColor = () => {
    if (theme === 'night' || theme === 'dark') return 'text-purple-300';
    return 'text-purple-700';
  };

  const getGradientText = () => {
    if (theme === 'night' || theme === 'dark') return 'text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300';
    return 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600';
  };

  return (
    <motion.div 
      className={`flex flex-col min-h-screen ${getBackground()}`}
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Top bar with name, logo, and mascot */}
      <div className={`sticky top-0 z-20 ${getHeaderBackground()} backdrop-filter backdrop-blur-lg shadow-sm px-4 py-3`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* <motion.img 
              src="/assets/characters/rainy.png" 
              alt="Mascot" 
              className="w-14 h-14 object-contain mr-3 hidden sm:block"
              whileHover={{ scale: 1.1, rotate: [0, -5, 0, 5, 0] }}
              transition={{ duration: 0.5 }}
            /> */}
            <div>
              <h1 className={`text-2xl font-bold ${getGradientText()} font-display`}>
                Lofigram
              </h1>
              <p className={`text-xs ${getTextColor()}`}>
                Welcome back, {userName}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <motion.img 
              src="/assets/characters/rainy.png" 
              alt="Mascot" 
              className="w-12 h-12 object-contain mr-3 hidden sm:block"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white text-lg font-medium shadow-md"
            >
              {userName.charAt(0).toUpperCase()}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`sticky top-16 z-10 ${getTabsBackground()} backdrop-filter backdrop-blur-md`}>
        <TabNavigation />
      </div>

      {/* Tab Content */}
      <div className="flex-grow overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mini Player */}
      <MiniPlayer />

      {/* Add to Playlist Modal */}
      <AnimatePresence>
        {showPlaylistModal && <AddToPlaylistModal />}
      </AnimatePresence>

      {/* Screen Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div 
            className="fixed inset-0 bg-black z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Background decorative elements */}
      <motion.div 
        className={`fixed top-1/4 right-0 w-24 h-24 ${theme === 'night' || theme === 'dark' ? 'bg-indigo-500' : 'bg-pink-200'} rounded-full blur-3xl opacity-30 z-0`}
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      <motion.div 
        className={`fixed bottom-1/3 left-0 w-32 h-32 ${theme === 'night' || theme === 'dark' ? 'bg-purple-500' : 'bg-purple-200'} rounded-full blur-3xl opacity-30 z-0`}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />

      {/* Small mascot decoration */}
      <motion.div
        className="fixed bottom-24 right-4 w-16 h-16 z-10 hidden md:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {/* <motion.img
          src="/assets/characters/rainy.png"
          alt="Decorative Mascot"
          className="w-full h-full object-contain"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        /> */}
      </motion.div>
    </motion.div>
  );
};

export default HomeScreen;
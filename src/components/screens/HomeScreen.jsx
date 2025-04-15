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
import AddToPlaylistModal from '../modals/AddToPlaylistModal';

const HomeScreen = () => {
  const { activeTab, showPlaylistModal } = useApp();
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
      default:
        return <SongsTab />;
    }
  };

  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-gradient-to-br from-pink-100 to-purple-200"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Top bar with name and logo */}
      <div className="sticky top-0 z-20 bg-white bg-opacity-60 backdrop-filter backdrop-blur-lg shadow-sm px-4 py-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-purple-700">Lofigram</h1>
            <p className="text-xs text-purple-500">Welcome back, {userName}</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white text-lg font-medium shadow-md"
          >
            {userName.charAt(0).toUpperCase()}
          </motion.div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-16 z-10 bg-white bg-opacity-50 backdrop-filter backdrop-blur-md">
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

      {/* Background decorative elements */}
      <motion.div 
        className="fixed top-1/4 right-0 w-24 h-24 bg-pink-200 rounded-full blur-3xl opacity-30 z-0"
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      <motion.div 
        className="fixed bottom-1/3 left-0 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-30 z-0"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
    </motion.div>
  );
};

export default HomeScreen;
// src/components/layout/TabNavigation.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';

const TabNavigation = () => {
  const { activeTab, switchTab, theme } = useApp();
  
  const tabs = [
    { id: 'songs', label: 'Songs' },
    { id: 'albums', label: 'Albums' },
    { id: 'artists', label: 'Artists' },
    { id: 'liked', label: 'Liked' },
    { id: 'playlists', label: 'Playlists' }
  ];

  const getActiveTabStyle = () => {
    return 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-md';
  };

  const getInactiveTabStyle = () => {
    if (theme === 'night') return 'bg-gray-800 bg-opacity-50 text-gray-300 hover:bg-opacity-70';
    return 'bg-white bg-opacity-50 text-purple-700 hover:bg-opacity-70';
  };

  return (
    <div className="flex overflow-x-auto scrollbar-hide py-4 px-1 w-full">
      <div className="flex space-x-2 mx-auto">
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? getActiveTabStyle()
                : getInactiveTabStyle()
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-500"
                layoutId="tabIndicator"
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
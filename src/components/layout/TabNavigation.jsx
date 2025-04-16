// src/components/layout/TabNavigation.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';

const TabNavigation = () => {
  const { activeTab, switchTab, theme } = useApp();
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if it's a mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Hide scroll hint after user interaction
    const hideHint = () => {
      setShowScrollHint(false);
    };
    
    // Set a timer to hide the hint after 7 seconds
    const timer = setTimeout(() => {
      setShowScrollHint(false);
    }, 7000);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);
  
  // Handle scroll event
  const handleScroll = () => {
    setShowScrollHint(false);
  };
  
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
    <div className="relative">
      <div 
        className="flex overflow-x-auto scrollbar-hide py-4 px-1 w-full"
        onScroll={handleScroll}
      >
        <div className="flex space-x-2 mx-auto">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => {
                switchTab(tab.id);
                setShowScrollHint(false);
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? getActiveTabStyle()
                  : getInactiveTabStyle()
              }`}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Scroll hint - only visible on mobile */}
      {showScrollHint && isMobile && (
        <motion.div 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10"
          initial={{ opacity: 0, x: 10 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            x: [10, 0, 0, -10]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        >
          <div className="flex items-center">
            <div className="mr-1 text-xs text-purple-600 font-medium opacity-80">
              Swipe
            </div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-purple-600 opacity-80"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TabNavigation;
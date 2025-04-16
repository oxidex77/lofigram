// src/components/screens/HomeScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
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
// Import your mock data directly with the correct variable names
import { songs, albums, artists, getArtistById, getAlbumById } from '../../../src/mockMusicData';

const HomeScreen = () => {
    const {
        activeTab,
        showPlaylistModal,
        theme,
        isTransitioning,
        changeTheme,
        setFilteredSongs,
        setFilterTitle,
        setFilterType,
        switchTab
    } = useApp();
    const { userName } = useUser();
    const [showThemeSelector, setShowThemeSelector] = useState(false);
    const [prevTheme, setPrevTheme] = useState(theme);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);

    // Theme options
    const themes = [
        { id: 'pastel', name: 'Pastel', emoji: '🌸' },
        { id: 'night', name: 'Night', emoji: '🌙' },
        { id: 'cozy', name: 'Cozy', emoji: '☕' },
        { id: 'dark', name: 'Dark', emoji: '✨' },
    ];

    useEffect(() => {
        // Only search if there's text and search bar is open
        if (searchQuery.trim() && showSearch) {
            // Debounce the search to avoid too many updates
            const searchTimer = setTimeout(() => {
                performRealTimeSearch(searchQuery);
            }, 300); // Wait 300ms for user to finish typing

            return () => clearTimeout(searchTimer);
        } else if (!searchQuery.trim() && activeTab === 'filtered') {
            // If search is cleared but we're still on filtered tab, return to default tab
            switchTab('songs');
        }
    }, [searchQuery]);

    // Track previous theme for smooth transitions
    useEffect(() => {
        setPrevTheme(theme);
    }, [theme]);

    // Focus search input when search is shown
    useEffect(() => {
        if (showSearch && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [showSearch]);

    const handleThemeChange = (newTheme) => {
        setPrevTheme(theme);
        changeTheme(newTheme);
        setShowThemeSelector(false);
    };

    // // Search functionality
    // const handleSearch = (e) => {
    //     e.preventDefault();
    //     if (searchQuery.trim()) {
    //         // Using existing filtering functionality from AppContext
    //         performSearch(searchQuery);
    //     }
    // };

    const handleSearch = (e) => {
        if (e) e.preventDefault();

        // When form is submitted, you might want to close the search input
        if (searchQuery.trim()) {
            setShowSearch(false);
        }
    };

    const performRealTimeSearch = (query) => {
        if (!query.trim()) return;

        // Search across songs, albums, and artists (case-insensitive)
        const searchTerm = query.toLowerCase();

        // Find all matching songs across titles, artist names, and album titles
        const results = songs.filter(song =>
            song.title.toLowerCase().includes(searchTerm) ||
            getArtistById(song.artist)?.name.toLowerCase().includes(searchTerm) ||
            getAlbumById(song.album)?.title.toLowerCase().includes(searchTerm)
        );

        // Update filtered songs
        setFilteredSongs(results);

        // Switch to filtered tab to show results (only if not already there)
        if (activeTab !== 'filtered') {
            switchTab('filtered');
        }
    };

    //   // Then modify the original handleSearch function to handle form submission
    //   const handleSearch = (e) => {
    //     if (e) e.preventDefault();

    //     // When form is submitted, you might want to close the search input
    //     if (searchQuery.trim()) {
    //       setShowSearch(false);
    //     }
    //   };
    // Search implementation using existing AppContext filtering functions
    // Search implementation using only the essential AppContext functions
    const performSearch = (query) => {
        if (!query.trim()) return;

        // Search across songs, albums, and artists (case-insensitive)
        const searchTerm = query.toLowerCase();

        // Find all matching songs across titles, artist names, and album titles
        const results = songs.filter(song =>
            song.title.toLowerCase().includes(searchTerm) ||
            getArtistById(song.artist)?.name.toLowerCase().includes(searchTerm) ||
            getAlbumById(song.album)?.title.toLowerCase().includes(searchTerm)
        );

        // Use only the setFilteredSongs function which definitely exists
        setFilteredSongs(results);

        // Switch to the filtered tab to show results
        switchTab('filtered');

        // Close search input
        setShowSearch(false);
    };

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

    // Modify the getBackground function to return consistent class names
    const getBackground = () => {
        // Apply a base class first
        const baseClass = 'bg-gradient-to-br transition-colors duration-700 ease-in-out';

        // Only transition the color values
        if (theme === 'night') return `${baseClass} from-indigo-900 to-purple-900`;
        if (theme === 'cozy') return `${baseClass} from-amber-100 to-orange-200`;
        if (theme === 'dark') return `${baseClass} from-gray-900 to-purple-900`;
        return `${baseClass} from-pink-100 to-purple-200`;
    };
    const getTextColor = () => {
        if (theme === 'night' || theme === 'dark') return 'text-purple-300';
        return 'text-purple-700';
    };

    const getGradientText = () => {
        if (theme === 'night' || theme === 'dark') return 'text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300';
        return 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600';
    };

    const getSearchBgColor = () => {
        if (theme === 'night' || theme === 'dark') return 'bg-gray-800 bg-opacity-70';
        return 'bg-white bg-opacity-70';
    };

    const getSearchTextColor = () => {
        if (theme === 'night' || theme === 'dark') return 'text-gray-200 placeholder-gray-400';
        return 'text-purple-700 placeholder-purple-300';
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
            <div className={`sticky top-0 z-20 ${getHeaderBackground()} backdrop-filter backdrop-blur-lg shadow-sm px-4 py-3 transition-colors duration-700 ease-in-out`}>
                <div className="flex justify-between items-center">
                    {/* Logo section - shrink when search is expanded */}
                    <div className={`flex items-center ${showSearch ? 'w-0 overflow-hidden md:w-auto md:overflow-visible' : ''}`}>
                        <div>
                            <h1 className={`text-2xl font-bold ${getGradientText()} font-display transition-colors duration-700 ease-in-out`}>
                                Lofigram
                            </h1>
                            <p className={`text-xs ${getTextColor()} transition-colors duration-700 ease-in-out`}>
                                Welcome back, {userName}
                            </p>
                        </div>
                    </div>

                    {/* Search form - Expanded on mobile or when active */}
                    <AnimatePresence mode="wait">
                        {showSearch ? (
                            <motion.form
                                className="flex-1 mx-3"
                                initial={{ opacity: 0, width: "0%" }}
                                animate={{ opacity: 1, width: "100%" }}
                                exit={{ opacity: 0, width: "0%" }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleSearch}
                            >
                                <div className="relative flex items-center">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search music..."
                                        className={`w-full py-2 px-10 rounded-full ${getSearchBgColor()} ${getSearchTextColor()} focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors duration-700 ease-in-out`}
                                    />
                                    {/* Search icon */}
                                    <svg
                                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${getTextColor()}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>

                                    {/* Close search button */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowSearch(false);
                                            setSearchQuery('');
                                        }}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        <svg
                                            className={`w-5 h-5 ${getTextColor()}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </motion.form>
                        ) : (
                            <div className="hidden md:flex md:flex-1 md:justify-center">
                                {/* Search button for desktop */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowSearch(true)}
                                    className={`relative w-48 py-1.5 px-4 pl-9 text-sm rounded-full ${getSearchBgColor()} ${getSearchTextColor()} text-left transition-colors duration-700 ease-in-out`}
                                >
                                    <svg
                                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${getTextColor()}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Search music...
                                </motion.button>
                            </div>
                        )}
                    </AnimatePresence>

                    <div className="flex items-center space-x-2">
                        {/* Search toggle for mobile */}
                        {!showSearch && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowSearch(true)}
                                className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center ${theme === 'night' || theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white bg-opacity-50 text-gray-700'} transition-colors duration-700 ease-in-out`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </motion.button>
                        )}

                        {/* Theme selector toggle button (visible on mobile when search is not active) */}
                        {!showSearch && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowThemeSelector(!showThemeSelector)}
                                className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center ${theme === 'night' || theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white bg-opacity-50 text-gray-700'} transition-colors duration-700 ease-in-out`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                            </motion.button>
                        )}

                        {/* Theme buttons (hidden on mobile, always visible on desktop) */}
                        <div className="hidden md:flex space-x-1">
                            {themes.map((t) => (
                                <motion.button
                                    key={t.id}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-base ${theme === t.id
                                        ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-md'
                                        : `${theme === 'night' || theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white bg-opacity-50 text-gray-700'}`
                                        } transition-all duration-500 ease-in-out`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleThemeChange(t.id)}
                                >
                                    {t.emoji}
                                </motion.button>
                            ))}
                        </div>

                        {/* User avatar */}
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

            {/* Mobile Theme Selector (slides down when activated) */}
            <AnimatePresence>
                {showThemeSelector && (
                    <motion.div
                        className={`md:hidden sticky top-16 z-15 ${getHeaderBackground()} backdrop-filter backdrop-blur-lg px-4 py-2 transition-colors duration-700 ease-in-out`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex justify-center space-x-3 py-2">
                            {themes.map((t) => (
                                <motion.button
                                    key={t.id}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${theme === t.id
                                        ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-md'
                                        : `${theme === 'night' || theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white bg-opacity-50 text-gray-700'}`
                                        } transition-all duration-500 ease-in-out`}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleThemeChange(t.id)}
                                >
                                    {t.emoji}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tab Navigation */}
            <div className={`sticky ${showThemeSelector ? 'top-32' : 'top-16'} z-10 ${getTabsBackground()} backdrop-filter backdrop-blur-md transition-colors duration-700 ease-in-out`}>
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
                className={`fixed top-1/4 right-0 w-24 h-24 ${theme === 'night' || theme === 'dark' ? 'bg-indigo-500' : 'bg-pink-200'} rounded-full blur-3xl opacity-30 z-0 transition-colors duration-700 ease-in-out`}
                initial={{ x: 100 }}
                animate={{ x: 0 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
            <motion.div
                className={`fixed bottom-1/3 left-0 w-32 h-32 ${theme === 'night' || theme === 'dark' ? 'bg-purple-500' : 'bg-purple-200'} rounded-full blur-3xl opacity-30 z-0 transition-colors duration-700 ease-in-out`}
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
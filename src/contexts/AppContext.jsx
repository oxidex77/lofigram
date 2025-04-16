// src/contexts/AppContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import {
    getSongsByAlbum,
    getSongsByArtist,
    getAlbumById,
    getArtistById,
    getSongById,
    defaultPlaylists
} from '../../src/mockMusicData'; // Ensure this path is correct relative to AppContext.jsx

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [currentScreen, setCurrentScreen] = useState('loading'); // loading, profile, home, player
    const [activeTab, setActiveTab] = useState('songs'); // songs, albums, artists, liked, playlists, filtered
    const [isPlayerMinimized, setIsPlayerMinimized] = useState(true);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [selectedPlaylistForAdd, setSelectedPlaylistForAdd] = useState(null);
    const [theme, setTheme] = useState('pastel'); // pastel, night, cozy, dark
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [filterTitle, setFilterTitle] = useState('');
    const [filterType, setFilterType] = useState(''); // 'album', 'artist', 'playlist', 'search'
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [filterItemDetails, setFilterItemDetails] = useState(null); // For storing album/artist/playlist details
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [lastPlaylistAction, setLastPlaylistAction] = useState({
        type: null, // 'created', 'deleted', 'updated'
        playlistId: null,
        playlistName: null,
        timestamp: null
    });

    // Load playlists on init
    useEffect(() => {
        const savedPlaylists = localStorage.getItem('userPlaylists');
        if (savedPlaylists) {
            try {
                const parsed = JSON.parse(savedPlaylists);
                // Basic validation: check if it's an array
                if (Array.isArray(parsed)) {
                    setUserPlaylists(parsed);
                    return; // Exit if loaded successfully
                } else {
                     console.warn("Saved playlists data is not an array, using default.");
                }
            } catch (e) {
                console.error("Error parsing saved playlists, using default:", e);
            }
        }
        // Fallback or if localStorage is empty/invalid
        setUserPlaylists(defaultPlaylists);
    }, []);

     // Save playlists to localStorage whenever they change
    useEffect(() => {
        // Avoid saving the initial default playlists if localStorage was initially empty
        if (userPlaylists !== defaultPlaylists || !localStorage.getItem('userPlaylists')) {
             localStorage.setItem('userPlaylists', JSON.stringify(userPlaylists));
        }
    }, [userPlaylists]);


    // Apply theme on change
    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    // Manage body overflow during loading
     useEffect(() => {
        if (currentScreen === 'loading') {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto'; // Or 'visible' or ''
        }
        // Cleanup function to reset overflow if component unmounts unexpectedly
        return () => {
             document.body.style.overflow = 'auto'; // Or 'visible' or ''
        };
    }, [currentScreen]);


    const applyTheme = (themeName) => {
        const bodyEl = document.body;
        // Remove previous theme classes
        bodyEl.classList.remove('dark-theme', 'pastel-theme', 'night-theme', 'cozy-theme', 'dark-mode-theme'); // Add all possible theme classes here

        switch (themeName) {
            case 'night':
                bodyEl.style.backgroundColor = '#171626';
                bodyEl.classList.add('night-theme', 'dark-mode-theme'); // Add specific and general dark class
                break;
            case 'cozy':
                bodyEl.style.backgroundColor = '#f8e9d6';
                bodyEl.classList.add('cozy-theme');
                break;
            case 'dark':
                bodyEl.style.backgroundColor = '#0f0f17';
                bodyEl.classList.add('dark-theme', 'dark-mode-theme'); // Add specific and general dark class
                break;
            default: // pastel
                bodyEl.style.backgroundColor = '#fcf1f7';
                bodyEl.classList.add('pastel-theme');
        }
    };

     // Debounce search function
    const debounce = (func, delay) => {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };


    const performSearch = (query) => {
        if (!query.trim()) {
            clearFilter();
            return;
        }
        const searchTerm = query.toLowerCase().trim();

        // Ensure mockMusicData is imported correctly
        // NOTE: This dynamic require might not work ideally in all bundlers/setups.
        // Consider importing 'songs' directly at the top if possible.
        let songs = [];
        try {
             // Assuming mockMusicData exports { songs, albums, artists, ... }
            const musicData = require('../../src/mockMusicData');
            songs = musicData.songs || [];
        } catch (e) {
            console.error("Failed to load music data for search:", e);
            // Handle error - maybe show a message to the user
            setFilteredSongs([]);
            setFilterTitle(`Error loading music data`);
            setFilterType('error');
            setActiveTab('filtered');
            return;
        }


        const matchedSongs = songs.filter(song =>
            song.title.toLowerCase().includes(searchTerm) ||
            getArtistById(song.artist)?.name.toLowerCase().includes(searchTerm) ||
            getAlbumById(song.album)?.title.toLowerCase().includes(searchTerm)
        );

        setFilteredSongs(matchedSongs);
        setFilterTitle(`Search: "${query}"`);
        setFilterType('search');
        setActiveTab('filtered');
    };

    // Create a debounced version of performSearch
    const debouncedSearch = debounce(performSearch, 300); // 300ms delay

    const searchMusic = (query) => {
         debouncedSearch(query);
     };


    const navigateTo = (screen) => {
        // Prevent navigation if already transitioning or navigating to the same screen
        if (isTransitioning || currentScreen === screen) return;

        setIsTransitioning(true);
        // Start transition (e.g., fade out current screen)

        // Use setTimeout to allow exit animations to start
        setTimeout(() => {
            setCurrentScreen(screen);
            // CRITICAL: Scroll to top AFTER the screen state has been updated
            window.scrollTo(0, 0);
            // Mark transition as complete slightly after screen change allows entry animations
            // Adjust timing based on your screen transition animations
            setTimeout(() => {
                 setIsTransitioning(false);
            }, 50); // Short delay after setting screen
        }, 300); // Match this delay roughly to your exit animation duration (e.g., LoadingScreen's pageVariants.out)
    };

    const switchTab = (tab) => {
        // Prevent switching to the same tab
        if (activeTab === tab) return;

        setActiveTab(tab);
        if (tab !== 'filtered') {
            setFilteredSongs([]);
            setFilterTitle('');
            setFilterType('');
            setFilterItemDetails(null);
        }
         // Scroll to top when switching main content tabs
        window.scrollTo(0, 0);
    };

    const togglePlayerView = () => {
        setIsPlayerMinimized(!isPlayerMinimized);
    };

    const maximizePlayer = () => {
        if (!isPlayerMinimized) return; // Already maximized
        setIsPlayerMinimized(false);
    };

    const minimizePlayer = () => {
         if (isPlayerMinimized) return; // Already minimized
        setIsPlayerMinimized(true);
    };

     const togglePlaylistModal = (songId = null) => {
        // Using functional update for potentially rapid toggles
        setShowPlaylistModal(prevShow => {
            if (prevShow) {
                 setSelectedPlaylistForAdd(null); // Clear selection when closing
                return false;
            } else {
                 setSelectedPlaylistForAdd(songId); // Set selection when opening
                return true;
            }
        });
    };


    const changeTheme = (newTheme) => {
        setTheme(newTheme);
    };

    const filterSongsByAlbum = (albumId) => {
        const album = getAlbumById(albumId);
        if (!album) return;

        const songs = getSongsByAlbum(albumId);
        setFilteredSongs(songs);
        setFilterTitle(album.title);
        setFilterType('album');
        setFilterItemDetails(album); // Store album details
        setActiveTab('filtered');
        window.scrollTo(0, 0); // Scroll to top when viewing album
    };

    const filterSongsByArtist = (artistId) => {
        const artist = getArtistById(artistId);
        if (!artist) return;

        const songs = getSongsByArtist(artistId);
        setFilteredSongs(songs);
        setFilterTitle(artist.name);
        setFilterType('artist');
         setFilterItemDetails(artist); // Store artist details
        setActiveTab('filtered');
        window.scrollTo(0, 0); // Scroll to top when viewing artist
    };

    const filterSongsByPlaylist = (playlistId) => {
        // Use the state which reflects the latest updates (create/delete)
        const playlist = userPlaylists.find(p => p.id === playlistId);

        if (playlist) {
            const playlistSongs = (playlist.songs || [])
                .map(songId => getSongById(songId))
                .filter(Boolean); // Filter out null/undefined if a song was deleted

            setFilteredSongs(playlistSongs);
            setFilterTitle(playlist.title);
            setFilterType('playlist');
            setFilterItemDetails(playlist); // Store playlist details
            setActiveTab('filtered');
             window.scrollTo(0, 0); // Scroll to top when viewing playlist
        } else {
            console.warn("Playlist not found in state:", playlistId);
            // Optionally navigate back or show an error
            clearFilter();
            setActiveTab('playlists'); // Go back to playlists tab
        }
    };


    const clearFilter = () => {
        setFilteredSongs([]);
        setFilterTitle('');
        setFilterType('');
        setFilterItemDetails(null);
        // Optionally switch back to a default tab like 'songs'
        // setActiveTab('songs'); // Decide if you want this behavior
    };

    const trackPlaylistAction = (type, playlistId, playlistName) => {
        setLastPlaylistAction({
            type,
            playlistId,
            playlistName,
            timestamp: Date.now()
        });
    };

    // Playlist Management Functions (CRUD) - To be added if needed
    // Example:
    // const createPlaylist = (name) => { ... setUserPlaylists(...) ... trackPlaylistAction(...) }
    // const deletePlaylist = (id) => { ... setUserPlaylists(...) ... trackPlaylistAction(...) }
    // const addSongToPlaylist = (playlistId, songId) => { ... setUserPlaylists(...) ... trackPlaylistAction(...) }
    // const removeSongFromPlaylist = (playlistId, songId) => { ... setUserPlaylists(...) ... trackPlaylistAction(...) }


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
        filterItemDetails, // Make sure this is included
        isTransitioning,
        userPlaylists, // Make sure this is included
        lastPlaylistAction, // Make sure this is included
        navigateTo,
        switchTab,
        togglePlayerView,
        maximizePlayer,
        minimizePlayer,
        togglePlaylistModal,
        changeTheme,
        setFilteredSongs, // Expose setters if needed externally
        setFilterTitle,   // Expose setters if needed externally
        setFilterType,    // Expose setters if needed externally
        filterSongsByAlbum,
        filterSongsByArtist,
        filterSongsByPlaylist,
        clearFilter,
        searchMusic,
        trackPlaylistAction, // Make sure this is included
        // CRUD operations for playlists would be added here
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
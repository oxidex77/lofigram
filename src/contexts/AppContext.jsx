import { createContext, useContext, useState, useEffect } from 'react';
import {
    getSongsByAlbum,
    getSongsByArtist,
    getAlbumById,
    getArtistById,
    getSongById,
    defaultPlaylists
} from '../../src/mockMusicData';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [currentScreen, setCurrentScreen] = useState('loading'); 
    const [activeTab, setActiveTab] = useState('songs'); 
    const [isPlayerMinimized, setIsPlayerMinimized] = useState(true);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [selectedPlaylistForAdd, setSelectedPlaylistForAdd] = useState(null);
    const [theme, setTheme] = useState('pastel'); 
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [filterTitle, setFilterTitle] = useState('');
    const [filterType, setFilterType] = useState(''); 
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [filterItemDetails, setFilterItemDetails] = useState(null); 
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [lastPlaylistAction, setLastPlaylistAction] = useState({
        type: null, 
        playlistId: null,
        playlistName: null,
        timestamp: null
    });

    useEffect(() => {
        const savedPlaylists = localStorage.getItem('userPlaylists');
        if (savedPlaylists) {
            try {
                const parsed = JSON.parse(savedPlaylists);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setUserPlaylists(parsed);
                    return;
                }
            } catch (e) {
                console.error("Error parsing saved playlists:", e);
            }
        }

        setUserPlaylists(defaultPlaylists);
    }, []);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const applyTheme = (themeName) => {
        const bodyEl = document.body;

        switch (themeName) {
            case 'night':
                bodyEl.style.backgroundColor = '#171626';
                bodyEl.classList.add('dark-theme');
                break;
            case 'cozy':
                bodyEl.style.backgroundColor = '#f8e9d6';
                bodyEl.classList.remove('dark-theme');
                break;
            case 'dark':
                bodyEl.style.backgroundColor = '#0f0f17';
                bodyEl.classList.add('dark-theme');
                break;
            default: 
                bodyEl.style.backgroundColor = '#fcf1f7';
                bodyEl.classList.remove('dark-theme');
        }
    };

    const searchMusic = (query) => {
        if (!query.trim()) {
            clearFilter();
            return;
        }

        const searchTerm = query.toLowerCase().trim();

        const { songs } = require('../../src/mockMusicData');

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

    const navigateTo = (screen) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentScreen(screen);
            setIsTransitioning(false);
        }, 400);
    };

    const switchTab = (tab) => {
        setActiveTab(tab);
        if (tab !== 'filtered') {
            setFilteredSongs([]);
            setFilterTitle('');
            setFilterType('');
            setFilterItemDetails(null);
        }
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

    const togglePlaylistModal = (songId = null) => {
        if (showPlaylistModal) {
            setShowPlaylistModal(false);
            setSelectedPlaylistForAdd(null);
        } else {
            setShowPlaylistModal(true);
            setSelectedPlaylistForAdd(songId);
        }
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
        setFilterItemDetails(album);
        setActiveTab('filtered');
    };

    const filterSongsByArtist = (artistId) => {
        const artist = getArtistById(artistId);
        if (!artist) return;

        const songs = getSongsByArtist(artistId);
        setFilteredSongs(songs);
        setFilterTitle(artist.name);
        setFilterType('artist');
        setFilterItemDetails(artist);
        setActiveTab('filtered');
    };

    const filterSongsByPlaylist = (playlistId) => {
        let playlists = [];
        try {
            const storedPlaylists = localStorage.getItem('userPlaylists');
            if (storedPlaylists) {
                playlists = JSON.parse(storedPlaylists);
            }
        } catch (error) {
            console.error("Error loading playlists:", error);
            playlists = userPlaylists; 
        }

        const playlist = playlists.find(p => p.id === playlistId);

        if (playlist) {
            const playlistSongs = (playlist.songs || [])
                .map(songId => getSongById(songId))
                .filter(Boolean); 

            setFilteredSongs(playlistSongs);
            setFilterTitle(playlist.title);
            setFilterType('playlist');
            setFilterItemDetails(playlist);
            setActiveTab('filtered');
        } else {
            console.error("Playlist not found:", playlistId);
        }
    };

    const clearFilter = () => {
        setFilteredSongs([]);
        setFilterTitle('');
        setFilterType('');
        setFilterItemDetails(null);
        setActiveTab('songs');
    };

    const trackPlaylistAction = (type, playlistId, playlistName) => {
        setLastPlaylistAction({
            type,
            playlistId,
            playlistName,
            timestamp: Date.now()
        });
    };

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
        filterItemDetails,
        isTransitioning,
        userPlaylists,
        lastPlaylistAction,
        navigateTo,
        switchTab,
        togglePlayerView,
        maximizePlayer,
        minimizePlayer,
        togglePlaylistModal,
        changeTheme,
        setFilteredSongs,
        setFilterTitle,
        setFilterType,
        filterSongsByAlbum,
        filterSongsByArtist,
        filterSongsByPlaylist,
        clearFilter,
        searchMusic,
        trackPlaylistAction,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
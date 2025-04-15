// src/components/PlaylistEditor.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerContext } from '../contexts/PlayerContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { albums, getTrackById } from '../mockMusicData';

const PlaylistEditor = ({ onClose }) => {
  const { 
    userPlaylists, 
    createPlaylist, 
    addTrackToPlaylist, 
    removeTrackFromPlaylist, 
    deletePlaylist,
    startDrag,
    dropTrack,
    draggedTrack
  } = usePlayerContext();
  
  const { themeColors } = useThemeContext();
  
  const [selectedPlaylist, setSelectedPlaylist] = useState(userPlaylists[0]?.id || null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  // Get current selected playlist
  const currentPlaylist = userPlaylists.find(p => p.id === selectedPlaylist);
  
  // Filter tracks based on search query
  const filteredAlbums = albums.filter(album => {
    const matchesAlbum = album.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArtist = album.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const hasTracks = album.tracks.some(track => 
      track.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return matchesAlbum || matchesArtist || hasTracks;
  });
  
  // Handle creating a new playlist
  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      const playlistId = createPlaylist(newPlaylistName.trim());
      setSelectedPlaylist(playlistId);
      setShowCreateForm(false);
      setNewPlaylistName('');
    }
  };
  
  // Handle deleting a playlist
  const handleDeletePlaylist = () => {
    if (confirmDelete) {
      deletePlaylist(confirmDelete);
      setSelectedPlaylist(userPlaylists.length > 1 ? userPlaylists[0].id : null);
      setConfirmDelete(null);
    }
  };
  
  // Handle adding a track to playlist
  const handleAddTrack = (trackId) => {
    if (selectedPlaylist) {
      addTrackToPlaylist(selectedPlaylist, trackId);
    }
  };
  
  // Handle removing a track from playlist
  const handleRemoveTrack = (trackId) => {
    if (selectedPlaylist) {
      removeTrackFromPlaylist(selectedPlaylist, trackId);
    }
  };
  
  // Handle drag start
  const handleDragStart = (e, trackId) => {
    e.dataTransfer.effectAllowed = 'move';
    startDrag(trackId);
  };
  
  // Handle drag over
  const handleDragOver = (e, trackId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    // Add a visual indicator for the drop target
    e.currentTarget.classList.add('drag-over');
  };
  
  // Handle drag leave
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };
  
  // Handle drop
  const handleDrop = (e, trackId) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    dropTrack(trackId, selectedPlaylist);
  };
  
  return (
    <motion.div 
      className="playlist-editor"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      style={{
        border: `2px solid ${themeColors.primary}`
      }}
    >
      <div className="editor-header">
        <h3>Playlist Editor</h3>
        <motion.button 
          className="close-button"
          onClick={onClose}
          whileTap={{ scale: 0.9 }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </motion.button>
      </div>
      
      <div className="editor-content">
        {/* Playlists sidebar */}
        <div className="playlists-sidebar">
          <div className="sidebar-header">
            <h4>My Playlists</h4>
            <motion.button 
              className="add-playlist-button"
              onClick={() => setShowCreateForm(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={showCreateForm}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </motion.button>
          </div>
          
          <AnimatePresence>
            {showCreateForm && (
              <motion.form 
                className="create-playlist-form"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleCreatePlaylist}
              >
                <input
                  type="text"
                  placeholder="Playlist name"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  autoFocus
                />
                <div className="form-buttons">
                  <motion.button 
                    type="submit"
                    whileTap={{ scale: 0.95 }}
                    disabled={!newPlaylistName.trim()}
                  >
                    Create
                  </motion.button>
                  <motion.button 
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewPlaylistName('');
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
          
          <div className="playlists-list">
            {userPlaylists.length > 0 ? (
              userPlaylists.map(playlist => (
                <motion.div
                  key={playlist.id}
                  className={`playlist-item ${selectedPlaylist === playlist.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPlaylist(playlist.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="playlist-name">{playlist.title}</div>
                  <div className="track-count">{playlist.tracks.length} tracks</div>
                  <motion.button 
                    className="delete-playlist"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDelete(playlist.id);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                  </motion.button>
                </motion.div>
              ))
            ) : (
              <div className="empty-playlists">
                <p>No playlists yet</p>
                <p>Create one with the + button</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Main editor area */}
        <div className="editor-main">
          {selectedPlaylist ? (
            <>
              <div className="current-playlist">
                <h4>{currentPlaylist?.title}</h4>
                <p>{currentPlaylist?.tracks.length} tracks</p>
              </div>
              
              {/* Playlist tracks */}
              <div className="playlist-tracks">
                <h5>Playlist Tracks</h5>
                {currentPlaylist?.tracks.length > 0 ? (
                  <div className="tracks-list">
                    {currentPlaylist.tracks.map((trackId, index) => {
                      const track = getTrackById(trackId);
                      if (!track) return null;
                      
                      return (
                        <motion.div
                          key={trackId}
                          className={`track-item ${draggedTrack === trackId ? 'dragging' : ''}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, trackId)}
                          onDragOver={(e) => handleDragOver(e, trackId)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, trackId)}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <div className="track-number">{index + 1}</div>
                          <div className="track-info">
                            <div className="track-title">{track.title}</div>
                            <div className="track-artist">{track.artist}</div>
                          </div>
                          <motion.button 
                            className="remove-track"
                            onClick={() => handleRemoveTrack(trackId)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 13H5v-2h14v2z" />
                            </svg>
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-tracks">
                    <p>No tracks in this playlist</p>
                    <p>Add tracks from the library below</p>
                  </div>
                )}
              </div>
              
              {/* Search bar */}
              <div className="search-bar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search tracks by title, artist, or album..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <motion.button 
                    className="clear-search"
                    onClick={() => setSearchQuery('')}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </motion.button>
                )}
              </div>
              
              {/* Library tracks */}
              <div className="library-tracks">
                <h5>Library</h5>
                {filteredAlbums.length > 0 ? (
                  <>
                    {filteredAlbums.map(album => (
                      <div key={album.id} className="album-section">
                        <div className="album-header">
                          <img src={album.coverArt} alt={album.title} />
                          <div className="album-info">
                            <h6>{album.title}</h6>
                            <p>{album.artist}</p>
                          </div>
                        </div>
                        
                        {album.tracks
                          .filter(track => 
                            searchQuery ? 
                              track.title.toLowerCase().includes(searchQuery.toLowerCase()) :
                              true
                          )
                          .map(track => {
                            const isInPlaylist = currentPlaylist.tracks.includes(track.id);
                            
                            return (
                              <motion.div 
                                key={track.id}
                                className={`track-item ${isInPlaylist ? 'in-playlist' : ''}`}
                                whileHover={{ scale: 1.01 }}
                              >
                                <div className="track-info">
                                  <div className="track-title">{track.title}</div>
                                  <div className="track-duration">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</div>
                                </div>
                                <motion.button 
                                  className={`add-remove-track ${isInPlaylist ? 'remove' : 'add'}`}
                                  onClick={() => isInPlaylist ? 
                                    handleRemoveTrack(track.id) : 
                                    handleAddTrack(track.id)
                                  }
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {isInPlaylist ? (
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M19 13H5v-2h14v2z" />
                                    </svg>
                                  ) : (
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                    </svg>
                                  )}
                                </motion.button>
                              </motion.div>
                            );
                          })}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="no-results">
                    <p>No tracks found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="no-playlist-selected">
              <p>No playlist selected</p>
              <p>Select a playlist from the sidebar or create a new one</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div 
            className="delete-confirmation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="confirmation-dialog">
              <h5>Delete Playlist?</h5>
              <p>Are you sure you want to delete this playlist? This action cannot be undone.</p>
              <div className="dialog-buttons">
                <motion.button 
                  className="confirm-delete"
                  onClick={handleDeletePlaylist}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </motion.button>
                <motion.button 
                  className="cancel-delete"
                  onClick={() => setConfirmDelete(null)}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PlaylistEditor;
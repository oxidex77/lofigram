// src/data/mockMusicData.js
// Mock data for Lofigram music player app

// Artists data
export const artists = [
  {
    id: 'artist-001',
    name: 'Moonlight Melody',
    image: '/assets/album-covers/eyes.png',
    description: 'Creates dreamy lo-fi beats with a touch of nostalgia',
    songs: ['song-001', 'song-005', 'song-009', 'song-013', 'song-017']
  },
  {
    id: 'artist-002',
    name: 'Pastel Skies',
    image: '/assets/album-covers/funkyeyes.png',
    description: 'Blending soft melodies with gentle rhythms',
    songs: ['song-002', 'song-006', 'song-010', 'song-014', 'song-018']
  },
  {
    id: 'artist-003',
    name: 'Cozy Beats',
    image: '/assets/album-covers/radio.jpg',
    description: 'Warm tones and relaxing vibes to soothe your soul',
    songs: ['song-003', 'song-007', 'song-011', 'song-015', 'song-019']
  },
  {
    id: 'artist-004',
    name: 'Pixel Dreams',
    image: '/assets/album-covers/funkygirl.png',
    description: 'Retro-inspired lo-fi with a modern kawaii twist',
    songs: ['song-004', 'song-008', 'song-012', 'song-016', 'song-020']
  }
];

// Albums data
export const albums = [
  {
    id: 'album-001',
    title: 'Rainy Day Whispers',
    cover: '/assets/album-covers/rainy.png',
    artist: 'artist-001',
    songs: ['song-001', 'song-002', 'song-003', 'song-004'],
    year: '2024'
  },
  {
    id: 'album-002',
    title: 'Cotton Candy Dreams',
    cover: '/assets/album-covers/panda.png',
    artist: 'artist-002',
    songs: ['song-005', 'song-006', 'song-007', 'song-008'],
    year: '2024'
  },
  {
    id: 'album-007',
    title: 'Eyes',
    cover: '/assets/album-covers/eyeshair.png',
    artist: 'artist-003',
    songs: ['song-001', 'song-002', 'song-003', 'song-004'],
    year: '2024'
  },
  {
    id: 'album-006',
    title: 'Eyes',
    cover: '/assets/album-covers/underwater.png',
    artist: 'artist-001',
    songs: ['song-001', 'song-002', 'song-003', 'song-004'],
    year: '2024'
  },
  {
    id: 'album-003',
    title: 'Midnight Study Session',
    cover: '/assets/album-covers/study.png',
    artist: 'artist-003',
    songs: ['song-009', 'song-010', 'song-011', 'song-012'],
    year: '2023'
  },
  {
    id: 'album-004',
    title: 'Sakura Memories',
    cover: '/assets/album-covers/headphones.png',
    artist: 'artist-004',
    songs: ['song-013', 'song-014', 'song-015', 'song-016'],
    year: '2023'
  },
  {
    id: 'album-005',
    title: 'Starlight Serenades',
    cover: '/assets/album-covers/lofisky.png',
    artist: 'Various Artists',
    songs: ['song-017', 'song-018', 'song-019', 'song-020'],
    year: '2022'
  }
];

// Songs data
export const songs = [
  {
    id: 'song-001',
    title: 'Raindrops on Windowpanes',
    file: '/assets/audio/song1.mp3',
    cover: '/assets/album-covers/rainy.png',
    artist: 'artist-001',
    album: 'album-001',
    duration: '3:42',
    trending: true
  },
  {
    id: 'song-002',
    title: 'Cozy Café Corner',
    file: '/assets/audio/song2.mp3',
    cover: '/assets/album-covers/sunrise.png',
    artist: 'artist-002',
    album: 'album-001',
    duration: '2:51'
  },
  {
    id: 'song-003',
    title: 'Misty Morning Walk',
    file: '/assets/audio/song3.mp3', 
    cover: '/assets/album-covers/raccoon.png',
    artist: 'artist-003',
    album: 'album-001',
    duration: '3:15'
  },
  {
    id: 'song-004',
    title: 'Puddle Reflections',
    file: '/assets/audio/song4.mp3',
    cover: '/assets/album-covers/cdcity.jpg',
    artist: 'artist-004',
    album: 'album-001',
    duration: '4:07'
  },
  {
    id: 'song-005',
    title: 'Fluffy Cloud Journey',
    file: '/assets/audio/song5.mp3',
    cover: '/assets/album-covers/lookingatdsky.png',
    artist: 'artist-001',
    album: 'album-002',
    duration: '3:28',
    trending: true
  },
  {
    id: 'song-006',
    title: 'Sweet Bubblegum Beats',
    file: '/assets/audio/song6.mp3',
    cover: '/assets/album-covers/foxgirl.jpg',
    artist: 'artist-002',
    album: 'album-002',
    duration: '2:45'
  },
  {
    id: 'song-007',
    title: 'Pastel Sunset',
    file: '/assets/audio/song7.mp3',
    cover: '/assets/album-covers/astronaut.jpeg',
    artist: 'artist-003',
    album: 'album-002',
    duration: '3:56'
  },
  {
    id: 'song-008',
    title: 'Marshmallow Daydream',
    file: '/assets/audio/song8.mp3',
    cover: '/assets/album-covers/headphonefox.jpeg',
    artist: 'artist-004',
    album: 'album-002',
    duration: '3:12'
  },
  {
    id: 'song-009',
    title: 'Late Night Pages',
    file: '/assets/audio/noname.mp3',
    cover: '/assets/album-covers/laptop.jpeg',
    artist: 'artist-001',
    album: 'album-003',
    duration: '4:23'
  },
  {
    id: 'song-010',
    title: 'Coffee and Textbooks',
    file: '/assets/audio/song1.mp3',
    cover: '/assets/album-covers/lofigram.jpeg',
    artist: 'artist-002',
    album: 'album-003',
    duration: '3:47',
    trending: true
  },
  {
    id: 'song-011',
    title: 'Desk Lamp Glow',
    file: '/assets/audio/song2.mp3',
    cover: '/assets/album-covers/smoke.jpeg',
    artist: 'artist-003',
    album: 'album-003',
    duration: '2:59'
  },
  {
    id: 'song-012',
    title: 'Quiet Library Corner',
    file: '/assets/audio/song3.mp3',
    cover: '/assets/album-covers/sunrise.png',
    artist: 'artist-004',
    album: 'album-003',
    duration: '3:31'
  },
  {
    id: 'song-013',
    title: 'Cherry Blossom Path',
    file: '/assets/audio/song4.mp3',
    cover: '/assets/album-covers/cat.jpeg',
    artist: 'artist-001',
    album: 'album-004',
    duration: '3:18'
  },
  {
    id: 'song-014',
    title: 'Spring Breeze Melodies',
    file: '/assets/audio/song5.mp3',
    cover: '/assets/album-covers/lofigram.jpeg',
    artist: 'artist-002',
    album: 'album-004',
    duration: '4:02'
  },
  {
    id: 'song-015',
    title: 'Petal Dance',
    file: '/assets/audio/song6.mp3',
    cover: '/assets/album-covers/ghostdjblue.jpeg',
    artist: 'artist-003',
    album: 'album-004',
    duration: '3:24',
    trending: true
  },
  {
    id: 'song-016',
    title: 'Pink Sky Morning',
    file: '/assets/audio/song7.mp3',
    cover: '/assets/album-covers/playlist.jpeg',
    artist: 'artist-004',
    album: 'album-004',
    duration: '2:57'
  },
  {
    id: 'song-017',
    title: 'Constellation Lullaby',
    file: '/assets/audio/song8.mp3',
    cover: '/assets/album-covers/sleepwithcat.jpeg',
    artist: 'artist-001',
    album: 'album-005',
    duration: '3:52'
  },
  {
    id: 'song-018',
    title: 'Moonbeam Waltz',
    file: '/assets/audio/noname.mp3',
    cover: '/assets/album-covers/ghostdj.jpeg',
    artist: 'artist-002',
    album: 'album-005',
    duration: '3:35'
  },
  {
    id: 'song-019',
    title: 'Twinkling Lights',
    file: '/assets/audio/song1.mp3',
    cover: '/assets/album-covers/headphoneset.jpeg',
    artist: 'artist-003',
    album: 'album-005',
    duration: '4:11'
  },
  {
    id: 'song-020',
    title: 'Night Sky Serenade',
    file: '/assets/audio/song2.mp3',
    cover: '/assets/album-covers/window.jpeg',
    artist: 'artist-004',
    album: 'album-005',
    duration: '3:49'
  }
];

// Default playlists
// Update the defaultPlaylists in src/data/mockMusicData.js
// Replace the existing defaultPlaylists with:

export const defaultPlaylists = [
  {
    id: 'playlist-001',
    title: 'Chill Study Vibes',
    cover: '/assets/album-covers/study.png',
    songs: ['song-009', 'song-010', 'song-011', 'song-012', 'song-003', 'song-016']
  },
  {
    id: 'playlist-002',
    title: 'Rainy Day Comfort',
    cover: '/assets/album-covers/playlistcover.jpeg',
    songs: ['song-001', 'song-003', 'song-007', 'song-013', 'song-019']
  },
  {
    id: 'playlist-003',
    title: 'Sweet Dreams',
    cover: '/assets/album-covers/lofisky.png',
    songs: ['song-005', 'song-008', 'song-017', 'song-018', 'song-020']
  },
  {
    id: 'playlist-004',
    title: 'Morning Coffee',
    cover: '/assets/album-covers/headphones.png',
    songs: ['song-002', 'song-006', 'song-014', 'song-015']
  },
  {
    id: 'playlist-005',
    title: 'Late Night Coding',
    cover: '/assets/album-covers/laptop.jpeg',
    songs: ['song-004', 'song-009', 'song-012', 'song-016', 'song-020']
  }
];

// Helper function to get song by ID
export const getSongById = (id) => {
  return songs.find(song => song.id === id);
};

// Helper function to get artist by ID
export const getArtistById = (id) => {
  return artists.find(artist => artist.id === id);
};

// Helper function to get album by ID
export const getAlbumById = (id) => {
  return albums.find(album => album.id === id);
};

// Helper function to get trending songs
export const getTrendingSongs = () => {
  return songs.filter(song => song.trending === true);
};

// Helper function to get songs by artist ID
export const getSongsByArtist = (artistId) => {
  return songs.filter(song => song.artist === artistId);
};

// Helper function to get songs by album ID
export const getSongsByAlbum = (albumId) => {
  return songs.filter(song => song.album === albumId);
};
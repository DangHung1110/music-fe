import React, { useEffect, useState } from "react";
import { fetchPopularTracks, fetchPopularAlbums, fetchAlbumTracks } from "../../services/jamendo";
import api from "../../services/api";
import { usePlayerStore } from "../../store/player";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";

const Homepage = () => {
  const [albums, setAlbums] = useState([]);
  const [popularArtists, setPopularArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jamendoClientId, setJamendoClientId] = useState(null);
  const { setQueue, setArtist } = usePlayerStore();
  const navigate = useNavigate();

  // Lấy Jamendo Client ID
  useEffect(() => {
    const getJamendoClientId = async () => {
      try {
        const response = await api.get('/music/jamendo-client-id');
        const clientId = response?.metadata?.client_id || response?.client_id;
        if (clientId) {
          setJamendoClientId(clientId);
        } else {
          setJamendoClientId(import.meta.env.VITE_JAMENDO_CLIENT_ID || null);
        }
      } catch (error) {
        console.error('Error fetching Jamendo Client ID:', error);
        setJamendoClientId(import.meta.env.VITE_JAMENDO_CLIENT_ID || null);
      }
    };
    getJamendoClientId();
  }, []);

  // Fetch albums và popular artists
  useEffect(() => {
    if (!jamendoClientId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch popular albums (6 albums phổ biến)
        const albumsData = await fetchPopularAlbums({ 
          clientId: jamendoClientId, 
          limit: 6 
        });
        setAlbums(albumsData || []);

        // Fetch popular artists (lấy từ tracks và group by artist)
        const artistTracks = await fetchPopularTracks({ 
          clientId: jamendoClientId, 
          limit: 30 
        });
        
        // Group by artist và lấy 6 artists đầu tiên
        const artistMap = new Map();
        artistTracks.forEach(track => {
          if (track.artist_name && track.artist_id) {
            if (!artistMap.has(track.artist_id)) {
              artistMap.set(track.artist_id, {
                id: track.artist_id,
                name: track.artist_name,
                cover_url: track.album_image || track.image || '',
                tracks: []
              });
            }
            artistMap.get(track.artist_id).tracks.push({
              jamendo_id: track.id,
              title: track.name,
              cover_url: track.album_image || track.image,
              audio: track.audio || track.audiodownload,
              duration: track.duration,
              artist_name: track.artist_name
            });
          }
        });
        
        const artists = Array.from(artistMap.values()).slice(0, 6);
        setPopularArtists(artists);
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [jamendoClientId]);

  const handleAlbumClick = async (album) => {
    try {
      console.log('Album clicked:', album);
      
      // Fetch tracks của album
      const albumTracks = await fetchAlbumTracks({
        clientId: jamendoClientId,
        albumId: album.id
      });
      
      if (albumTracks && albumTracks.length > 0) {
        const normalizedTracks = albumTracks.map((track) => ({
          id: track.id,
          jamendo_id: track.id,
          name: track.name,
          title: track.name,
          artist_name: track.artist_name || album.artist_name,
          duration: track.duration,
          audio: track.audio || track.audiodownload,
          cover_url: track.album_image || album.image,
          image: track.album_image || album.image,
          artist_id: track.artist_id || album.artist_id,
          album_id: album.id,
          album_name: album.name,
        }));
        setQueue(normalizedTracks);
      } else {
        console.warn('No tracks found for album:', album.id);
      }
    } catch (error) {
      console.error('Error loading album tracks:', error);
    }
  };

  const handleArtistClick = (artist) => {
    setArtist(artist);
    navigate(`/artist/${encodeURIComponent(artist.name)}`);
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="animate-pulse space-y-8">
          <div>
            <div className="h-8 bg-gray-700 rounded w-48 mb-6"></div>
            <div className="flex gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-48 h-64 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
          <div>
            <div className="h-8 bg-gray-700 rounded w-48 mb-6"></div>
            <div className="flex gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-48 h-48 bg-gray-700 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-12">
      {/* Albums Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Albums</h2>
          <button className="text-sm text-gray-400 hover:text-white hover:underline transition-colors">
            Show all
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {albums.map((album) => (
            <div
              key={album.id}
              className="group flex-shrink-0 w-48 bg-gray-800/50 hover:bg-gray-800 rounded-lg p-4 transition-all duration-200 cursor-pointer"
              onClick={() => handleAlbumClick(album)}
            >
              <div className="relative mb-4">
                <img
                  src={album.image || album.cover || 'https://via.placeholder.com/200?text=♪'}
                  alt={album.name}
                  className="w-full aspect-square rounded-lg object-cover shadow-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200?text=♪';
                  }}
                />
                <button
                  className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAlbumClick(album);
                  }}
                >
                  <Play className="w-5 h-5 text-black ml-0.5" fill="black" />
                </button>
              </div>
              <h3 className="text-white font-semibold text-sm truncate mb-1">{album.name}</h3>
              <p className="text-gray-400 text-xs truncate">{album.artist_name || 'Unknown Artist'}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Artists Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Popular artists</h2>
          <button className="text-sm text-gray-400 hover:text-white hover:underline transition-colors">
            Show all
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {popularArtists.map((artist) => (
            <div
              key={artist.id}
              className="group flex-shrink-0 w-48 flex flex-col items-center cursor-pointer"
              onClick={() => handleArtistClick(artist)}
            >
              <div className="w-48 h-48 rounded-full overflow-hidden mb-4 shadow-lg hover:scale-105 transition-transform">
                <img
                  src={artist.cover_url || 'https://via.placeholder.com/200?text=♪'}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200?text=♪';
                  }}
                />
              </div>
              <h3 className="text-white font-semibold text-sm text-center hover:underline">
                {artist.name}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Homepage;


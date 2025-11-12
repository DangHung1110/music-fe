import React, { useEffect, useState } from "react";
import { fetchPopularTracks, fetchLatestTracks } from "../../services/jamendo";
import api from "../../services/api";
import SongList from "../../components/SongList/SongList";

const Trending = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jamendoClientId, setJamendoClientId] = useState(null);

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

  // Fetch trending songs (20 bài hát phổ biến nhất, nếu không được thì lấy 20 bài mới nhất)
  useEffect(() => {
    if (!jamendoClientId) return;

    const loadTrendingSongs = async () => {
      setLoading(true);
      try {
        // Thử lấy bài hát phổ biến nhất trước
        let tracks = await fetchPopularTracks({ 
          clientId: jamendoClientId, 
          limit: 20 
        });
        
        // Nếu không có dữ liệu, fallback sang bài hát mới nhất
        if (!tracks || tracks.length === 0) {
          tracks = await fetchLatestTracks({ 
            clientId: jamendoClientId, 
            limit: 20 
          });
        }
        
        setSongs(tracks || []);
      } catch (error) {
        console.error('Error fetching trending songs:', error);
        // Fallback: thử lấy bài hát mới nhất nếu popular tracks fail
        try {
          const latestTracks = await fetchLatestTracks({ 
            clientId: jamendoClientId, 
            limit: 20 
          });
          setSongs(latestTracks || []);
        } catch (fallbackError) {
          console.error('Error fetching latest songs as fallback:', fallbackError);
          setSongs([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTrendingSongs();
  }, [jamendoClientId]);

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Trending</h1>
      <SongList songs={songs} isLoading={loading} />
    </div>
  );
};

export default Trending;


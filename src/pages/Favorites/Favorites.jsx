import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SongList from "../../components/SongList/SongList";
import interactions from "../../services/interactions";
import { fetchTracksByIds } from "../../services/jamendo";
import api from "../../services/api";
import { useAuthStore } from "../../store/auth";
import { Heart } from "lucide-react";

const Favorites = () => { 
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jamendoClientId, setJamendoClientId] = useState(null);

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

  // Fetch liked songs
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    if (!jamendoClientId) return;

    const loadLikedSongs = async () => {
      setLoading(true);
      try {
        const likedResult = await interactions.getMyLikedSongIds();
        console.log('Fetched liked song IDs:', likedResult);
        
        if (!likedResult.success) {
          console.error('Error fetching liked song IDs:', likedResult.error);
          setSongs([]);
          return;
        }

        const songIds = likedResult.data || [];
        
        if (songIds.length === 0) {
          setSongs([]);
          setLoading(false);
          return;
        }

        console.log(`Found ${songIds.length} liked songs, fetching details from Jamendo...`);

        const tracks = await fetchTracksByIds({
          clientId: jamendoClientId,
          trackIds: songIds 
        });

        console.log(`Successfully loaded ${tracks.length} tracks`);
        setSongs(tracks || []);
      } catch (error) {
        console.error('Error loading liked songs:', error);
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };

    loadLikedSongs();
  }, [isAuthenticated, jamendoClientId]);

  if (!isAuthenticated) {
    return (
      <div className="py-8 text-center">
        <div className="max-w-md mx-auto">
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Đăng nhập để xem bài hát yêu thích</h2>
          <p className="text-gray-400 mb-6">Đăng nhập để lưu và xem các bài hát bạn đã thích</p>
          <button
            onClick={() => navigate('/auth/login')}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition-colors"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
          <Heart className="w-6 h-6 text-white fill-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Bài hát yêu thích</h1>
          <p className="text-gray-400 text-sm mt-1">
            {loading ? 'Đang tải...' : `${songs.length} bài hát`}
          </p>
        </div>
      </div>

      {!loading && songs.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Chưa có bài hát yêu thích</h2>
          <p className="text-gray-400 mb-6">Bắt đầu thích các bài hát để xem chúng ở đây</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition-colors"
          >
            Khám phá nhạc mới
          </button>
        </div>
      ) : (
        <SongList songs={songs} isLoading={loading} />
      )}
    </div>
  );
};

export default Favorites;


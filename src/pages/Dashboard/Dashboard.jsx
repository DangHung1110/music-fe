import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import Player from "../../components/Player/Player";
import SongList from "../../components/SongList/SongList";
import { fetchLatestTracks } from "../../services/jamendo";
import api from "../../services/api";
import { useAuthStore } from "../../store/auth";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [latestSongs, setLatestSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [jamendoClientId, setJamendoClientId] = useState(null);

  // Lấy Jamendo Client ID từ BE
  useEffect(() => {
    const getJamendoClientId = async () => {
      try {
        const response = await api.get('/music/jamendo-client-id');
        const clientId = response?.metadata?.client_id || response?.client_id;
        if (clientId) {
          setJamendoClientId(clientId);
        } else {
          // Fallback: dùng env variable hoặc default
          setJamendoClientId(import.meta.env.VITE_JAMENDO_CLIENT_ID || null);
        }
      } catch (error) {
        console.error('Error fetching Jamendo Client ID:', error);
        // Fallback: dùng env variable
        setJamendoClientId(import.meta.env.VITE_JAMENDO_CLIENT_ID || null);
      }
    };
    getJamendoClientId();
  }, []);

  useEffect(() => {
    if (!jamendoClientId) return; // Chờ lấy Client ID

    const loadLatestSongs = async () => {
      setLoadingSongs(true);
      try {
        console.log('Fetching latest songs with Client ID:', jamendoClientId);
        const tracks = await fetchLatestTracks({ 
          clientId: jamendoClientId, 
          limit: 10 
        });
        console.log('Fetched tracks:', tracks);
        setLatestSongs(tracks || []);
      } catch (error) {
        console.error('Error fetching latest songs:', error);
        console.error('Error details:', error.response?.data || error.message);
        setLatestSongs([]);
      } finally {
        setLoadingSongs(false);
      }
    };

    if (location.pathname === "/") {
      loadLatestSongs();
    }
  }, [location.pathname, jamendoClientId]);

  // ✅ CHỈ hiển thị songs khi ở ĐÚNG trang chủ "/" - không phải sub-route
  const showSongs = location.pathname === "/";

  return (
    <div className="bg-black text-white h-screen flex flex-col overflow-hidden">
      {/* Layout chính: Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar cố định - không scroll */}
        <div className="w-64 flex-shrink-0 h-full">
          <Sidebar />
        </div>

        {/* Main Content Area - scroll độc lập */}
        <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-black">
          {/* Topbar - cố định trên cùng */}
          <div className="sticky top-0 z-10 bg-black/60 backdrop-blur-lg px-6 py-4 border-b border-gray-800/50">
            <Topbar />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-24">
            <div className="max-w-[1950px] mx-auto">
              <Outlet />

              {showSongs && (
                <section className="mt-6 mb-8">
                  <h2 className="text-2xl font-bold mb-6 text-white">Các bài hát mới</h2>
                  <SongList songs={latestSongs} isLoading={loadingSongs} />
                </section>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Player cố định dưới cùng */}
      <Player />
    </div>
  );
};

export default Dashboard;

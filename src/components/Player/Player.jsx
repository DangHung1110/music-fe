import React, { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../../store/player";
import { useAuthStore } from "../../store/auth";
import playlistService from "../../services/playlists.jsx"; 
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Info,
  Plus 
} from 'lucide-react';
import NowPlayingSidebar from '../NowPlaying/NowPlayingSidebar'; 

const Player = () => {
  const { currentSong, playNext, playPrev } = usePlayerStore();
  const { isAuthenticated } = useAuthStore();
  const audioRef = useRef(null);
  const lastVolumeRef = useRef(70);
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [saving, setSaving] = useState(false);

  // Phát nhạc khi đổi bài
  useEffect(() => {
    if (audioRef.current && currentSong?.audio) {
      audioRef.current.src = currentSong.audio;
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setSidebarOpen(true); // auto open details like Spotify
        })
        .catch(() => setIsPlaying(false));
      audioRef.current.volume = (isMuted ? 0 : volume) / 100;
    } else {
      setIsPlaying(false);
    }
  }, [currentSong?.audio]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = (isMuted ? 0 : volume) / 100;
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current || !currentSong?.audio) return;
    if (!audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  //  Mở popup và tải playlist
  const openSavePopup = async () => {
    setShowPopup(true);
    setLoadingPlaylists(true);
    try {
      const res = await playlistService.getMyPlaylists();
      if (res.success) {
        setPlaylists(res.data);
      } else {
        alert(" Không tải được playlist: " + res.error);
      }
    } catch (err) {
      console.error("Failed to load playlists", err);
    }
    setLoadingPlaylists(false);
  };

  const saveToPlaylist = async (playlistId) => {
    if (!currentSong?.id) return alert("Không có bài hát nào đang phát!");

    setSaving(true);
    try {
      const res = await playlistService.saveToPlaylist(playlistId, {
      jamendo_id: currentSong.jamendo_id || currentSong.id,
      name: currentSong.title || currentSong.name,
  
      audio: currentSong.audio,       // audio → file_url
      album_image: currentSong.cover_url || currentSong.image,
      artist_id: currentSong.artist_id, 
      artist_name: currentSong.artist_name, // bắt buộc nếu backend check FK
      album_id: currentSong.album_id || null,
      album_name: currentSong.album_name || null,
      });

      alert(" Đã thêm bài hát vào playlist!");
        setShowPopup(false);
    } catch (err) {
      console.error(err);
      alert("Thêm vào playlist thất bại!");
    }
    setSaving(false);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 h-20 z-30">
        <div className="flex items-center justify-between gap-4 h-full px-4">
          {/* Track Info - Left */}
          <div className="flex items-center gap-3 flex-[0_0_30%] min-w-0">
            {currentSong ? (
              <>
                <img
                  src={currentSong.image || currentSong.cover_url || 'https://via.placeholder.com/56?text=♪'}
                  alt={currentSong.name || currentSong.title}
                  className="w-14 h-14 rounded object-cover shadow-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/56?text=♪';
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-white truncate hover:underline cursor-pointer">
                      {currentSong.name || currentSong.title}
                    </h4>
                    {isAuthenticated && (
                      <button
                        onClick={openSavePopup}
                        className="p-1 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
                        title="Thêm vào playlist"
                      >
                        <Plus className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {currentSong.artist_name || currentSong.artist || 'Unknown Artist'}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-gray-500 text-sm">Chưa có bài hát nào</div>
            )}
          </div>

          {/* Player Controls - Center */}
          <div className="flex flex-col items-center justify-center flex-1 gap-1">
            <div className="flex items-center gap-2">
              <button 
                className="p-2 hover:text-white text-gray-400 transition-colors" 
                onClick={playPrev}
                title="Bài trước"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              <button
                onClick={togglePlay}
                className="p-2 bg-white rounded-full hover:scale-110 transition-transform shadow-lg"
                disabled={!currentSong}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-black" fill="black" />
                ) : (
                  <Play className="w-5 h-5 text-black ml-0.5" fill="black" />
                )}
              </button>

              <button 
                className="p-2 hover:text-white text-gray-400 transition-colors" 
                onClick={playNext}
                title="Bài tiếp"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Volume Control - Right */}
          <div className="flex items-center gap-2 flex-[0_0_30%] justify-end">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Xem thông tin bài hát"
            >
              <Info className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
            <button
              onClick={() => {
                if (!audioRef.current) return;
                if (isMuted || volume === 0) {
                  setIsMuted(false);
                  const restored = lastVolumeRef.current || 50;
                  setVolume(restored);
                } else {
                  lastVolumeRef.current = volume || 50;
                  setIsMuted(true);
                }
              }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title={isMuted || volume === 0 ? 'Bật âm thanh' : 'Tắt tiếng'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5 text-gray-400 hover:text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-gray-400 hover:text-white" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value > 0) {
                  lastVolumeRef.current = value;
                  setIsMuted(false);
                } else {
                  setIsMuted(true);
                }
                setVolume(value);
              }}
              className="w-28 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-white"
              style={{
                background: `linear-gradient(to right, #1db954 0%, #1db954 ${isMuted ? 0 : volume}%, #404040 ${isMuted ? 0 : volume}%, #404040 100%)`
              }}
            />
          </div>
        </div>
      </div>

      {/*  Sidebar Component */}
      <NowPlayingSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Thẻ audio */}
      <audio
  ref={audioRef}
  onEnded={() => {
    setIsPlaying(false);
    playNext(); // 👈 tự động chuyển sang bài kế tiếp
  }}
  style={{ display: "none" }}
>
        <source src={currentSong?.audio} type="audio/mpeg" />
      </audio>

      {/* Popup chọn playlist */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-md mx-4 max-h-[70vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Lưu vào playlist</h3>
              <p className="text-sm text-gray-400 mt-1">
                {currentSong?.name || currentSong?.title}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {loadingPlaylists ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <p className="text-gray-400 mt-4">Đang tải playlist...</p>
                </div>
              ) : playlists.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">Bạn chưa có playlist nào.</p>
                  <p className="text-sm text-gray-500 mt-2">Tạo playlist mới để bắt đầu lưu bài hát.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {playlists.map((pl) => (
                    <button
                      key={pl.id}
                      onClick={() => saveToPlaylist(pl.id)}
                      disabled={saving}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                    >
                      <div className="w-12 h-12 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">🎵</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{pl.title}</p>
                        {pl.description && (
                          <p className="text-sm text-gray-400 truncate">{pl.description}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 py-4 border-t border-gray-800">
              <button
                onClick={() => setShowPopup(false)}
                className="w-full px-4 py-2 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Player;

import React, { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../../store/player";
import playlistService from "../../services/playlists.jsx"; 
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Info 
} from 'lucide-react';
import NowPlayingSidebar from '../NowPlaying/NowPlayingSidebar'; 

const Player = () => {
  const { currentSong, playNext, playPrev } = usePlayerStore();
  const audioRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [isPlaying, setIsPlaying] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ Phát nhạc khi đổi bài
  useEffect(() => {
    if (audioRef.current && currentSong?.audio) {
      audioRef.current.src = currentSong.audio;
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      setIsPlaying(false);
    }
  }, [currentSong?.audio]);

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

  // 📌 Mở popup và tải playlist
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
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-white/10 px-4 py-3 z-30">
        <div className="flex items-center justify-between gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {currentSong && (
              <>
                <img
                  src={currentSong.image || currentSong.cover_url || '/placeholder-album.png'}
                  alt={currentSong.name || currentSong.title}
                  className="w-14 h-14 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {currentSong.name || currentSong.title}
                  </h4>
                  <p className="text-xs text-gray-400 truncate">
                    {currentSong.artist_name || currentSong.artist}
                  </p>
                </div>
                {/* Thêm nút mở sidebar */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  title="Xem thông tin bài hát"
                >
                  <Info className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              </>
            )}
          </div>

          {/* Player Controls */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:text-white transition-colors" onClick={playPrev}>
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button
              onClick={togglePlay}
              className="p-3 bg-white rounded-full hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-black" />
              ) : (
                <Play className="w-5 h-5 text-black" />
              )}
            </button>

            <button className="p-2 hover:text-white transition-colors" onClick={playNext}>
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <Volume2 className="w-5 h-5 text-gray-400" />
            <input
              type="range"
              min="0"
              max="100"
              className="w-24 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
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

      {/*  Popup chọn playlist */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => setShowPopup(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              minWidth: "300px",
              maxHeight: "70vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>📁 Chọn playlist để lưu</h3>

            {loadingPlaylists ? (
              <p>Đang tải playlist...</p>
            ) : playlists.length === 0 ? (
              <p>Bạn chưa có playlist nào.</p>
            ) : (
              playlists.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => saveToPlaylist(pl.id)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px",
                    margin: "5px 0",
                    textAlign: "left",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    background: "#f8f8f8",
                    cursor: "pointer",
                  }}
                  disabled={saving}
                >
                  📻 {pl.title}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Player;

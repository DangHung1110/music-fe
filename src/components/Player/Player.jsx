import React, { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../../store/player";
import playlistService from "../../services/playlists.jsx"; // 📌 Đảm bảo bạn có file api.js để gọi backend

const Player = () => {
  const { currentSong, playNext, playPrev } = usePlayerStore();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 📌 State popup
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
        alert("❌ Không tải được playlist: " + res.error);
      }
    } catch (err) {
      console.error("Failed to load playlists", err);
    }
    setLoadingPlaylists(false);
  };

  // 📌 Gửi yêu cầu lưu bài hát vào playlist
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

      alert("✅ Đã thêm bài hát vào playlist!");
        setShowPopup(false);
    } catch (err) {
      console.error(err);
      alert("❌ Thêm vào playlist thất bại!");
    }
    setSaving(false);
  };

  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#242424",
        borderTop: "1px solid #646cff",
        padding: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 1000,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.5)",
      }}
    >
      {/* Bên trái: thông tin bài hát */}
      <div style={{ display: "flex", alignItems: "center", color: "#fff" }}>
        {currentSong?.name ? (
          <>
            <img
              src={currentSong.image || "/placeholder.jpg"}
              alt={currentSong.name}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "4px",
                marginRight: "10px",
              }}
            />
            <div>
              <p style={{ fontSize: "14px", margin: 0 }}>{currentSong.name}</p>
              <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>
                {currentSong.artist_name || "Unknown Artist"}
              </p>
            </div>
          </>
        ) : (
          <p style={{ color: "#888", fontSize: "14px" }}>Chưa chọn bài hát</p>
        )}
      </div>

      {/* Bên phải: Nút điều khiển */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Nút lưu */}
        <button
          onClick={openSavePopup}
          style={{
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: "18px",
            width: "50px",
            height: "50px",
          }}
          title="Lưu vào playlist"
        >
          💾
        </button>
        <button
  onClick={playPrev}
  style={{
    padding: "10px 15px",
    backgroundColor: "#666",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "18px",
    width: "50px",
    height: "50px",
  }}
>
  ⏮
</button>
        {/* Nút phát / dừng */}
        <button
          onClick={togglePlay}
          style={{
            padding: "10px 15px",
            backgroundColor: isPlaying ? "#ff4d4d" : "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: "18px",
            width: "50px",
            height: "50px",
          }}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button
  onClick={playNext}
  style={{
    padding: "10px 15px",
    backgroundColor: "#666",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "18px",
    width: "50px",
    height: "50px",
  }}
>
  ⏭
</button>
      </div>

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

      {/* 📌 Popup chọn playlist */}
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
    </footer>
  );
};

export default Player;

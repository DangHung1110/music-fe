import React, { useState } from "react"; 
import { useParams } from "react-router-dom";
import { usePlayerStore } from "../../store/player";

const ArtistView = () => {
  const { name } = useParams();
  const { artist, setCurrentSong, currentSong } = usePlayerStore(); // 👈 Lấy currentSong

  const [currentPage, setCurrentPage] = useState(1);
  const tracksPerPage = 5;

  if (!artist) {
    return (
      <div className="text-white p-8">
        ❌ Không tìm thấy dữ liệu nghệ sĩ. Hãy quay lại và chọn lại từ ô tìm kiếm.
      </div>
    );
  }

  const indexOfLastTrack = currentPage * tracksPerPage;
  const indexOfFirstTrack = indexOfLastTrack - tracksPerPage;
  const currentTracks = artist.tracks.slice(indexOfFirstTrack, indexOfLastTrack);
  const totalPages = Math.ceil(artist.tracks.length / tracksPerPage);

  // 👇 Hàm xử lý khi bấm nút ▶ / ⏸
  const handleTogglePlay = (track) => {
    if (currentSong && currentSong.jamendo_id === track.jamendo_id) {
      // Nếu bấm lại đúng bài đang phát => dừng
      setCurrentSong(null);
    } else {
      // Nếu là bài khác => phát bài đó
      setCurrentSong(track);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner */}
      <div className="relative w-full h-64 bg-gradient-to-r from-purple-700 to-pink-500">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-6 left-6 flex items-center space-x-4">
          <img
            src={artist.cover_url}
            alt={artist.name}
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
          />
          <div className="text-white">
            <h1 className="text-3xl font-bold">{artist.name}</h1>
            <p className="text-sm opacity-80">#production #corporate #middleeastern</p>
          </div>
        </div>
      </div>

      {/* Tracks */}
      <div className="px-6 py-6">
        <h2 className="text-2xl font-bold mb-4 text-black">Most Popular</h2>
        <ul className="space-y-3">
          {currentTracks.map((track) => {
            const isPlaying = currentSong?.jamendo_id === track.jamendo_id; // 👈 kiểm tra
            return (
              <li
                key={track.jamendo_id}
                className="flex items-center justify-between bg-white rounded-lg shadow p-4 hover:shadow-lg transition text-black h-20 w-[600px]"
              >
                <div className="flex items-center space-x-3 w-[450px]">
                  <button
                    className="text-black hover:text-gray-700 text-xl"
                    onClick={() => handleTogglePlay(track)} // 👈 xử lý nút
                  >
                    {isPlaying ? "⏸" : "▶"}
                  </button>
                  <span className="font-medium text-black truncate w-[400px]">
                    {track.title}
                  </span>
                </div>
                <div className="flex items-center space-x-3 w-[120px] justify-end">
                  <button>❤️</button>
                  <button>⤴</button>
                  <button>⬇</button>
                </div>
              </li>
            );
          })}
        </ul>

        {/* ✅ Nút chuyển trang */}
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            ◀ Trang trước
          </button>

          <span className="text-black font-semibold">
            Trang {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            Trang sau ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistView;

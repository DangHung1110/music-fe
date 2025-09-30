// src/services/songs.jsx
const BASE_URL = "http://127.0.0.1:8000/api/v1/music";

// src/services/songs.jsx
// src/services/songs.jsx
const songService = {
  async searchSongs(keyword) {
    if (!keyword.trim()) return [];

    try {
      const res = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(keyword)}`);
      if (!res.ok) throw new Error("Không thể lấy dữ liệu bài hát");

      const data = await res.json();
      console.log("📡 API data:", data);

      // ✅ Nếu trả về danh sách bài hát
      if (data?.metadata?.tracks) {
        return data.metadata.tracks.map(track => ({
          type: "track",
          ...track,
        }));
      }

      // ✅ Nếu trả về danh sách nghệ sĩ
      if (data?.metadata?.artists?.length) {
        return data.metadata.artists.map(artist => ({
          type: "artist",
          name: artist.artist_name,
          tracks: artist.tracks,
          cover_url: artist.tracks?.[0]?.cover_url || "",
}));
}


      // ✅ (Fallback) Nếu API trả về duy nhất 1 nghệ sĩ (object)
      if (data?.metadata?.artist) {
        const a = data.metadata.artist;
        return [
          {
            type: "artist",
            name: a.artist_name,
            tracks: a.tracks,
            cover_url: a.tracks?.[0]?.cover_url || "",
          },
        ];
      }

      return [];
    } catch (err) {
      console.error("❌ Lỗi khi tìm kiếm nhạc:", err);
      return [];
    }
  },
};

export default songService;


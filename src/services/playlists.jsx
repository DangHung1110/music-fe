import api from "./api.jsx";

export default {
  // 📌 Tạo playlist mới
  async createPlaylist({ title, description, source }) {
    try {
      const response = await api.post("Playlist/create", {
        title,
        description,
        source,
      });
      return {
        success: true,
        message: response?.message || "Playlist created successfully",
        data: response?.metadata?.playlist,
      };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Create playlist failed",
      };
    }
  },

  // 📂 Lấy tất cả playlist của người dùng hiện tại
  async getMyPlaylists() {
    try {
      const response = await api.get("Playlist/my-playlists");
       console.log("getMyPlaylists response:", response);
      return {
        success: true,
        message: response?.message || "Playlists fetched successfully",
        data: response?.metadata?.playlists || [],
      };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Fetch playlist failed",
      };
    }
  },

  // 💾 Thêm bài hát vào playlist
  async saveToPlaylist(playlist_id, song_data) {
    try {
        console.log("saveToPlaylist called with:", playlist_id, song_data);
      const response = await api.post("Playlist/savetoplaylist", {
        playlist_id,
        song_data,
      });
      console.log(repsonse);
      return {
        success: true,
        message: response?.message || "Song saved to playlist successfully",
        data: response?.metadata?.SaveMusic,
      };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Save song failed",
      };
    }
  },

  // ❌ Xoá bài hát khỏi playlist
  async removeFromPlaylist(playlist_id, song_id) {
    try {
      const response = await api.delete(
        `Playlist/remove?playlist_id=${playlist_id}&song_id=${song_id}`
      );
      return {
        success: true,
        message: response?.message || "Song removed from playlist successfully",
        data: response?.metadata?.Removed,
      };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Remove song failed",
      };
    }
  },

  // 🗑️ Xoá playlist
  async deletePlaylist(playlist_id) {
    try {
      const response = await api.delete(
        `Playlist/delete?playlist_id=${playlist_id}`
      );
      return {
        success: true,
        message: response?.message || "Playlist deleted successfully",
        data: response?.metadata?.Deleted,
      };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Delete playlist failed",
      };
    }
  },

  // 🎵 Lấy bài hát trong playlist
  async getSongsInPlaylist(playlist_id) {
    try {
      const response = await api.get(`Playlist/${playlist_id}/songs`);
      return {
        success: true,
        data: response?.metadata?.songs || [],
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
};

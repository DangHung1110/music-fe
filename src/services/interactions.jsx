import api from './api.jsx';

const interactions = {
  // Likes
  async toggleLike(jamendoId) {
    try {
      const res = await api.post(`likes/songs/${encodeURIComponent(jamendoId)}/toggle`);
      const payload = res?.metadata || res;
      return { success: true, data: payload, liked: payload?.liked };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Toggle like failed' };
    }
  },

  async isLiked(jamendoId) {
    try {
      const res = await api.get(`likes/songs/${encodeURIComponent(jamendoId)}/is-liked`);
      const payload = res?.metadata || res;
      return { success: true, data: payload?.is_liked === true };
    } catch (err) {
      return { success: false, data: false };
    }
  },

  async likeCount(jamendoId) {
    try {
      const res = await api.get(`likes/songs/${encodeURIComponent(jamendoId)}/count`);
      const payload = res?.metadata || res;
      return { success: true, data: payload?.count ?? 0 };
    } catch {
      return { success: false, data: 0 };
    }
  },

  async getMyLikedSongIds() {
    try {
      const res = await api.get('likes/me/song-ids');
      const payload = res?.metadata || res.data || res;
      console.log('Liked song IDs payload:', payload);
      return { success: true, data: payload?.song_ids || [], total: payload?.total || (payload?.song_ids?.length ?? 0) };
    } catch (err) {
      return { success: false, data: [], total: 0, error: err.response?.data?.detail || 'Failed to fetch liked songs' };
    }
  },

  // Comments
  async listComments(jamendoId) {
    try {
      const res = await api.get(`comments/songs/${encodeURIComponent(jamendoId)}`);
      const payload = res?.metadata || res;
      return { success: true, data: payload?.items || payload || [] };
    } catch {
      return { success: false, data: [] };
    }
  },

  async addComment(jamendoId, content) {
    try {
      const res = await api.post(`comments/songs/${encodeURIComponent(jamendoId)}`, { content });
      return { success: true, data: res?.metadata || res };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Add comment failed' };
    }
  },
};

export default interactions;

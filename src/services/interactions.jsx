import api from './api.jsx';

const interactions = {
  // Likes
  async toggleLike(jamendoId) {
    try {
      const res = await api.post(`likes/songs/${encodeURIComponent(jamendoId)}/toggle`);
      return { success: true, data: res };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Toggle like failed' };
    }
  },

  async isLiked(jamendoId) {
    try {
      const res = await api.get(`likes/songs/${encodeURIComponent(jamendoId)}/is-liked`);
      return { success: true, data: res?.is_liked === true };
    } catch (err) {
      return { success: false, data: false };
    }
  },

  async likeCount(jamendoId) {
    try {
      const res = await api.get(`likes/songs/${encodeURIComponent(jamendoId)}/count`);
      return { success: true, data: res?.count ?? 0 };
    } catch {
      return { success: false, data: 0 };
    }
  },

  // Comments
  async listComments(jamendoId) {
    try {
      const res = await api.get(`comments/songs/${encodeURIComponent(jamendoId)}`);
      return { success: true, data: res?.items || [] };
    } catch {
      return { success: false, data: [] };
    }
  },

  async addComment(jamendoId, content) {
    try {
      const res = await api.post(`comments/songs/${encodeURIComponent(jamendoId)}`, { content });
      return { success: true, data: res };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Add comment failed' };
    }
  },
};

export default interactions;

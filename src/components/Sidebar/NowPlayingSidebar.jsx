import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Heart, MessageCircle, Send, X, MoreVertical, Trash2 } from 'lucide-react';
import api from '../../services/api';

const NowPlayingSidebar = ({ isOpen, onClose }) => {
  const currentTrack = useSelector((state) => state.player.currentTrack);
  const user = useSelector((state) => state.auth.user);
  
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentTrack?.id) {
      fetchLikeStatus();
      fetchComments();
    }
  }, [currentTrack?.id]);

  const fetchLikeStatus = async () => {
    try {
      const response = await api.get(`/likes/songs/${currentTrack.id}/status`);
      setIsLiked(response.data.is_liked);
      setLikesCount(response.data.likes_count);
    } catch (error) {
      console.error('Error fetching like status:', error);
      setIsLiked(false);
      setLikesCount(0);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/songs/${currentTrack.id}`);
      setComments(response.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để like bài hát!');
      return;
    }

    try {
      if (isLiked) {
        await api.delete(`/likes/songs/${currentTrack.id}`);
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        await api.post(`/likes/songs/${currentTrack.id}`);
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Vui lòng đăng nhập để comment!');
      return;
    }
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await api.post(`/comments/songs/${currentTrack.id}`, {
        content: newComment.trim()
      });
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này?')) return;

    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  if (!currentTrack) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div 
        className={`fixed right-0 top-0 h-full w-full sm:w-[400px] bg-zinc-900 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white truncate flex-1">
              {currentTrack.name || currentTrack.title}
            </h2>
            <button
              onClick={onClose}
              className="ml-2 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Album Art */}
            <div className="p-4">
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={currentTrack.image || currentTrack.cover_url || '/placeholder-album.png'}
                  alt={currentTrack.name || currentTrack.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Song Info */}
            <div className="px-4 pb-4">
              <h3 className="text-2xl font-bold text-white mb-2">
                {currentTrack.name || currentTrack.title}
              </h3>
              <p className="text-sm text-gray-400">
                {currentTrack.artist_name || currentTrack.artist || 'Unknown Artist'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 px-4 pb-6 border-b border-white/10">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  isLiked
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Heart
                  className="w-5 h-5"
                  fill={isLiked ? 'currentColor' : 'none'}
                />
                <span className="text-sm font-medium">{likesCount}</span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{comments.length}</span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Comments Section */}
            <div className="p-4">
              <h4 className="text-lg font-semibold text-white mb-4">
                Bình luận ({comments.length})
              </h4>

              {/* Add Comment Form */}
              {user ? (
                <form onSubmit={handleAddComment} className="mb-6">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                    <img
                      src={user.avatar_url || '/default-avatar.png'}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <input
                      type="text"
                      placeholder="Viết bình luận..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      disabled={loading}
                      className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-gray-500"
                    />
                    <button
                      type="submit"
                      disabled={loading || !newComment.trim()}
                      className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mb-6 p-4 rounded-lg bg-white/5 text-center">
                  <p className="text-sm text-gray-400">
                    Vui lòng <span className="text-green-500 font-semibold">đăng nhập</span> để bình luận
                  </p>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="py-8 text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm text-gray-500">Chưa có bình luận nào</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 group">
                      <img
                        src={comment.user?.avatar_url || '/default-avatar.png'}
                        alt={comment.user?.username}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-semibold text-white truncate">
                            {comment.user?.username || 'Anonymous'}
                          </span>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 break-words">
                          {comment.content}
                        </p>
                      </div>
                      {user?.id === comment.user_id && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NowPlayingSidebar;
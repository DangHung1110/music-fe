import React, { useEffect, useState } from 'react';
import { usePlayerStore } from '../../store/player';
import { useAuthStore } from '../../store/auth';
import interactions from '../../services/interactions.jsx';

const NowPlayingSidebar = ({ isOpen, onClose }) => {
  const { currentSong } = usePlayerStore();
  const { isAuthenticated } = useAuthStore();

  const jamendoId = currentSong?.id;

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!jamendoId || !isOpen) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      const [likedRes, countRes, commentsRes] = await Promise.all([
        interactions.isLiked(jamendoId),
        interactions.likeCount(jamendoId),
        interactions.listComments(jamendoId),
      ]);
      if (!mounted) return;
      setIsLiked(likedRes.data === true);
      setLikeCount(countRes.data || 0);
      setComments(commentsRes.data || []);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [jamendoId, isOpen]);

  const toggleLike = async () => {
    if (!isAuthenticated) return alert('Vui lòng đăng nhập để thích bài hát');
    const res = await interactions.toggleLike(jamendoId);
    if (res.success) {
      setIsLiked((v) => !v);
      setLikeCount((c) => (isLiked ? Math.max(0, c - 1) : c + 1));
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return alert('Vui lòng đăng nhập để bình luận');
    if (!newComment.trim()) return;
    setPosting(true);
    const res = await interactions.addComment(jamendoId, newComment.trim());
    if (res.success) {
      setNewComment('');
      const list = await interactions.listComments(jamendoId);
      setComments(list.data || []);
    }
    setPosting(false);
  };

  if (!isOpen) return null;

  return (
    <aside className="fixed right-0 top-0 bottom-0 w-[360px] bg-gray-900 border-l border-gray-800 z-40 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Đang phát</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>

      {currentSong ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={currentSong.image} alt={currentSong.name} className="w-16 h-16 rounded" />
            <div>
              <div className="text-white font-medium">{currentSong.name}</div>
              <div className="text-gray-400 text-sm">{currentSong.artist_name}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleLike} className={`px-3 py-1 rounded-md border ${isLiked ? 'border-pink-500 text-pink-400' : 'border-gray-600 text-gray-300'} hover:bg-white/5`}>
              {isLiked ? '♥ Đã thích' : '♡ Thích'}
            </button>
            <div className="text-gray-400 text-sm">{likeCount} lượt thích</div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">Bình luận</h4>
            {loading ? (
              <div className="text-gray-400 text-sm">Đang tải...</div>
            ) : comments.length === 0 ? (
              <div className="text-gray-500 text-sm">Chưa có bình luận nào</div>
            ) : (
              <ul className="space-y-3">
                {comments.map((c) => (
                  <li key={c.id || `${c.user_id}-${c.created_at}`} className="bg-gray-800 border border-gray-700 rounded p-3">
                    <div className="text-gray-300 text-sm whitespace-pre-wrap">{c.content}</div>
                    <div className="text-gray-500 text-xs mt-1">{c.username || c.user_name || 'Người dùng'}</div>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={submitComment} className="mt-3 flex gap-2">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white outline-none"
                placeholder="Viết bình luận..."
              />
              <button disabled={posting} className="px-3 py-2 bg-green-500 text-black rounded text-sm font-semibold disabled:opacity-50">
                Gửi
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="text-gray-400 text-sm">Chưa chọn bài hát nào</div>
      )}
    </aside>
  );
};

export default NowPlayingSidebar;

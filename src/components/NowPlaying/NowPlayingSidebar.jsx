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

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  const toggleLike = async () => {
    if (!isAuthenticated) return alert('Vui lòng đăng nhập để thích bài hát');
    const res = await interactions.toggleLike(jamendoId);
    if (res.success) {
      const liked = res.liked !== undefined ? res.liked === true : !isLiked;
      setIsLiked(liked);
      setLikeCount((c) => {
        if (liked && !isLiked) return c + 1;
        if (!liked && isLiked) return Math.max(0, c - 1);
        return c;
      });
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
    <aside className="fixed right-0 top-0 bottom-20 w-[420px] bg-black border-l border-gray-800 z-40 overflow-hidden shadow-2xl shadow-black/50">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 sticky top-0 bg-black">
        <h3 className="text-white font-semibold">Đang phát</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>

      {currentSong ? (
        <div className="flex flex-col h-full min-h-0">
          <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-6">
            {/* Artwork & meta */}
            <section className="pt-5">
              <img
                src={currentSong.image || currentSong.cover_url || 'https://via.placeholder.com/400?text=♪'}
                alt={currentSong.name}
                className="w-full aspect-square rounded-lg object-cover shadow-2xl"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400?text=♪';
                }}
              />
              <div className="mt-4">
                <div className="text-white font-bold text-lg truncate">{currentSong.name}</div>
                <div className="text-gray-400 text-sm truncate">{currentSong.artist_name}</div>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={toggleLike}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    isLiked ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                  }`}
                >
                  {isLiked ? 'Đã thích' : 'Thích'}
                </button>
                <div className="text-gray-400 text-sm">{likeCount} lượt thích</div>
              </div>
            </section>

            {/* Comments */}
            <section>
              <h4 className="text-white font-semibold mb-3">Bình luận</h4>
              <form
                onSubmit={submitComment}
                className="flex gap-2 mb-4"
              >
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-gray-900 border border-gray-800 rounded px-3 py-2 text-sm text-white outline-none"
                  placeholder={isAuthenticated ? 'Viết bình luận...' : 'Đăng nhập để bình luận'}
                  disabled={!isAuthenticated || posting}
                />
                <button
                  disabled={!isAuthenticated || posting || !newComment.trim()}
                  className="px-4 py-2 bg-green-500 text-black rounded-full text-sm font-semibold disabled:opacity-50"
                >
                  Gửi
                </button>
              </form>
              {!isAuthenticated && (
                <p className="text-xs text-gray-500 mb-3">
                  Bạn cần đăng nhập để gửi bình luận.
                </p>
              )}
              {loading ? (
                <div className="text-gray-400 text-sm">Đang tải...</div>
              ) : comments.length === 0 ? (
                <div className="text-gray-500 text-sm">Chưa có bình luận nào</div>
              ) : (
                <ul className="space-y-3">
                  {comments.map((c) => (
                    <li key={c.id || `${c.user_id}-${c.created_at}`} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                      <div className="text-gray-200 text-sm whitespace-pre-wrap">{c.content}</div>
                      <div className="text-gray-500 text-xs mt-1">{c.username || c.user_name || 'Người dùng'}</div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      ) : (
        <div className="p-5 text-gray-400 text-sm">Chưa chọn bài hát nào</div>
      )}
    </aside>
  );
};

export default NowPlayingSidebar;

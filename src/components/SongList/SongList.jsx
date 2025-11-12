import React from 'react';
import { usePlayerStore } from '../../store/player';
import { Play } from 'lucide-react';

const SongList = ({ songs, isLoading }) => {
  const { setQueue } = usePlayerStore();

  const handlePlaySong = (index) => {
    if (!songs || songs.length === 0) return;
    setQueue(songs, index);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center gap-4 p-3 rounded-lg bg-gray-700/50">
            <div className="w-12 h-12 rounded bg-gray-600"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!songs || songs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>Không có bài hát nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-[2px]">
      {songs.map((song, index) => (
        <div
          key={song.id || index}
          className="group flex items-center gap-4 px-4 py-2 rounded-md hover:bg-white/10 transition-all duration-200 cursor-pointer"
          onClick={() => handlePlaySong(index)}
        >
          {/* Index/Play button */}
          <div className="w-6 flex items-center justify-center flex-shrink-0">
            <span className="group-hover:hidden text-gray-400 text-sm font-medium">{index + 1}</span>
            <button
              className="hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full bg-green-500 hover:bg-green-400 hover:scale-110 transition-all shadow-lg shadow-green-500/50"
              onClick={(e) => {
                e.stopPropagation();
                handlePlaySong(index);
              }}
            >
              <Play className="w-3.5 h-3.5 text-black ml-0.5" fill="black" />
            </button>
          </div>

          {/* Album art */}
          <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0 shadow-lg">
            <img
              src={song.image || song.album_image || song.cover_url || 'https://via.placeholder.com/56x56?text=♪'}
              alt={song.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/56x56?text=♪';
              }}
            />
          </div>

          {/* Song info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium truncate text-sm hover:underline">{song.name || song.title}</h4>
            <p className="text-gray-400 text-sm truncate mt-0.5">{song.artist_name || song.artist || 'Unknown Artist'}</p>
          </div>

          {/* Duration */}
          <div className="text-gray-400 text-sm font-medium flex-shrink-0">
            {formatDuration(song.duration)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SongList;


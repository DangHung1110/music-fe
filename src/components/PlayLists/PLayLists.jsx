import React, { useState, useEffect } from "react";
import playlistService from "../../services/playlists.jsx";
import { usePlayerStore } from "../../store/player";

const PlayLists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [showCreateBox, setShowCreateBox] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [newPlaylist, setNewPlaylist] = useState({
    title: "",
    description: "",
    source: "Local",
  });

  const setQueue = usePlayerStore((state) => state.setQueue);
  const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);

  const handlePlayPlaylist = async (playlist) => {
    const result = await playlistService.getSongsInPlaylist(playlist.id);
    if (result.success && result.data.length > 0) {
      const songs = result.data;
      setQueue(songs);
    } else {
      alert("❌ Playlist này không có bài hát để phát.");
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    const result = await playlistService.getMyPlaylists();
    if (result.success) {
      setPlaylists(result.data);
    } else {
      alert("❌ Không tải được danh sách playlist: " + result.error);
    }
  };

  const handleCreate = async () => {
    if (!newPlaylist.title.trim()) {
      alert("❗ Vui lòng nhập tên playlist");
      return;
    }
    const result = await playlistService.createPlaylist(newPlaylist);
    if (result.success) {
      alert("✅ Tạo playlist thành công!");
      setPlaylists((prev) => [...prev, result.data]);
      setNewPlaylist({ title: "", description: "", source: "Local" });
      setShowCreateBox(false);
    } else {
      alert("❌ " + result.error);
    }
  };

  const handleDeletePlaylist = async (playlist_id) => {
    const result = await playlistService.deletePlaylist(playlist_id);
    if (result.success) {
      alert("✅ Playlist đã bị xoá!");
      setPlaylists((prev) => prev.filter((p) => p.id !== playlist_id));
      if (selectedPlaylist?.id === playlist_id) setSelectedPlaylist(null);
    } else {
      alert("❌ " + result.error);
    }
  };

  const handleSelectPlaylist = async (playlist) => {
    setSelectedPlaylist(playlist);
    const result = await playlistService.getSongsInPlaylist(playlist.id);
    if (result.success) {
      setSongs(result.data);
    } else {
      alert("❌ Không tải được danh sách bài hát");
    }
  };

  const handlePlaySong = (song) => {
    setCurrentSong(song);
  };

  return (
    <div className="min-h-full w-full bg-[#121212] p-6 text-white font-sans">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Playlists</h1>
        <button
          onClick={() => setShowCreateBox(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1ed760] text-black font-semibold rounded-full hover:bg-[#1db954] transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 3v4H6v6h4v4h2v-4h4V7h-4V3h-2z" />
          </svg>
          New Playlist
        </button>
      </header>

      {/* Create Playlist Form */}
      {showCreateBox && (
        <div className="bg-[#282828] p-6 rounded-lg mb-8 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Create New Playlist</h2>
          <input
            type="text"
            placeholder="Playlist Name"
            className="w-full p-3 mb-4 bg-[#3e3e3e] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1db954] placeholder-gray-400"
            value={newPlaylist.title}
            onChange={(e) =>
              setNewPlaylist({ ...newPlaylist, title: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Description (optional)"
            className="w-full p-3 mb-4 bg-[#3e3e3e] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1db954] placeholder-gray-400"
            value={newPlaylist.description}
            onChange={(e) =>
              setNewPlaylist({ ...newPlaylist, description: e.target.value })
            }
          />
          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              className="px-5 py-2 bg-[#1ed760] text-black font-semibold rounded-full hover:bg-[#1db954] transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => setShowCreateBox(false)}
              className="px-5 py-2 bg-[#3e3e3e] text-white font-semibold rounded-full hover:bg-[#4e4e4e] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Playlists Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Playlists</h2>
        {playlists.length === 0 ? (
          <p className="text-gray-400">No playlists yet. Create one to get started!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {playlists.map((p) => (
              <div
                key={p.id}
                className="group bg-[#282828] rounded-lg p-4 hover:bg-[#3e3e3e] transition-colors shadow-md"
              >
                <div
                  onClick={() => handleSelectPlaylist(p)}
                  className="cursor-pointer"
                >
                  <div className="w-full h-40 bg-gradient-to-br from-[#1db954] to-[#121212] rounded-md mb-3"></div>
                  <h3 className="text-lg font-semibold truncate">{p.title}</h3>
                  <p className="text-sm text-gray-400 truncate">{p.description || "No description"}</p>
                </div>
                <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handlePlayPlaylist(p)}
                    className="flex-1 px-3 py-2 bg-[#1ed760] text-black rounded-full hover:bg-[#1db954] transition-colors"
                  >
                    Play
                  </button>
                  <button
                    onClick={() => handleDeletePlaylist(p.id)}
                    className="flex-1 px-3 py-2 bg-[#ff4d4d] text-white rounded-full hover:bg-[#ff3333] transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Playlist Songs */}
      {selectedPlaylist && (
        <div className="bg-[#282828] p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold mb-4">
            {selectedPlaylist.title}
          </h2>
          {songs.length === 0 ? (
            <p className="text-gray-400">No songs in this playlist yet.</p>
          ) : (
            <div className="space-y-2">
              {songs.map((song) => (
                <div
                  key={song.id}
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-[#3e3e3e] cursor-pointer transition-colors"
                  onClick={() => handlePlaySong(song)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1db954] to-[#121212] rounded-md"></div>
                    <div>
                      <p className="font-medium">{song.title}</p>
                      <p className="text-sm text-gray-400">{song.artist?.name || "Unknown"}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{song.duration || 0}s</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayLists;
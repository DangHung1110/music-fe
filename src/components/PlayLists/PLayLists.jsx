import React, { useState, useEffect, useRef } from "react";
import playlistService from "../../services/playlists.jsx";
import { usePlayerStore } from "../../store/player";
import { Plus, MoreVertical, Play, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

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
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

  const setQueue = usePlayerStore((state) => state.setQueue);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach((id) => {
        if (
          dropdownRefs.current[id] &&
          !dropdownRefs.current[id].contains(event.target)
        ) {
          setOpenDropdownId(null);
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handlePlaySong = (index) => {
    setQueue(songs, index);
  };

  return (
    <div className="min-h-screen w-full bg-[#121212] p-6 text-white font-sans">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Playlists</h1>
        <Dialog open={showCreateBox} onOpenChange={setShowCreateBox}>
          <Button
            onClick={() => setShowCreateBox(true)}
            className="flex items-center gap-2 rounded-full"
          >
            <Plus className="w-5 h-5" />
            New Playlist
          </Button>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
              <DialogDescription>
                Tạo playlist mới để lưu các bài hát yêu thích của bạn.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Input
                placeholder="Playlist Name"
                value={newPlaylist.title}
                onChange={(e) =>
                  setNewPlaylist({ ...newPlaylist, title: e.target.value })
                }
              />
              <Input
                placeholder="Description (optional)"
                value={newPlaylist.description}
                onChange={(e) =>
                  setNewPlaylist({
                    ...newPlaylist,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowCreateBox(false);
                  setNewPlaylist({ title: "", description: "", source: "Local" });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      {/* Playlists List - Horizontal Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Playlists</h2>
        {playlists.length === 0 ? (
          <p className="text-gray-400">
            No playlists yet. Create one to get started!
          </p>
        ) : (
          <ScrollArea className="h-[500px] w-full">
            <div className="space-y-2 pr-4">
              {playlists.map((p) => {
                const songCount = p.songs?.length || 0;
                return (
                  <div
                    key={p.id}
                    className="group flex items-center gap-4 p-2.5 bg-[#282828] rounded-lg hover:bg-[#3e3e3e] transition-all hover:scale-[1.01] cursor-pointer"
                    onClick={() => handleSelectPlaylist(p)}
                  >
                    {/* Thumbnail bên trái */}
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1db954] to-[#121212] rounded-lg flex-shrink-0"></div>
                    {/* Playlist info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold truncate text-white">
                        {p.title}
                      </h3>
                      <p className="text-sm text-gray-400 truncate">
                        {songCount} {songCount === 1 ? "bài hát" : "bài hát"}
                      </p>
                    </div>
                    {/* 3-dot dropdown menu */}
                    <div
                      ref={(el) => (dropdownRefs.current[p.id] = el)}
                      className="relative flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          setOpenDropdownId(
                            openDropdownId === p.id ? null : p.id
                          )
                        }
                        className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                      {openDropdownId === p.id && (
                        <div className="absolute right-0 top-full mt-2 z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-700 bg-[#282828] shadow-lg">
                          <div
                            className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayPlaylist(p);
                              setOpenDropdownId(null);
                            }}
                          >
                            <Play className="w-4 h-4" />
                            Play
                          </div>
                          <div
                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 cursor-pointer transition-colors border-t border-gray-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                window.confirm(
                                  "Bạn có chắc muốn xóa playlist này?"
                                )
                              ) {
                                handleDeletePlaylist(p.id);
                              }
                              setOpenDropdownId(null);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Selected Playlist Songs */}
      {selectedPlaylist && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{selectedPlaylist.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {songs.length === 0 ? (
              <p className="text-gray-400">No songs in this playlist yet.</p>
            ) : (
              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-2 pr-4">
                  {songs.map((song, index) => (
                    <div
                      key={song.id}
                      className="flex justify-between items-center p-2.5 rounded-lg hover:bg-[#3e3e3e] cursor-pointer transition-colors"
                      onClick={() => handlePlaySong(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#1db954] to-[#121212] rounded-lg flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-white">{song.title}</p>
                          <p className="text-sm text-gray-400">
                            {song.artist?.name || "Unknown"}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">
                        {song.duration || 0}s
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlayLists;
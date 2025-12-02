import { create } from "zustand";

const normalizeSong = (song = {}) => {
  const rawId = song.jamendo_id || song.id;
  const id = rawId !== undefined && rawId !== null ? String(rawId) : undefined;
  return {
    id,
    name: song.title || song.name || "Unknown title",
    duration: song.duration || 0,
    audio: song.audio || song.file_url || song.audiodownload || null,
    image: song.cover_url || song.album_image || song.image || null,
    artist_id: song.artist_id || song.artist?.id || null,
    artist_name:
      song.artist_name ||
      song.artist?.name ||
      song.artist ||
      "Unknown Artist",
    album_id: song.album_id || song.album?.id || null,
    album_name:
      song.album_name ||
      song.album?.title ||
      song.album?.name ||
      song.album ||
      null,
  };
};

export const usePlayerStore = create((set, get) => ({
  search_type: "track",
  currentSong: null,
  artist: null,
  isPlaying: false,
  queue: [], // 👉 danh sách bài hát
  currentIndex: -1, // 👉 index bài hiện tại trong queue

  setQueue: (songs = [], startIndex = 0) =>
    set(() => {
      const normalizedQueue = songs.map(normalizeSong).filter((track) => track.audio);
      const safeIndex =
        normalizedQueue.length > 0
          ? Math.min(
              Math.max(startIndex, 0),
              normalizedQueue.length - 1
            )
          : -1;
      return {
        queue: normalizedQueue,
        currentIndex: safeIndex,
        currentSong: safeIndex >= 0 ? normalizedQueue[safeIndex] : null,
        search_type: "track",
      };
    }),

  setCurrentSong: (song) =>
    set((state) => {
      const normalized = normalizeSong(song);
      const idx = state.queue.findIndex(
        (s) => s.id !== undefined && s.id === normalized.id
      );

      if (idx >= 0) {
        return {
          currentSong: state.queue[idx],
          currentIndex: idx,
          search_type: "track",
        };
      }

      return {
        currentSong: normalized,
        currentIndex: -1, // reset index
        queue: [], // xoá queue cũ
        search_type: "track",
      };
    }),

  setArtist: (artist) => set({ artist, search_type: "artist" }),
  setSearchType: (type) => set({ search_type: type }),

  playNext: () => {
    const { currentIndex, queue } = get();
    if (queue.length === 0) return;
    const nextIndex =
      currentIndex + 1 < queue.length ? currentIndex + 1 : 0;
    set({
      currentIndex: nextIndex,
      currentSong: queue[nextIndex],
      isPlaying: true,
    });
  },

  playPrev: () => {
    const { currentIndex, queue } = get();
    if (queue.length === 0) return;
    const prevIndex =
      currentIndex - 1 >= 0 ? currentIndex - 1 : queue.length - 1;
    set({
      currentIndex: prevIndex,
      currentSong: queue[prevIndex],
      isPlaying: true,
    });
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));

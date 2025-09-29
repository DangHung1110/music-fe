import { create } from "zustand";

export const usePlayerStore = create((set, get) => ({
  search_type: "track",
  currentSong: null,
  artist: null,
  isPlaying: false,
  queue: [], // 👉 danh sách bài hát
  currentIndex: -1, // 👉 index bài hiện tại trong queue

 setQueue: (songs) =>
  set({
    queue: songs.map((song) => ({
      id: song.jamendo_id || song.id,
      name: song.title || song.name,
      duration: song.duration || 0,
      audio: song.audio || song.file_url,
      image: song.cover_url || song.image,
      artist_id: song.artist_id,
      artist_name: song.artist_name,
      album_id: song.album_id || null,
      album_name: song.album_name || null,
    })),
    currentIndex: songs.length > 0 ? 0 : -1,
    currentSong:
      songs.length > 0
        ? {
            id: songs[0].jamendo_id || songs[0].id,
            name: songs[0].title || songs[0].name,
            duration: songs[0].duration || 0,
            audio: songs[0].audio || songs[0].file_url,
            image: songs[0].cover_url || songs[0].image,
            artist_id: songs[0].artist_id,
            artist_name: songs[0].artist_name,
            album_id: songs[0].album_id || null,
            album_name: songs[0].album_name || null,
          }
        : null,
  }),

 setCurrentSong: (song) =>
  set((state) => {
    const idx = state.queue.findIndex((s) => s.id === song.id);

    // Nếu bài hát có trong queue thì cập nhật index
    if (idx >= 0) {
      return {
        currentSong: {
          id: song.jamendo_id || song.id,
          name: song.title || song.name,
          duration: song.duration || 0,
          audio: song.audio || song.file_url,
          image: song.cover_url || song.image,
          artist_id: song.artist_id,
          artist_name: song.artist_name,
          album_id: song.album_id || null,
          album_name: song.album_name || null,
        },
        currentIndex: idx,
        search_type: "track",
      };
    }

    // Nếu bài hát không thuộc queue → phát đơn lẻ, clear queue
    return {
      currentSong: {
        id: song.jamendo_id || song.id,
        name: song.title || song.name,
        duration: song.duration || 0,
        audio: song.audio || song.file_url,
        image: song.cover_url || song.image,
        artist_id: song.artist_id,
        artist_name: song.artist_name,
        album_id: song.album_id || null,
        album_name: song.album_name || null,
      },
      currentIndex: -1, // reset index
      queue: [],        // xoá queue cũ
      search_type: "track",
    };
  }),

  setArtist: (artist) => set({ artist, search_type: "artist" }),
  setSearchType: (type) => set({ search_type: type }),

  // 👉 Next
playNext: () => {
  const { currentIndex, queue } = get();
  if (queue.length === 0 || currentIndex === -1) return; // 👈 thêm check này
  const nextIndex = (currentIndex + 1) % queue.length;
  set({
    currentIndex: nextIndex,
    currentSong: queue[nextIndex],
    isPlaying: true,
  });
},

playPrev: () => {
  const { currentIndex, queue } = get();
  if (queue.length === 0 || currentIndex === -1) return; // 👈 thêm check này
  const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
  set({
    currentIndex: prevIndex,
    currentSong: queue[prevIndex],
    isPlaying: true,
  });
},

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));

import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../store/auth";
import authService from "../../services/auth.jsx";
import songService from "../../services/songs.jsx";
import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "../../store/player";

const Topbar = () => {
  const navigate = useNavigate();
  const { user, refreshToken, sessionId, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
 


  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);
const setArtist = usePlayerStore((state) => state.setArtist);
const setSearchType = usePlayerStore((state) => state.setSearchType);
  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initials = (user?.full_name || user?.username || user?.email || "?")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const displayName = user?.full_name || user?.username || user?.email || "Khách";

  const handleLogout = async () => {
    try {
      await authService.logout({ sessionId, refreshToken });
    } catch {}
    logout();
    navigate("/auth/login");
  };


  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const data = await songService.searchSongs(query);
      setResults(data || []);
      setShowDropdown(data?.length > 0);
    }, 300); 

    return () => clearTimeout(timeout);
  }, [query]);


 const handleSelectResult = (item) => {
   console.log("📦 item:", item);
  setShowDropdown(false);

  if (item.type === "artist") {
    // 👉 Khi click vào nghệ sĩ
    setSearchType("artist");
    setArtist(item); // item chứa thông tin nghệ sĩ + list nhạc
    setQuery(item.name);
    console.log("🎤 Đã chọn nghệ sĩ:", item.name);
    navigate(`/artist/${item.name}`);

  } else {
    // 👉 Khi click vào bài hát
    setSearchType("track");
    setCurrentSong(item);
    setQuery(item.title);
    console.log("🎶 Đã chọn bài hát:", item.title);
  }
};

  return (
    <header className="flex gap-4 items-center justify-between mb-6">
      {/* Ô tìm kiếm */}
      <div className="flex-1 relative" ref={searchRef}>
        <input
          className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 text-sm outline-none"
          placeholder="Tìm bài hát, nghệ sĩ, album..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
        />

        {/* Dropdown danh sách nhạc */}
        {showDropdown && results.length > 0 && (
          <ul className="absolute top-full left-0 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
  {results.map((item, idx) => (
    <li
      key={item.id || idx}
      onClick={() => handleSelectResult(item)}
      className="px-4 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer flex items-center gap-2"
    >
      <img
        src={item.cover_url}
        alt={item.title || item.name}
        className="w-10 h-10 rounded object-cover"
      />
      <div>
        <p className="font-medium">{item.title || item.name}</p>
        <p className="text-xs text-gray-400">
          {item.type === "artist" ? "Nghệ sĩ" : "Bài hát"}
        </p>
      </div>
    </li>
  ))}
</ul>

        )}
      </div>

      {/* Menu tài khoản */}
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 hover:bg-gray-600 text-white"
        >
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-400/30 to-green-500/30 flex items-center justify-center border border-gray-600 text-white font-bold text-xs">
            {initials}
          </div>
          <span className="hidden sm:block text-sm">{displayName}</span>
          <svg
            className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-600 rounded-lg shadow-xl overflow-hidden z-10">
            <div className="px-4 py-3 border-b border-gray-600">
              <p className="text-sm text-gray-300">Đăng nhập dưới tên</p>
              <p className="text-white font-medium truncate">{displayName}</p>
            </div>
            <button
              onClick={() => navigate("/account")}
              className="w-full text-left px-4 py-3 text-gray-200 hover:bg-gray-700 text-sm"
            >
              Quản lý tài khoản
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-red-300 hover:bg-red-900/40 text-sm border-t border-gray-600"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;

import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../store/auth";
import authService from "../../services/auth.jsx";
import songService from "../../services/songs.jsx";
import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "../../store/player";

const Topbar = () => {
  const navigate = useNavigate();
  const { user, accessToken, refreshToken, sessionId, logout, isAuthenticated } = useAuthStore();
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
    } catch (error){
      console.error("Logout failed:", error);
    }
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
    <header className="flex gap-4 items-center justify-between">
      {/* Ô tìm kiếm */}
      <div className="flex-1 relative max-w-lg" ref={searchRef}>
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="w-full bg-white/10 border-0 rounded-full px-12 py-3 text-white placeholder-gray-400 text-sm outline-none focus:bg-white/20 focus:ring-2 focus:ring-white/20 transition-all"
            placeholder="Tìm bài hát, nghệ sĩ, album..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
          />
        </div>

        {/* Dropdown danh sách nhạc */}
        {showDropdown && results.length > 0 && (
          <ul className="absolute top-full left-0 w-full mt-2 bg-gray-800/95 backdrop-blur-xl rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto border border-gray-700/50">
            {results.map((item, idx) => (
              <li
                key={item.id || idx}
                onClick={() => handleSelectResult(item)}
                className="px-4 py-3 text-sm text-white hover:bg-white/10 cursor-pointer flex items-center gap-3 transition-colors"
              >
                <img
                  src={item.cover_url || 'https://via.placeholder.com/40?text=♪'}
                  alt={item.title || item.name}
                  className="w-10 h-10 rounded object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/40?text=♪';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.title || item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
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
        {isAuthenticated ? (
          <>
            <button 
              onClick={() => setOpen((v) => !v)} 
              className="flex items-center gap-3 px-3 py-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-black font-bold text-xs shadow-lg shadow-green-500/30">
                {initials}
              </div>
              <span className="hidden sm:block text-sm font-medium">{displayName}</span>
              <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/>
              </svg>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-lg shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-700/50">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Đăng nhập dưới tên</p>
                  <p className="text-white font-semibold truncate mt-1">{displayName}</p>
                </div>
                <button 
                  onClick={() => {
                    navigate("/account");
                    setOpen(false);
                  }} 
                  className="w-full text-left px-4 py-3 text-gray-300 hover:bg-white/10 text-sm transition-colors"
                >
                  Quản lý tài khoản
                </button>
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/20 text-sm border-t border-gray-700/50 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate("/auth/login")}
              className="px-6 py-2.5 rounded-full bg-transparent hover:bg-white/10 text-white font-medium text-sm transition-all"
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => navigate("/auth/register")}
              className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:scale-105 transition-all shadow-lg"
            >
              Đăng ký
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;

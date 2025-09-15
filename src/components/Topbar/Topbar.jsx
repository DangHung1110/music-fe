import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../store/auth";
import authService from "../../services/auth.jsx";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();
  const { user, accessToken, refreshToken, sessionId, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
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

  return (
    <header className="flex gap-4 items-center justify-between mb-6">
      <div className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-4 py-3">
        <input 
          className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400 text-sm" 
          placeholder="Tìm bài hát, nghệ sĩ, album..." 
        />
      </div>
      <div ref={menuRef} className="relative">
        <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 hover:bg-gray-600 text-white">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cyan-400/30 to-green-500/30 flex items-center justify-center border border-gray-600 text-white font-bold text-xs">
            {initials}
          </div>
          <span className="hidden sm:block text-sm">{displayName}</span>
          <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/></svg>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-600 rounded-lg shadow-xl overflow-hidden z-10">
            <div className="px-4 py-3 border-b border-gray-600">
              <p className="text-sm text-gray-300">Đăng nhập dưới tên</p>
              <p className="text-white font-medium truncate">{displayName}</p>
            </div>
            <button onClick={() => navigate("/account")} className="w-full text-left px-4 py-3 text-gray-200 hover:bg-gray-700 text-sm">Quản lý tài khoản</button>
            <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-300 hover:bg-red-900/40 text-sm border-t border-gray-600">Đăng xuất</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;

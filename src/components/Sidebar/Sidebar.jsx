import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

const Sidebar = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <aside className="bg-gray-800 border border-gray-700 rounded-2xl p-4 h-[calc(100vh-112px)] sticky top-4 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-cyan-400 flex items-center justify-center text-black font-extrabold text-lg">
          ♪
        </div>
        <span className="text-white font-bold text-lg">Music.FE</span>
      </div>
      
      <nav className="flex flex-col gap-2 mt-2">
        <Link 
          to="/"
          className="text-gray-400 hover:text-white hover:bg-gray-700 border border-transparent rounded-lg px-3 py-3 transition-all duration-200 hover:-translate-y-0.5 no-underline flex items-center gap-3" 
        >
          <span className="text-lg">🏠</span>
          <span>Trang chủ</span>
        </Link>
        
        {isAuthenticated ? (
          <>
            <Link 
              to="/library"
              className="text-gray-400 hover:text-white hover:bg-gray-700 border border-transparent rounded-lg px-3 py-3 transition-all duration-200 hover:-translate-y-0.5 no-underline flex items-center gap-3" 
            >
              <span className="text-lg">📚</span>
              <span>Thư viện</span>
            </Link>
            <Link 
              to="/playlists"
              className="text-gray-400 hover:text-white hover:bg-gray-700 border border-transparent rounded-lg px-3 py-3 transition-all duration-200 hover:-translate-y-0.5 no-underline flex items-center gap-3" 
            >
              <span className="text-lg">🎵</span>
              <span>Playlist</span>
            </Link>
            <Link 
              to="/favorites"
              className="text-gray-400 hover:text-white hover:bg-gray-700 border border-transparent rounded-lg px-3 py-3 transition-all duration-200 hover:-translate-y-0.5 no-underline flex items-center gap-3" 
            >
              <span className="text-lg">❤️</span>
              <span>Yêu thích</span>
            </Link>
          </>
        ) : (
          <>
            <Link 
              to="/auth/login"
              className="text-gray-400 hover:text-white hover:bg-gray-700 border border-transparent rounded-lg px-3 py-3 transition-all duration-200 hover:-translate-y-0.5 no-underline flex items-center gap-3" 
            >
              <span className="text-lg">🔐</span>
              <span>Đăng nhập</span>
            </Link>
            <Link 
              to="/auth/register"
              className="text-gray-400 hover:text-white hover:bg-gray-700 border border-transparent rounded-lg px-3 py-3 transition-all duration-200 hover:-translate-y-0.5 no-underline flex items-center gap-3" 
            >
              <span className="text-lg">📝</span>
              <span>Đăng ký</span>
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;

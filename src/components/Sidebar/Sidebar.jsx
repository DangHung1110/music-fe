import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

const Sidebar = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <aside className="bg-black h-full flex flex-col p-2">
      <div className="flex items-center gap-3 mb-8 px-4 pt-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-black font-extrabold text-xl shadow-lg shadow-green-500/30">
          ♪
        </div>
        <span className="text-white font-bold text-xl">Music.FE</span>
      </div>
      
      <nav className="flex flex-col gap-1 px-2">
        <Link 
          to="/"
          className="text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg px-4 py-3 transition-all duration-200 no-underline flex items-center gap-4 font-medium group" 
        >
          <span className="text-xl group-hover:scale-110 transition-transform">🏠</span>
          <span>Trang chủ</span>
        </Link>
        
        {isAuthenticated ? (
          <>
            <Link 
              to="/library"
              className="text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg px-4 py-3 transition-all duration-200 no-underline flex items-center gap-4 font-medium group" 
            >
              <span className="text-xl group-hover:scale-110 transition-transform">📚</span>
              <span>Thư viện</span>
            </Link>
            <Link 
              to="/playlists"
              className="text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg px-4 py-3 transition-all duration-200 no-underline flex items-center gap-4 font-medium group" 
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🎵</span>
              <span>Playlist</span>
            </Link>
            <Link 
              to="/favorites"
              className="text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg px-4 py-3 transition-all duration-200 no-underline flex items-center gap-4 font-medium group" 
            >
              <span className="text-xl group-hover:scale-110 transition-transform">❤️</span>
              <span>Yêu thích</span>
            </Link>
          </>
        ) : (
          <>
            <Link 
              to="/auth/login"
              className="text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg px-4 py-3 transition-all duration-200 no-underline flex items-center gap-4 font-medium group" 
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🔐</span>
              <span>Đăng nhập</span>
            </Link>
            <Link 
              to="/auth/register"
              className="text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg px-4 py-3 transition-all duration-200 no-underline flex items-center gap-4 font-medium group" 
            >
              <span className="text-xl group-hover:scale-110 transition-transform">📝</span>
              <span>Đăng ký</span>
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;

import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import LogoMark from "../Brand/LogoMark";
import BRAND from "../../config/brand";

const Sidebar = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <aside className="bg-black h-full flex flex-col p-2">
      <div className="flex items-center gap-3 mb-8 px-4 pt-6">
        <LogoMark size={44} />
        <div className="flex flex-col leading-tight">
          <span className="text-white font-extrabold text-xl tracking-wide">
            {BRAND.name}
          </span>
          <span className="text-xs uppercase tracking-[0.35em] text-emerald-300/80">
            {BRAND.tagline}
          </span>
        </div>
      </div>
      
      <nav className="flex flex-col gap-1 px-2">
        <Link 
          to="/"
          className="text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg px-4 py-3 transition-all duration-200 no-underline flex items-center gap-4 font-medium group" 
        >
          <span className="text-xl group-hover:scale-110 transition-transform">🏠</span>
          <span>Trang chủ</span>
        </Link>
        
        <Link 
          to="/trending"
          className="text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg px-4 py-3 transition-all duration-200 no-underline flex items-center gap-4 font-medium group" 
        >
          <span className="text-xl group-hover:scale-110 transition-transform">🔥</span>
          <span>Trending</span>
        </Link>
        
        {isAuthenticated && (
          <>
            <Link 
              to="/library"
              className="text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg px-4 py-3 transition-all duration-200 no-underline flex items-center gap-4 font-medium group" 
            >
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
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;

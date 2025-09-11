import React from "react";

const Topbar = () => {
  return (
    <header className="flex gap-4 items-center justify-between mb-6">
      <div className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-4 py-3">
        <input 
          className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400 text-sm" 
          placeholder="Tìm bài hát, nghệ sĩ, album..." 
        />
      </div>
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400/30 to-green-500/30 flex items-center justify-center border border-gray-600 text-white font-bold text-sm">
        NT
      </div>
    </header>
  );
};

export default Topbar;

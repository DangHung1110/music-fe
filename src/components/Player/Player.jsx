import React from "react";

const Player = () => {
  return (
    <footer className="fixed left-4 right-4 bottom-4 bg-gray-800/95 backdrop-blur-lg border border-gray-600 rounded-2xl px-4 py-3 grid grid-cols-3 items-center gap-4">
      <div className="flex gap-3 items-center">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400/40 to-green-500/40 border border-gray-600" />
        <div className="track">
          <div className="font-bold text-sm text-white">Có Em</div>
          <div className="text-gray-400 text-xs">Madihu ft. Low G</div>
        </div>
      </div>
      
      <div className="flex gap-3 justify-center">
        <button className="w-9 h-9 rounded-full bg-gray-700 border border-gray-600 text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-gray-600 text-sm">
          ⏮
        </button>
        <button className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500/60 to-cyan-400/50 border border-green-500/50 text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:from-green-500/70 hover:to-cyan-400/60 text-sm">
          ▶
        </button>
        <button className="w-9 h-9 rounded-full bg-gray-700 border border-gray-600 text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-gray-600 text-sm">
          ⏭
        </button>
      </div>
      
      <div className="flex gap-3 items-center justify-end text-gray-400">
        <span className="text-sm">Vol</span>
        <div className="relative w-24 h-1.5 bg-gray-700 border border-gray-600 rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-cyan-400" 
            style={{ width: "60%" }}
          />
        </div>
      </div>
    </footer>
  );
};

export default Player;

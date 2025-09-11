import React from "react";

const Card = ({ title, subtitle, onClick }) => {
  return (
    <button 
      className="text-left bg-gray-700 border border-gray-600 rounded-2xl p-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/35 hover:border-green-500/35 hover:bg-gray-600" 
      type="button"
      onClick={onClick}
    >
      <div className="h-32 rounded-xl bg-gradient-to-br from-green-500/40 to-cyan-400/30 border border-gray-600 mb-3" />
      <div className="px-1">
        <div className="font-bold text-sm text-white mb-1">{title}</div>
        <div className="text-gray-400 text-xs">{subtitle}</div>
      </div>
    </button>
  );
};

export default Card;

import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900" 
         style={{ background: 'linear-gradient(135deg, #0b0b0f 0%, #111318 50%, #0b0b0f 100%)' }}>
      {/* Background gradients */}
      <div 
        className="absolute inset-0 opacity-12 pointer-events-none" 
        style={{
          background: 'radial-gradient(900px 400px at 80% -10%, rgba(29,185,84,.12), transparent 60%), radial-gradient(700px 300px at 20% -10%, rgba(34,211,238,.10), transparent 60%)'
        }} 
      />
      
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;

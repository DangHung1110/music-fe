import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import Player from "../../components/Player/Player";
import Card from "../../components/Card/Card";
import OAuthTest from "../../components/OAuthTest";
import { useAuthStore } from "../../store/auth";

const Dashboard = () => {
  const { isAuthenticated } = useAuthStore();
  
  const featured = [
    { id: 1, title: "Deep Focus", subtitle: "Tập trung không xao nhãng" },
    { id: 2, title: "Chill Vibes", subtitle: "Thư giãn cuối ngày" },
    { id: 3, title: "Top Hits", subtitle: "BXH Việt Nam" },
    { id: 4, title: "Lo-Fi Beats", subtitle: "Học tập hiệu quả" },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white" style={{ background: 'linear-gradient(135deg, #0b0b0f 0%, #111318 50%, #0b0b0f 100%)' }}>
      
      {/* Background gradients */}
      <div 
        className="absolute inset-0 opacity-12 pointer-events-none" 
        style={{
          background: 'radial-gradient(900px 400px at 80% -10%, rgba(29,185,84,.12), transparent 60%), radial-gradient(700px 300px at 20% -10%, rgba(34,211,238,.10), transparent 60%)'
        }} 
      />
      
      <div className="grid grid-cols-[240px_1fr] gap-4 p-4 pb-24 relative z-10">
        <Sidebar />
        
        <main className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
          <Topbar />
          
          <section className="mt-4">
            <h2 className="text-lg mb-4 font-semibold">
              {isAuthenticated ? "Nổi bật hôm nay" : "Chào mừng đến với Music.FE"}
            </h2>
            
            {isAuthenticated ? (
              <div className="grid grid-cols-4 gap-3">
                {featured.map((item) => (
                  <Card
                    key={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                    onClick={() => console.log(`Clicked on ${item.title}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-cyan-400 flex items-center justify-center text-black font-extrabold text-4xl">
                  ♪
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Khám phá âm nhạc tuyệt vời</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Đăng nhập để tận hưởng trải nghiệm nghe nhạc cá nhân hóa với playlist, thư viện và nhiều tính năng thú vị khác.
                </p>
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={() => window.location.href = '/auth/login'}
                    className="px-6 py-3 rounded-lg border border-gray-600 bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                  >
                    Đăng nhập
                  </button>
                  <button 
                    onClick={() => window.location.href = '/auth/register'}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-cyan-400 text-black font-semibold hover:from-green-600 hover:to-cyan-500 transition-all duration-200"
                  >
                    Đăng ký miễn phí
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
      
      <Player />
    </div>
  );
};

export default Dashboard;

import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import Player from "../../components/Player/Player";
import Card from "../../components/Card/Card";
import OAuthTest from "../../components/OAuthTest";
import { useAuthStore } from "../../store/auth";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const { isAuthenticated } = useAuthStore();
  
  const location = useLocation();

  const featured = [
    { id: 1, title: "Deep Focus", subtitle: "Tập trung không xao nhãng" },
    { id: 2, title: "Chill Vibes", subtitle: "Thư giãn cuối ngày" },
    { id: 3, title: "Top Hits", subtitle: "BXH Việt Nam" },
    { id: 4, title: "Lo-Fi Beats", subtitle: "Học tập hiệu quả" },
  ];

  // ✅ CHỈ hiển thị featured khi ở ĐÚNG trang chủ "/" - không phải sub-route
  const showFeatured = location.pathname === "/";

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Grid gồm 2 cột: Sidebar + Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar cố định 240px */}
        <Sidebar className="w-60 flex-shrink-0" />

        {/* Main chiếm toàn bộ phần còn lại */}
        <main className="flex-1 flex flex-col bg-gray-800 border border-gray-700 rounded-2xl m-4 overflow-hidden">
          {/* Topbar */}
          <div className="p-4 border-b border-gray-700">
            <Topbar />
          </div>

          {/* Nội dung (Outlet) chiếm toàn bộ chiều cao còn lại */}
          <div className="flex-1 overflow-y-auto p-4">
            <Outlet />

            {showFeatured && (
              <section className="mt-4">
                <h2 className="text-lg mb-4 font-semibold">Nổi bật hôm nay</h2>
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
              </section>
            )}
          </div>
        </main>
      </div>

      {/* Player cố định dưới cùng */}
      <Player />
    </div>
  );
};

export default Dashboard;

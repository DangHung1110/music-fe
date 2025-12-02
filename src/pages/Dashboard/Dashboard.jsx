import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import Player from "../../components/Player/Player";
import Homepage from "../../components/Homepage/Homepage";
import Footer from "../../components/Footer/Footer";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  
  const showHomepage = location.pathname === "/";

  return (
    <div className="bg-black text-white h-screen flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 flex-shrink-0 h-full">
          <Sidebar />
        </div>

        <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-black">
          <div className="sticky top-0 z-10 bg-black/60 backdrop-blur-lg px-6 py-4 border-b border-gray-800/50">
            <Topbar />
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-24">
            <div className="max-w-[1950px] mx-auto">
              {showHomepage ? <Homepage /> : <Outlet />}
              <Footer />
            </div>
          </div>
        </main>
      </div>

      <Player />
    </div>
  );
};

export default Dashboard;

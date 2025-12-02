import React from "react";
import { Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import ArtistView from "../components/Artist/Artist.jsx";
import PlayLists from "../components/PlayLists/PLayLists.jsx";
import Trending from "../pages/Trending/Trending.jsx";
import Favorites from "../pages/Favorites/Favorites.jsx";

const DashboardRouter = [
  <Route key="dashboard" path="/" element={<Dashboard />}>
    {/* 👇 Route con để hiển thị ArtistView */}
    <Route path="artist/:name" element={<ArtistView />} />
    <Route path="playlists" element={<PlayLists />} />
  </Route>,
  <Route key="trending" path="/trending" element={<Dashboard />}>
    <Route index element={<Trending />} />
  </Route>,
  <Route key="favorites" path="/favorites" element={<Dashboard />}>
    <Route index element={<Favorites />} />
  </Route>
];

export default DashboardRouter;

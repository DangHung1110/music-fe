import React from "react";
import { Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import ArtistView from "../components/Artist/Artist.jsx";
import PlayLists from "../components/PlayLists/PLayLists.jsx";
const DashboardRouter = [
  <Route key="dashboard" path="/" element={<Dashboard />}>
    {/* 👇 Route con để hiển thị ArtistView */}
    <Route path="artist/:name" element={<ArtistView />} />
    <Route path="playlists" element={<PlayLists />} />
  </Route>
];

export default DashboardRouter;

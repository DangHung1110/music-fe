import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardRouter from "./dashboard.router";
import AuthRouter from "./auth.router";
import TokenHandler from "../components/Auth/TokenHandler";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {DashboardRouter}      {/* Dashboard + nested routes */}
        <Route path="/auth/callback" element={<TokenHandler />} />
        {AuthRouter}           {/* Auth routes */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

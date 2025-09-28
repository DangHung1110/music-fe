import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import AuthRouter from "./auth.router";
import TokenHandler from "../components/Auth/TokenHandler";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/auth/callback" element={<TokenHandler />} />
                <Route path="/auth/*" element={<AuthRouter />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;

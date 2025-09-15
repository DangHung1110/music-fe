import React from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import DashboardRouter from "./dashboard.router";
import AuthRouter from "./auth.router";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {DashboardRouter}
                {AuthRouter}
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;

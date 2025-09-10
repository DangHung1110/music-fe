import React from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import DashboardRouter from "./dashboard.router";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {DashboardRouter}
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;

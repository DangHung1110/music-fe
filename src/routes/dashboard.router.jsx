import React from "react";
import Dashboard from "../pages/Dashboard/Dashboard";
import {Route} from "react-router-dom";

const DashboardRouter = [
    <Route key = "dashboard" path="/" element={<Dashboard />} />
]

export default DashboardRouter;
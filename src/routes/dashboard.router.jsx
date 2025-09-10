import React from "react";
import Dashboard from "../components/dashboard";
import {Route} from "react-router-dom";

const DashboardRouter = [
    <Route key = "dashboard" path="/" element={<Dashboard />} />
]

export default DashboardRouter;
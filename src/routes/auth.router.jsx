import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../components/Auth/login";
import Register from "../components/Auth/Register";
import SocialCallback from "../components/Auth/SocialCallback";

const AuthRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="callback" element={<SocialCallback />} />
      </Route>
    </Routes>
  );
};

export default AuthRouter;

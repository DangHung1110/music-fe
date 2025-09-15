import React from "react";
import { Route } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";

const AuthRouter = [
  <Route key="auth" path="/auth" element={<AuthLayout />}>
    <Route index element={<Login />} />
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
  </Route>
];

export default AuthRouter;

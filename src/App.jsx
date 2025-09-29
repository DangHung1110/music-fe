import React from "react";
import AppRouter from "./routes/app.router";
import AuthProvider from "./components/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;

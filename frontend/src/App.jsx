import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Register from "./components/Register";
import Login from "./components/Login";

import AdminDashboard from "./components/admin/AdminDashboard";
import BuyerDashboard from "./components/buyer/BuyerDashboard";
import SellerDashboard from "./components/seller/SellerDashboard";

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [page, setPage] = useState("home");

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPage("home");
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white">
      <Navbar user={user} onLogout={handleLogout} setPage={setPage} />

      {user ? (
        <>
          {user.role === "admin" && <AdminDashboard />}
          {user.role === "buyer" && <BuyerDashboard user={user} />}
          {user.role === "seller" && <SellerDashboard user={user} />}
        </>
      ) : (
        <>
          {page === "home" && <Hero setPage={setPage} />}
          {page === "register" && (
            <Register onRegisterSuccess={handleLoginSuccess} />
          )}
          {page === "login" && (
            <Login onLoginSuccess={handleLoginSuccess} />
          )}
        </>
      )}

      <div className="hidden">
        <button id="home" onClick={() => setPage("home")} />
        <button id="register" onClick={() => setPage("register")} />
        <button id="login" onClick={() => setPage("login")} />
      </div>
    </div>
  );
}

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Register from "./components/Register";
import Login from "./components/Login";
import AdminDashboard from "./components/admin/AdminDashboard";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white">
      <Navbar />

      {page === "home" && <Hero />}
      {page === "register" && <Register />}
      {page === "login" && <Login />}
      {page === "admin" && <AdminDashboard />}

      {/* Temporary navigation */}
      <div className="hidden">
        <button id="home" onClick={() => setPage("home")} />
        <button id="register" onClick={() => setPage("register")} />
        <button id="login" onClick={() => setPage("login")} />
        <button id="admin" onClick={() => setPage("admin")} />
      </div>
    </div>
  );
}

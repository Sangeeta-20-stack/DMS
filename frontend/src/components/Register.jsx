import { useState } from "react";

export default function Register({ onRegisterSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // Store JWT in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setLoading(false);

      // Callback to parent to redirect / update state
      if (onRegisterSuccess) onRegisterSuccess(data.user);
    } catch (err) {
      console.error(err);
      setError("Server error. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
      <div className="bg-[#111] p-8 rounded-xl w-full max-w-md shadow-2xl border border-yellow-500/20">
        <h2 className="text-3xl font-bold text-yellow-400 text-center">
          Create an Account
        </h2>
        <p className="text-gray-400 text-center mt-2">
          Join our Delivery Management System
        </p>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form className="mt-6 space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-gray-300">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mt-1 p-3 rounded-lg bg-black border border-gray-700 focus:border-yellow-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 p-3 rounded-lg bg-black border border-gray-700 focus:border-yellow-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 p-3 rounded-lg bg-black border border-gray-700 focus:border-yellow-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300">Select Role</label>
            <select
              className="w-full mt-1 p-3 rounded-lg bg-black border border-gray-700 focus:border-yellow-400 outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg mt-4 hover:bg-yellow-500 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-yellow-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

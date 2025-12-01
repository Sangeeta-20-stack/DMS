export default function Navbar() {
  return (
    <nav className="w-full py-4 bg-[#0A0A0A] text-white shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4">

        <h1 className="text-2xl font-semibold tracking-wide">
          Delivery Management System
        </h1>

        <div className="space-x-4">
          
          {/* Login */}
          <button
            onClick={() => document.getElementById("login")?.click()}
            className="px-4 py-2 rounded-md bg-yellow-400 text-black font-medium transition hover:bg-yellow-500"
          >
            Login
          </button>

          {/* Register */}
          <button
            onClick={() => document.getElementById("register")?.click()}
            className="px-4 py-2 rounded-md border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition"
          >
            Register
          </button>

        </div>
      </div>
    </nav>
  );
}

export default function Navbar({ user, setPage, onLogout }) {
  return (
    <nav className="w-full py-4 bg-[#0A0A0A] text-white shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4">

        <h1 className="text-2xl font-semibold tracking-wide">
          Delivery Management System
        </h1>

        {/* If NOT logged in → show Login + Register */}
        {!user && (
          <div className="space-x-4">
            <button
              onClick={() => setPage("login")}
              className="px-4 py-2 rounded-md bg-yellow-400 text-black font-medium transition hover:bg-yellow-500"
            >
              Login
            </button>

            <button
              onClick={() => setPage("register")}
              className="px-4 py-2 rounded-md border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition"
            >
              Register
            </button>
          </div>
        )}

        {/* If logged in → show role + Logout */}
        {user && (
          <div className="space-x-6 flex items-center">
            <span className="text-gray-300 font-medium">
              {user.role.toUpperCase()}
            </span>

            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-md bg-red-500 text-white font-medium transition hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}

      </div>
    </nav>
  );
}

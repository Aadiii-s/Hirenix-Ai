import { Link, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
  return (
    <header className="border-b border-slate-800 bg-slate-950 text-white">
      <nav className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold">Hirenix AI</span>
        <span className="text-sm text-slate-400">Loading...</span>
      </nav>
    </header>
  );
}

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950 text-white">
      <nav className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          Hirenix AI
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm text-slate-300 hover:text-white"
              >
                Dashboard
              </Link>
              <Link to="/Profile">
              <div className="hidden md:flex items-center gap-2 text-sm text-slate-300">
                <User size={16} />
                <span>{user?.fullName}</span>
              </div>
              </Link>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-300 hover:bg-red-500/20"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-slate-300 hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
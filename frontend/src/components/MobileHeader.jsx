import { Link, useNavigate,NavLink } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";


const MobileHeader = () => {
  const { logout, user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  if (loading) {
  return (
    <header className="border-b border-slate-800 bg-slate-950 px-5 py-4 text-white lg:hidden">
      <h1 className="text-xl font-bold">Hirenix AI</h1>
      <p className="text-xs text-slate-400">Loading session...</p>
    </header>
  );
}

  return (
    <header className="border-b border-slate-800 bg-slate-950 text-white lg:hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <Link to="/dashboard">
          <h1 className="text-xl font-bold">Hirenix AI</h1>
          <p className="text-xs text-slate-400">Placement Preparation OS</p>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-300"
          >
            <User size={18} />
          </Link>

          <button
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-300"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto px-5 pb-4 text-sm">
  <NavLink
    to="/roadmap"
    className={({ isActive }) =>
      `whitespace-nowrap rounded-full px-4 py-2 transition ${
        isActive
          ? "bg-blue-600 text-white"
          : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
      }`
    }
  >
    Roadmap
  </NavLink>
  <NavLink
    to="/roadmaps"
    className={({ isActive }) =>
      `whitespace-nowrap rounded-full px-4 py-2 transition ${
        isActive
          ? "bg-blue-600 text-white"
          : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
      }`
    }
  >
    History
  </NavLink>
  <NavLink
    to="/resume-analyzer"
    className={({ isActive }) =>
      `whitespace-nowrap rounded-full px-4 py-2 transition ${
        isActive
          ? "bg-blue-600 text-white"
          : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
      }`
    }
  >
    Resume
  </NavLink>
  <NavLink
    to="/resume-analyses"
    className={({ isActive }) =>
      `whitespace-nowrap rounded-full px-4 py-2 transition ${
        isActive
          ? "bg-blue-600 text-white"
          : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
      }`
    }
  >
    Resume History
  </NavLink>
  <NavLink
    to="/dashboard"
    className={({ isActive }) =>
      `whitespace-nowrap rounded-full px-4 py-2 transition ${
        isActive
          ? "bg-blue-600 text-white"
          : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
      }`
    }
  >
    Dashboard
  </NavLink>

  <NavLink
    to="/profile"
    className={({ isActive }) =>
      `whitespace-nowrap rounded-full px-4 py-2 transition ${
        isActive
          ? "bg-blue-600 text-white"
          : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
      }`
    }
  >
    Profile
  </NavLink>

  <NavLink
    to="/edit-profile"
    className={({ isActive }) =>
      `whitespace-nowrap rounded-full px-4 py-2 transition ${
        isActive
          ? "bg-blue-600 text-white"
          : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
      }`
    }
  >
    Edit Profile
  </NavLink>
</div>
    </header>
  );
};

export default MobileHeader;
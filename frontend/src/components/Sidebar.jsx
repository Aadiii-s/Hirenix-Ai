import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  Brain,
  Building2,
  FileText,
  Home,
  LogOut,
  Route,
  Trophy,
  User,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: Home,
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Readiness",
    path: "/readiness",
    icon: Trophy,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: User,
  },
  {
    label: "AI Roadmap",
    path: "/roadmap",
    icon: Route,
  },
  {
    label: "Resume Analyzer",
    path: "/resume-analyzer",
    icon: FileText,
  },
  {
    label: "DSA Tracker",
    path: "/dsa-tracker",
    icon: BookOpen,
  },
  {
    label: "Mock Interview",
    path: "/mock-interview",
    icon: Brain,
  },
  {
    label: "Skill Gap",
    path: "/skill-gap",
    icon: Brain,
  },
  {
    label: "Companies",
    path: "/companies",
    icon: Building2,
  },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isRouteActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside
      className="hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-slate-800 bg-slate-950
      lg:sticky lg:top-0 lg:block
      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:bg-slate-950
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb]:bg-gray-900
      hover:[&::-webkit-scrollbar-thumb]:bg-gray-700"
    >
      <div className="flex min-h-screen flex-col px-4 py-5">
        <Link to="/dashboard" className="mb-7 block">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <h1 className="text-2xl font-bold text-white">Hirenix AI</h1>
            <p className="mt-1 text-xs text-slate-400">
              Intelligent Placement Preparation
            </p>
          </div>
        </Link>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isRouteActive(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={() =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "border border-blue-500/30 bg-blue-500/10 text-blue-300"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <div className="mb-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-slate-500">Logged in as</p>
            <p className="mt-1 truncate font-semibold text-white">
              {user?.fullName || "User"}
            </p>
            <p className="mt-1 truncate text-xs text-slate-400">
              {user?.email || "No email"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/10"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
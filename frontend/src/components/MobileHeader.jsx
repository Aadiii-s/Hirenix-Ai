import { Link, useLocation, useNavigate } from "react-router-dom";
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

const mobileLinks = [
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
    label: "Profile",
    path: "/profile",
    icon: User,
  },
  {
    label: "Readiness",
    path: "/readiness",
    icon: Trophy,
  },
  {
    label: "Roadmap",
    path: "/roadmap",
    icon: Route,
  },
  {
    label: "Resume",
    path: "/resume-analyzer",
    icon: FileText,
  },
  {
    label: "DSA",
    path: "/dsa-tracker",
    icon: BookOpen,
  },
  {
    label: "Interview",
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

const MobileHeader = () => {
  const { logout } = useAuth();
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
    <header className="border-b border-slate-800 bg-slate-950 px-4 py-4">
      <div className="mb-4 flex items-center justify-between">
        <Link to="/dashboard">
          <div>
            <h1 className="text-xl font-bold text-white">Hirenix AI</h1>
            <p className="text-xs text-slate-400">Placement Prep Platform</p>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="rounded-xl border border-red-500/30 p-2 text-red-300 hover:bg-red-500/10"
        >
          <LogOut size={18} />
        </button>
      </div>

      <div
        className="flex gap-3 overflow-x-auto pb-1
        [&::-webkit-scrollbar]:h-1
        [&::-webkit-scrollbar-track]:bg-slate-950
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-900"
      >
        {mobileLinks.map((item) => {
          const Icon = item.icon;
          const active = isRouteActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                active
                  ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
                  : "border-slate-800 bg-slate-900 text-slate-300 hover:border-blue-500/40 hover:text-white"
              }`}
            >
              <Icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
};

export default MobileHeader;
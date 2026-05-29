import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  Brain,
  CalendarDays,
  FileText,
  Home,
  LogOut,
  Route,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: Home,
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
      disabled: false,
    },
    {
      label: "Roadmap History",
      path: "/roadmaps",
      icon: CalendarDays,
      disabled: false,
    },
    {
      label: "Resume Analyzer",
      path: "/resume-analyzer",
      icon: FileText,
      disabled: false,
    },
    {
      label: "Resume History",
      path: "/resume-analyses",
      icon: FileText,
      disabled: false,
    },
    {
      label: "DSA Tracker",
      path: "/dsa-tracker",
      icon: BookOpen,
      disabled: false,
    },
    {
      label: "Mock Interview",
      path: "/mock-interview",
      icon: Brain,
      disabled: true,
    },
    {
      label: "Analytics",
      path: "/analytics",
      icon: BarChart3,
      disabled: true,
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="hidden lg:flex min-h-screen w-72 flex-col border-r border-slate-800 bg-slate-950 text-white">
      <div className="border-b border-slate-800 px-6 py-5">
        <Link to="/dashboard">
          <h1 className="text-2xl font-bold">Hirenix AI</h1>
          <p className="text-sm text-slate-400 mt-1">
            Placement Preparation OS
          </p>
        </Link>
      </div>

      <div className="px-4 py-5">
        <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold">{user?.fullName}</p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>

          <div
            className={`mt-4 rounded-full px-3 py-1 text-xs font-medium ${user?.isProfileCompleted
                ? "bg-green-500/10 text-green-300"
                : "bg-yellow-500/10 text-yellow-300"
              }`}
          >
            {user?.isProfileCompleted ? "Profile Complete" : "Profile Pending"}
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            if (item.disabled) {
              return (
                <div
                  key={item.label}
                  className="flex cursor-not-allowed items-center justify-between rounded-xl px-4 py-3 text-slate-500"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span className="text-sm">{item.label}</span>
                  </div>

                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                    Soon
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-slate-800 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-300 hover:bg-red-500/10"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
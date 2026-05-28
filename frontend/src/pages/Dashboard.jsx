import { Link } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  FileText,
  Route,
  Target,
  Trophy,
  User,
} from "lucide-react";

import DashboardCard from "../components/DashboardCard";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const calculateProfileStrength = () => {
    let score = 0;

    if (user?.fullName) score += 10;
    if (user?.email) score += 10;
    if (user?.college) score += 10;
    if (user?.branch) score += 10;
    if (user?.graduationYear) score += 10;
    if (user?.targetRole) score += 15;
    if (user?.targetCompanies?.length > 0) score += 15;
    if (user?.skills?.length > 0) score += 15;
    if (user?.currentPreparationLevel) score += 5;

    return score;
  };

  const profileStrength = calculateProfileStrength();

  const modules = [
    {
      title: "AI Roadmap Generator",
      description:
        "Generate a personalized placement plan based on your target role and current level.",
      icon: Route,
      status: user?.isProfileCompleted ? "Ready" : "Complete profile first",
      path: "/roadmap",
      locked: true,
    },
    {
      title: "Resume Analyzer",
      description:
        "Upload your resume and get ATS score, missing keywords, and improved bullets.",
      icon: FileText,
      status: "Coming soon",
      path: "/resume-analyzer",
      locked: true,
    },
    {
      title: "DSA Tracker",
      description:
        "Track topic-wise DSA progress and identify weak areas for placement preparation.",
      icon: BookOpen,
      status: "Coming soon",
      path: "/dsa-tracker",
      locked: true,
    },
    {
      title: "Mock Interview",
      description:
        "Practice HR, MERN, DSA, and project interviews with AI feedback.",
      icon: Brain,
      status: "Coming soon",
      path: "/mock-interview",
      locked: true,
    },
  ];

  const targetCompaniesText =
    user?.targetCompanies?.length > 0
      ? user.targetCompanies.join(", ")
      : "Not added";

  const skillsText =
    user?.skills?.length > 0 ? user.skills.slice(0, 4).join(", ") : "Not added";

  return (
    <div className="min-h-screen bg-slate-950 text-white lg:flex">
      <Sidebar />

      <main className="flex-1 px-6 py-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-blue-400 font-medium mb-2">
                Welcome back, {user?.fullName}
              </p>

              <h1 className="text-4xl font-bold">Placement Dashboard</h1>

              <p className="text-slate-400 mt-2">
                Your complete command center for placement preparation.
              </p>
            </div>

            <Link
              to={user?.isProfileCompleted ? "/profile" : "/edit-profile"}
              className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold hover:bg-blue-700"
            >
              {user?.isProfileCompleted ? "View Profile" : "Complete Profile"}
            </Link>
          </div>

          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <DashboardCard
              title="Placement Readiness"
              value="0%"
              subtitle="Will unlock after AI modules"
              icon={Trophy}
              status={0}
            />

            <DashboardCard
              title="Profile Strength"
              value={`${profileStrength}%`}
              subtitle={
                user?.isProfileCompleted
                  ? "Profile completed"
                  : "Complete your onboarding"
              }
              icon={User}
              status={profileStrength}
            />

            <DashboardCard
              title="DSA Progress"
              value="0/100"
              subtitle="Problems solved"
              icon={BookOpen}
              status={0}
            />

            <DashboardCard
              title="Mock Interviews"
              value="0"
              subtitle="Interviews completed"
              icon={Brain}
              status={0}
            />
          </section>

          <section className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Preparation Modules
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Start with profile setup, then unlock AI roadmap and other
                    preparation tools.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {modules.map((module) => {
                  const Icon = module.icon;

                  return (
                    <div
                      key={module.title}
                      className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                    >
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-300">
                          <Icon size={22} />
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            module.status === "Ready"
                              ? "bg-green-500/10 text-green-300"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {module.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold">{module.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {module.description}
                      </p>

                      {module.status === "Ready" ? (
                        <button className="mt-5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700">
                          Start Module
                        </button>
                      ) : (
                        <button
                          disabled
                          className="mt-5 cursor-not-allowed rounded-xl border border-slate-800 px-4 py-2 text-sm text-slate-500"
                        >
                          Locked
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl bg-green-500/10 p-3 text-green-300">
                    <CheckCircle2 size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">
                      Today's Priority
                    </h2>
                    <p className="text-sm text-slate-400">
                      Recommended next action
                    </p>
                  </div>
                </div>

                {user?.isProfileCompleted ? (
                  <>
                    <p className="text-slate-300">
                      Your profile is complete. Next step is to generate your AI
                      placement roadmap.
                    </p>

                    <button className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700">
                      Generate Roadmap
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-slate-300">
                      Complete your placement profile so Hirenix AI can
                      personalize your preparation journey.
                    </p>

                    <Link
                      to="/edit-profile"
                      className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
                    >
                      Complete Profile
                    </Link>
                  </>
                )}
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl bg-purple-500/10 p-3 text-purple-300">
                    <Target size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">Target Summary</h2>
                    <p className="text-sm text-slate-400">
                      Your placement goal
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-slate-500">Target Role</p>
                    <p className="mt-1 font-medium text-slate-200">
                      {user?.targetRole || "Not added"}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Target Companies</p>
                    <p className="mt-1 font-medium text-slate-200">
                      {targetCompaniesText}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Top Skills</p>
                    <p className="mt-1 font-medium text-slate-200">
                      {skillsText}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Preparation Level</p>
                    <p className="mt-1 font-medium capitalize text-slate-200">
                      {user?.currentPreparationLevel || "beginner"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl bg-orange-500/10 p-3 text-orange-300">
                    <BarChart3 size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">Readiness Formula</h2>
                    <p className="text-sm text-slate-400">
                      Future scoring system
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span>DSA Progress</span>
                    <span>30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resume Score</span>
                    <span>20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mock Interview</span>
                    <span>25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aptitude</span>
                    <span>15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consistency</span>
                    <span>10%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
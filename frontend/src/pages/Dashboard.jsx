import { useEffect, useState } from "react";
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
import MobileHeader from "../components/MobileHeader";
import ModuleCard from "../components/ModuleCard";
import Sidebar from "../components/Sidebar";
import { getLatestRoadmapApi } from "../api/roadmap.api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const [latestRoadmap, setLatestRoadmap] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(true);

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

  const fetchLatestRoadmap = async () => {
    try {
      setRoadmapLoading(true);

      const response = await getLatestRoadmapApi();

      setLatestRoadmap(response.data);
    } catch (error) {
      console.log("Latest roadmap error:", error.response?.data || error);
      setLatestRoadmap(null);
    } finally {
      setRoadmapLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestRoadmap();
  }, []);

  const getTodayTaskText = () => {
  if (!user?.isProfileCompleted) {
    return "Complete your profile to unlock personalized preparation.";
  }

  if (!latestRoadmap) {
    return "Generate your first AI roadmap.";
  }

  const nextDay =
    (latestRoadmap.completedDays?.length || 0) + 1;

  return `Continue Day ${nextDay} of your roadmap.`;
};

  const modules = [
    {
      title: "AI Roadmap Generator",
      description:
        "Generate a personalized placement plan based on your target role and current level.",
      icon: Route,
      status: user?.isProfileCompleted ? "Ready" : "Complete profile first",
      path: "/roadmap",
      locked: !user?.isProfileCompleted,
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

      <div className="lg:hidden">
        <MobileHeader />
      </div>

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
              title="Roadmap Progress"
              value={`${latestRoadmap?.progressPercentage || 0}%`}
              subtitle={
                latestRoadmap
                  ? `${latestRoadmap.completedDays?.length || 0} of ${
                      latestRoadmap.durationInDays
                    } days completed`
                  : "Generate your first roadmap"
              }
              icon={Trophy}
              status={latestRoadmap?.progressPercentage || 0}
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
                {modules.map((module) => (
                  <ModuleCard
                    key={module.title}
                    title={module.title}
                    description={module.description}
                    icon={module.icon}
                    status={module.status}
                    locked={module.locked}
                    buttonText="Start Module"
                    path={module.path}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl bg-blue-500/10 p-3 text-blue-300">
                    <Route size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">Latest Roadmap</h2>
                    <p className="text-sm text-slate-400">
                      Continue your plan
                    </p>
                  </div>
                </div>

                {roadmapLoading ? (
                  <p className="text-sm text-slate-400">
                    Loading latest roadmap...
                  </p>
                ) : latestRoadmap ? (
                  <>
                    <h3 className="text-lg font-semibold">
                      {latestRoadmap.title}
                    </h3>

                    <div className="mt-4 space-y-3 text-sm text-slate-400">
                      <p>
                        Role:{" "}
                        <span className="text-slate-200">
                          {latestRoadmap.targetRole}
                        </span>
                      </p>

                      <p>
                        Company:{" "}
                        <span className="text-slate-200">
                          {latestRoadmap.targetCompany || "General"}
                        </span>
                      </p>

                      <p>
                        Progress:{" "}
                        <span className="text-slate-200">
                          {latestRoadmap.progressPercentage || 0}%
                        </span>
                      </p>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{
                            width: `${
                              latestRoadmap.progressPercentage || 0
                            }%`,
                          }}
                        />
                      </div>

                      <p>
                        Completed:{" "}
                        <span className="text-slate-200">
                          {latestRoadmap.completedDays?.length || 0}/
                          {latestRoadmap.durationInDays} days
                        </span>
                      </p>
                    </div>

                    <Link
                      to={`/roadmaps/${latestRoadmap._id}`}
                      className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
                    >
                      Continue Roadmap
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-slate-300">
                      You have not generated any roadmap yet. Start with an
                      AI-powered placement plan.
                    </p>

                    <Link
                      to="/roadmap"
                      className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
                    >
                      Generate Roadmap
                    </Link>
                  </>
                )}
              </div>

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
                      {getTodayTaskText()}
                    </p>
                  </div>
                </div>

                {!user?.isProfileCompleted ? (
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
                ) : latestRoadmap ? (
                  <>
                    <p className="text-slate-300">
                      Continue your latest roadmap and complete today's planned
                      tasks.
                    </p>

                    <Link
                      to={`/roadmaps/${latestRoadmap._id}`}
                      className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
                    >
                      Continue Roadmap
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-slate-300">
                      Your profile is complete. Generate your first AI placement
                      roadmap to start structured preparation.
                    </p>

                    <Link
                      to="/roadmap"
                      className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
                    >
                      Generate Roadmap
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
                    <h2 className="text-xl font-semibold">
                      Readiness Formula
                    </h2>
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
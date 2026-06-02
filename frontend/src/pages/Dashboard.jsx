import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  Brain,
  Building2,
  CheckCircle2,
  FileText,
  Route,
  Target,
  Trophy,
} from "lucide-react";

import { getDsaStatsApi } from "../api/dsa.api";
import { getLatestResumeAnalysisApi } from "../api/resume.api";
import { getLatestRoadmapApi } from "../api/roadmap.api";
import { getReadinessScoreApi } from "../api/readiness.api";
import { getMockInterviewStatsApi } from "../api/interview.api";
import { getLatestSkillGapAnalysisApi } from "../api/skillGap.api";

import AppLayout from "../components/AppLayout";
import DashboardCard from "../components/DashboardCard";
import ModuleCard from "../components/ModuleCard";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const [latestRoadmap, setLatestRoadmap] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(true);

  const [latestResumeAnalysis, setLatestResumeAnalysis] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(true);

  const [dsaStats, setDsaStats] = useState(null);
  const [dsaLoading, setDsaLoading] = useState(true);

  const [readiness, setReadiness] = useState(null);
  const [readinessLoading, setReadinessLoading] = useState(true);

  const [interviewStats, setInterviewStats] = useState(null);
  const [interviewLoading, setInterviewLoading] = useState(true);

  const [latestSkillGap, setLatestSkillGap] = useState(null);
  const [skillGapLoading, setSkillGapLoading] = useState(true);

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

  const fetchLatestResumeAnalysis = async () => {
    try {
      setResumeLoading(true);
      const response = await getLatestResumeAnalysisApi();
      setLatestResumeAnalysis(response.data);
    } catch (error) {
      console.log("Latest resume analysis error:", error.response?.data || error);
      setLatestResumeAnalysis(null);
    } finally {
      setResumeLoading(false);
    }
  };

  const fetchDsaStats = async () => {
    try {
      setDsaLoading(true);
      const response = await getDsaStatsApi();
      setDsaStats(response.data);
    } catch (error) {
      console.log("DSA stats error:", error.response?.data || error);
      setDsaStats(null);
    } finally {
      setDsaLoading(false);
    }
  };

  const fetchReadinessScore = async () => {
    try {
      setReadinessLoading(true);
      const response = await getReadinessScoreApi();
      setReadiness(response.data);
    } catch (error) {
      console.log("Readiness score error:", error.response?.data || error);
      setReadiness(null);
    } finally {
      setReadinessLoading(false);
    }
  };

  const fetchInterviewStats = async () => {
    try {
      setInterviewLoading(true);
      const response = await getMockInterviewStatsApi();
      setInterviewStats(response.data);
    } catch (error) {
      console.log("Interview stats error:", error.response?.data || error);
      setInterviewStats(null);
    } finally {
      setInterviewLoading(false);
    }
  };

  const fetchLatestSkillGap = async () => {
    try {
      setSkillGapLoading(true);
      const response = await getLatestSkillGapAnalysisApi();
      setLatestSkillGap(response.data);
    } catch (error) {
      console.log("Latest skill gap error:", error.response?.data || error);
      setLatestSkillGap(null);
    } finally {
      setSkillGapLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestRoadmap();
    fetchLatestResumeAnalysis();
    fetchDsaStats();
    fetchReadinessScore();
    fetchInterviewStats();
    fetchLatestSkillGap();
  }, []);

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
      status: "Ready",
      path: "/resume-analyzer",
      locked: false,
    },
    {
      title: "DSA Tracker",
      description:
        "Track topic-wise DSA progress and identify weak areas for placement preparation.",
      icon: BookOpen,
      status: "Ready",
      path: "/dsa-tracker",
      locked: false,
    },
    {
      title: "Company Tracker",
      description:
        "Track company-wise preparation, application status, tasks, and progress.",
      icon: Building2,
      status: "Ready",
      path: "/companies",
      locked: false,
    },
    {
      title: "Mock Interview",
      description:
        "Practice HR, MERN, DSA, and project interviews with AI feedback.",
      icon: Brain,
      status: "Ready",
      path: "/mock-interview",
      locked: false,
    },
    {
      title: "AI Skill Gap Analyzer",
      description:
        "Identify missing skills using your profile, resume, DSA, roadmap, and mock interview data.",
      icon: Brain,
      status: "Ready",
      path: "/skill-gap",
      locked: false,
    },
    {
      title: "Global Analytics",
      description:
        "View complete preparation insights across resume, DSA, interviews, roadmap, skill gaps, and companies.",
      icon: BarChart3,
      status: "Ready",
      path: "/analytics",
      locked: false,
    },
  ];

  const targetCompaniesText =
    user?.targetCompanies?.length > 0
      ? user.targetCompanies.join(", ")
      : "Not added";

  const skillsText =
    user?.skills?.length > 0 ? user.skills.slice(0, 4).join(", ") : "Not added";

  return (
    <AppLayout>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 font-medium text-blue-400">
            Welcome back, {user?.fullName}
          </p>

          <h1 className="text-4xl font-bold">Placement Dashboard</h1>

          <p className="mt-2 text-slate-400">
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
          value={
            readinessLoading
              ? "--"
              : readiness
              ? `${readiness.finalScore}%`
              : "0%"
          }
          subtitle={readiness?.readinessLevel || "Calculate your readiness"}
          icon={Trophy}
          status={readiness?.finalScore || 0}
        />

        <DashboardCard
          title="Resume Score"
          value={
            resumeLoading
              ? "--"
              : latestResumeAnalysis?.atsScore !== undefined
              ? `${latestResumeAnalysis.atsScore}/100`
              : "--"
          }
          subtitle={
            latestResumeAnalysis
              ? latestResumeAnalysis.originalFileName
              : "Analyze your resume"
          }
          icon={FileText}
          status={latestResumeAnalysis?.atsScore || 0}
        />

        <DashboardCard
          title="DSA Progress"
          value={
            dsaLoading
              ? "--"
              : `${dsaStats?.solvedQuestions || 0}/${
                  dsaStats?.totalQuestions || 0
                }`
          }
          subtitle={`${dsaStats?.completionPercentage || 0}% completion`}
          icon={BookOpen}
          status={dsaStats?.completionPercentage || 0}
        />

        <DashboardCard
          title="Mock Interviews"
          value={
            interviewLoading
              ? "--"
              : `${interviewStats?.completedInterviews || 0}/${
                  interviewStats?.totalInterviews || 0
                }`
          }
          subtitle={`Avg score: ${interviewStats?.averageScore || 0}%`}
          icon={Brain}
          status={interviewStats?.averageScore || 0}
        />
      </section>

      <section className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Preparation Modules</h2>
              <p className="mt-1 text-sm text-slate-400">
                Start with profile setup, then use AI roadmap, resume analyzer,
                DSA tracker, mock interview, skill gap, company tracker, and
                analytics.
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

          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-orange-500/10 p-3 text-orange-300">
                  <Trophy size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">Readiness Breakdown</h2>
                  <p className="text-sm text-slate-400">
                    Weighted placement score
                  </p>
                </div>
              </div>

              <Link
                to="/readiness"
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700"
              >
                Full Report
              </Link>
            </div>

            {readinessLoading ? (
              <p className="text-sm text-slate-400">Calculating readiness...</p>
            ) : readiness ? (
              <div className="space-y-4">
                <BreakdownRow
                  label="Profile"
                  score={readiness.breakdown.profile.score}
                  weight={readiness.breakdown.profile.weight}
                  contribution={readiness.breakdown.profile.contribution}
                />

                <BreakdownRow
                  label="Roadmap"
                  score={readiness.breakdown.roadmap.score}
                  weight={readiness.breakdown.roadmap.weight}
                  contribution={readiness.breakdown.roadmap.contribution}
                />

                <BreakdownRow
                  label="Resume"
                  score={readiness.breakdown.resume.score}
                  weight={readiness.breakdown.resume.weight}
                  contribution={readiness.breakdown.resume.contribution}
                />

                <BreakdownRow
                  label="DSA"
                  score={readiness.breakdown.dsa.score}
                  weight={readiness.breakdown.dsa.weight}
                  contribution={readiness.breakdown.dsa.contribution}
                />

                {readiness.breakdown.interview && (
                  <BreakdownRow
                    label="Mock Interview"
                    score={readiness.breakdown.interview.score}
                    weight={readiness.breakdown.interview.weight}
                    contribution={readiness.breakdown.interview.contribution}
                  />
                )}

                <BreakdownRow
                  label="Consistency"
                  score={readiness.breakdown.consistency.score}
                  weight={readiness.breakdown.consistency.weight}
                  contribution={readiness.breakdown.consistency.contribution}
                />

                <div className="border-t border-slate-800 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">
                      Final Score
                    </span>
                    <span className="text-2xl font-bold text-blue-300">
                      {readiness.finalScore}%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">No readiness data available.</p>
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-green-500/10 p-3 text-green-300">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <h2 className="text-xl font-semibold">AI Recommendations</h2>
                <p className="text-sm text-slate-400">
                  Based on your current progress
                </p>
              </div>
            </div>

            {readinessLoading ? (
              <p className="text-sm text-slate-400">
                Loading recommendations...
              </p>
            ) : readiness?.recommendations?.length > 0 ? (
              <ul className="space-y-3">
                {readiness.recommendations.map((item, index) => (
                  <li
                    key={index}
                    className="rounded-xl bg-slate-900 px-4 py-3 text-sm leading-6 text-slate-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">
                No recommendations available yet.
              </p>
            )}
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
                <p className="text-sm text-slate-400">Continue your plan</p>
              </div>
            </div>

            {roadmapLoading ? (
              <p className="text-sm text-slate-400">Loading latest roadmap...</p>
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
                        width: `${latestRoadmap.progressPercentage || 0}%`,
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
              <div className="rounded-xl bg-purple-500/10 p-3 text-purple-300">
                <Brain size={22} />
              </div>

              <div>
                <h2 className="text-xl font-semibold">Skill Gap Focus</h2>
                <p className="text-sm text-slate-400">
                  Your latest missing skills
                </p>
              </div>
            </div>

            {skillGapLoading ? (
              <p className="text-sm text-slate-400">
                Loading skill gap analysis...
              </p>
            ) : latestSkillGap ? (
              <>
                <p className="text-sm leading-6 text-slate-300">
                  {latestSkillGap.summary || "Latest skill gap report is ready."}
                </p>

                {latestSkillGap.topThreeFocusAreas?.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-semibold text-slate-300">
                      Focus This Week
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {latestSkillGap.topThreeFocusAreas.map((focus) => (
                        <span
                          key={focus}
                          className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300"
                        >
                          {focus}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {latestSkillGap.missingSkills?.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-semibold text-slate-300">
                      Missing Skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {latestSkillGap.missingSkills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Link
                  to={`/skill-gap/${latestSkillGap._id}`}
                  className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
                >
                  View Skill Gap Report
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm leading-6 text-slate-300">
                  Generate a skill gap analysis to know your missing skills and
                  weekly focus areas.
                </p>

                <Link
                  to="/skill-gap"
                  className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
                >
                  Generate Skill Gap
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
                <h2 className="text-xl font-semibold">Today's Priority</h2>
                <p className="text-sm text-slate-400">
                  Recommended next action
                </p>
              </div>
            </div>

            {readinessLoading ? (
              <p className="text-slate-300">
                Finding your next best action...
              </p>
            ) : readiness ? (
              <>
                <p className="text-slate-300">{readiness.nextBestAction}</p>
                <NextActionButton action={readiness.nextBestAction} />
              </>
            ) : (
              <>
                <p className="text-slate-300">
                  Start by completing your profile and generating your roadmap.
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
                <p className="text-sm text-slate-400">Your placement goal</p>
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
                <p className="mt-1 font-medium text-slate-200">{skillsText}</p>
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
                <h2 className="text-xl font-semibold">Scoring Formula</h2>
                <p className="text-sm text-slate-400">
                  How readiness is calculated
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <FormulaRow label="Profile Strength" value="15%" />
              <FormulaRow label="Roadmap Progress" value="15%" />
              <FormulaRow label="Resume Score" value="20%" />
              <FormulaRow label="DSA Progress" value="20%" />
              <FormulaRow label="Mock Interview" value="20%" />
              <FormulaRow label="Consistency" value="10%" />
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

const BreakdownRow = ({ label, score, weight, contribution }) => {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400">
          {score}% × {weight}% = {contribution}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${score || 0}%` }}
        />
      </div>
    </div>
  );
};

const NextActionButton = ({ action }) => {
  const normalizedAction = action?.toLowerCase() || "";

  if (normalizedAction.includes("profile")) {
    return (
      <Link
        to="/edit-profile"
        className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
      >
        Complete Profile
      </Link>
    );
  }

  if (normalizedAction.includes("resume")) {
    return (
      <Link
        to="/resume-analyzer"
        className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
      >
        Analyze Resume
      </Link>
    );
  }

  if (normalizedAction.includes("roadmap")) {
    return (
      <Link
        to="/roadmap"
        className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
      >
        Open Roadmap
      </Link>
    );
  }

  if (normalizedAction.includes("dsa")) {
    return (
      <Link
        to="/dsa-tracker"
        className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
      >
        Solve DSA
      </Link>
    );
  }

  if (
    normalizedAction.includes("interview") ||
    normalizedAction.includes("mock")
  ) {
    return (
      <Link
        to="/mock-interview"
        className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
      >
        Start Mock Interview
      </Link>
    );
  }

  return (
    <Link
      to="/dashboard"
      className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
    >
      Continue
    </Link>
  );
};

const FormulaRow = ({ label, value }) => {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
};

export default Dashboard;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  FileText,
  Route,
  Target,
  Trophy,
  User,
  Brain,
} from "lucide-react";

import { getReadinessScoreApi } from "../api/readiness.api";
import AppLayout from "../components/AppLayout";

const ReadinessReport = () => {
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReadinessScore = async () => {
    try {
      setLoading(true);

      const response = await getReadinessScoreApi();

      setReadiness(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to fetch readiness report"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadinessScore();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-300";
    if (score >= 60) return "text-yellow-300";
    if (score >= 40) return "text-orange-300";
    return "text-red-300";
  };

  const getScoreMessage = (score) => {
    if (score >= 80) {
      return "Excellent! You are very close to placement-ready level.";
    }

    if (score >= 60) {
      return "Good progress. Improve weak areas to become placement ready.";
    }

    if (score >= 40) {
      return "You are building momentum, but need more consistent preparation.";
    }

    return "Start with profile, resume, roadmap, and DSA basics.";
  };

  if (loading) {
    return (
      <AppLayout>

        <main className="flex-1 px-6 py-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
            Loading readiness report...
          </div>
        </main>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white lg:flex">
        <Sidebar />

        <div className="lg:hidden">
          <MobileHeader />
        </div>

        <main className="flex-1 px-6 py-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-red-300">
            <p>{error}</p>

            <Link
              to="/dashboard"
              className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!readiness) {
    return null;
  }

  const breakdownItems = [
    {
      label: "Profile Strength",
      icon: User,
      score: readiness.breakdown.profile.score,
      weight: readiness.breakdown.profile.weight,
      contribution: readiness.breakdown.profile.contribution,
      path: "/profile",
      buttonText: "Improve Profile",
      description:
        "Your profile helps Hirenix AI personalize roadmap, resume suggestions, and preparation strategy.",
    },
    {
      label: "Roadmap Progress",
      icon: Route,
      score: readiness.breakdown.roadmap.score,
      weight: readiness.breakdown.roadmap.weight,
      contribution: readiness.breakdown.roadmap.contribution,
      path: readiness.breakdown.roadmap.latestRoadmap
        ? `/roadmaps/${readiness.breakdown.roadmap.latestRoadmap._id}`
        : "/roadmap",
      buttonText: readiness.breakdown.roadmap.latestRoadmap
        ? "Continue Roadmap"
        : "Generate Roadmap",
      description:
        "Roadmap progress measures how consistently you are completing your AI preparation plan.",
    },
    {
      label: "Resume Score",
      icon: FileText,
      score: readiness.breakdown.resume.score,
      weight: readiness.breakdown.resume.weight,
      contribution: readiness.breakdown.resume.contribution,
      path: readiness.breakdown.resume.latestResumeAnalysis
        ? `/resume-analyses/${readiness.breakdown.resume.latestResumeAnalysis._id}`
        : "/resume-analyzer",
      buttonText: readiness.breakdown.resume.latestResumeAnalysis
        ? "View Resume Report"
        : "Analyze Resume",
      description:
        "Resume score measures ATS readiness, project clarity, keywords, and recruiter-friendly presentation.",
    },
    {
      label: "DSA Progress",
      icon: BookOpen,
      score: readiness.breakdown.dsa.score,
      weight: readiness.breakdown.dsa.weight,
      contribution: readiness.breakdown.dsa.contribution,
      path: "/dsa-tracker",
      buttonText: "Open DSA Tracker",
      description:
        "DSA progress is based on solved questions out of total tracked questions.",
    },
    {
      label: "Mock Interview",
      icon: Brain,
      score: readiness.breakdown.interview.score,
      weight: readiness.breakdown.interview.weight,
      contribution: readiness.breakdown.interview.contribution,
      path: "/mock-interview",
      buttonText:
        readiness.breakdown.interview.completedInterviews > 0
          ? "Practice More"
          : "Start Interview",
      description:
        "Mock interview score is based on your completed interview performance and helps improve communication, confidence, and technical explanation.",
    },
    {
      label: "Consistency",
      icon: CheckCircle2,
      score: readiness.breakdown.consistency.score,
      weight: readiness.breakdown.consistency.weight,
      contribution: readiness.breakdown.consistency.contribution,
      path: "/dashboard",
      buttonText: "Continue Preparation",
      description:
        "Consistency checks recent activity across roadmap, resume, and DSA preparation.",
    },
  ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-300">
              <Trophy size={30} />
            </div>

            <div>
              <p className="font-medium text-blue-400">
                Placement Readiness Report
              </p>
              <h1 className="text-4xl font-bold">
                Your Complete Readiness Analysis
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-3xl text-slate-400">
            This report combines your profile, roadmap progress, resume score,
            DSA progress, and recent activity into one placement readiness
            score.
          </p>
        </div>

        <section className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-400">Final Score</p>

                <h2
                  className={`mt-2 text-6xl font-bold ${getScoreColor(
                    readiness.finalScore
                  )}`}
                >
                  {readiness.finalScore}%
                </h2>

                <p className="mt-3 text-xl font-semibold">
                  {readiness.readinessLevel}
                </p>

                <p className="mt-2 text-slate-400">
                  {getScoreMessage(readiness.finalScore)}
                </p>
              </div>

              <div className="w-full max-w-sm">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-400">Readiness Progress</span>
                  <span className="text-slate-300">
                    {readiness.finalScore}%
                  </span>
                </div>

                <div className="h-4 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${readiness.finalScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 rounded-xl bg-green-500/10 p-3 text-green-300 w-fit">
              <Target size={24} />
            </div>

            <p className="text-sm text-slate-400">Next Best Action</p>

            <h2 className="mt-2 text-2xl font-bold">
              {readiness.nextBestAction}
            </h2>

            <NextActionButton action={readiness.nextBestAction} />
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Score Breakdown</h2>
            <p className="mt-2 text-slate-400">
              Each section contributes to your final placement readiness score
              based on its weight.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {breakdownItems.map((item) => (
              <BreakdownCard key={item.label} item={item} />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-green-500/10 p-3 text-green-300">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  AI Recommendations
                </h2>
                <p className="text-sm text-slate-400">
                  Suggestions based on your current preparation status.
                </p>
              </div>
            </div>

            {readiness.recommendations?.length > 0 ? (
              <ul className="space-y-3">
                {readiness.recommendations.map((recommendation, index) => (
                  <li
                    key={index}
                    className="rounded-xl bg-slate-950 px-4 py-3 text-sm leading-6 text-slate-300"
                  >
                    {recommendation}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400">No recommendations available.</p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-orange-500/10 p-3 text-orange-300">
                <BarChartIcon />
              </div>

              <div>
                <h2 className="text-xl font-semibold">How It Is Calculated</h2>
                <p className="text-sm text-slate-400">
                  Weighted scoring formula used by Hirenix AI.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <FormulaRow label="Profile Strength" value="15%" />
              <FormulaRow label="Roadmap Progress" value="15%" />
              <FormulaRow label="Resume Score" value="20%" />
              <FormulaRow label="DSA Progress" value="20%" />
              <FormulaRow label="Mock Interview" value="20%" />
              <FormulaRow label="Consistency" value="10%" />
            </div>

            <div className="mt-6 rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-400">
              Final Score = Profile contribution + Roadmap contribution +
              Resume contribution + DSA contribution + Consistency
              contribution.
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

const BreakdownCard = ({ item }) => {
  const Icon = item.icon;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-500/10 p-3 text-blue-300">
            <Icon size={22} />
          </div>

          <div>
            <h3 className="text-lg font-semibold">{item.label}</h3>
            <p className="text-sm text-slate-500">
              Weight: {item.weight}%
            </p>
          </div>
        </div>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
          {item.contribution} pts
        </span>
      </div>

      <p className="mb-4 text-sm leading-6 text-slate-400">
        {item.description}
      </p>

      <div className="mb-2 flex justify-between text-sm">
        <span className="text-slate-400">Score</span>
        <span className="text-slate-300">{item.score}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${item.score || 0}%` }}
        />
      </div>

      <Link
        to={item.path}
        className="mt-5 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700"
      >
        {item.buttonText}
      </Link>
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
        Generate Roadmap
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
    <div className="flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3 text-sm">
      <span className="text-slate-300">{label}</span>
      <span className="font-semibold text-blue-300">{value}</span>
    </div>
  );
};

const BarChartIcon = () => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
};

export default ReadinessReport;
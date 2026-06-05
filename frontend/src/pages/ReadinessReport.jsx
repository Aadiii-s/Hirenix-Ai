import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  CheckCircle2,
  FileText,
  Route,
  Target,
  Trophy,
  User,
} from "lucide-react";

import { getReadinessScoreApi } from "../api/readiness.api";

import AppLayout from "../components/AppLayout";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";

const ReadinessReport = () => {
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReadiness = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getReadinessScoreApi();

      setReadiness(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to fetch readiness score"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadiness();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <LoadingState
          title="Calculating readiness score"
          message="Please wait while we analyze your profile, resume, DSA, roadmap, interview, and consistency."
        />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <ErrorState
          title="Readiness report failed"
          message={error}
          buttonText="Retry"
          onRetry={fetchReadiness}
        />
      </AppLayout>
    );
  }

  if (!readiness) return null;

  const breakdownItems = [
    {
      label: "Profile Strength",
      icon: User,
      score: readiness.breakdown.profile.score,
      weight: readiness.breakdown.profile.weight,
      contribution: readiness.breakdown.profile.contribution,
      path: "/profile",
      buttonText: "View Profile",
      description:
        "Profile score is based on your college, branch, graduation year, target role, target companies, skills, and preparation level.",
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
        "Roadmap progress shows how much of your AI-generated placement preparation plan you have completed.",
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
        "Resume score is based on ATS score, missing keywords, strengths, weaknesses, and AI feedback.",
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
        "DSA score is calculated from solved questions, total questions, and coding preparation progress.",
    },
    {
      label: "Mock Interview",
      icon: Brain,
      score: readiness.breakdown.interview?.score || 0,
      weight: readiness.breakdown.interview?.weight || 20,
      contribution: readiness.breakdown.interview?.contribution || 0,
      path: "/mock-interview",
      buttonText:
        (readiness.breakdown.interview?.completedInterviews || 0) > 0
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
      buttonText: "Go to Dashboard",
      description:
        "Consistency score is based on your recent activity across DSA, roadmap, resume, and interview practice.",
    },
  ];

  return (
    <AppLayout>
      <div className="mb-8">
        <Link
          to="/dashboard"
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-orange-500/10 p-4 text-orange-300">
            <Trophy size={30} />
          </div>

          <div>
            <p className="font-medium text-blue-400">
              Placement Readiness Report
            </p>
            <h1 className="text-4xl font-bold">
              Your Readiness Score: {readiness.finalScore}%
            </h1>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-slate-400">
          This score combines your profile, roadmap, resume, DSA, interview, and
          consistency into one weighted placement readiness score.
        </p>
      </div>

      <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm text-slate-400">Readiness Level</p>

        <h2 className="mt-2 text-3xl font-bold text-blue-300">
          {readiness.readinessLevel}
        </h2>

        <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${readiness.finalScore || 0}%` }}
          />
        </div>

        <div className="mt-6 rounded-2xl bg-slate-950 p-5">
          <p className="text-sm text-slate-400">Next Best Action</p>
          <h3 className="mt-2 text-xl font-semibold">
            {readiness.nextBestAction}
          </h3>
          <NextActionButton action={readiness.nextBestAction} />
        </div>
      </section>

      <section className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {breakdownItems.map((item) => (
          <BreakdownCard key={item.label} item={item} />
        ))}
      </section>

      <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">AI Recommendations</h2>
        <p className="mt-1 text-sm text-slate-400">
          Personalized suggestions based on your current preparation.
        </p>

        {readiness.recommendations?.length > 0 ? (
          <ul className="mt-5 space-y-3">
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
          <p className="mt-5 text-sm text-slate-400">
            No recommendations available yet.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Scoring Formula</h2>
        <p className="mt-1 text-sm text-slate-400">
          This is how your final score is calculated.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <FormulaRow label="Profile Strength" value="15%" />
          <FormulaRow label="Roadmap Progress" value="15%" />
          <FormulaRow label="Resume Score" value="20%" />
          <FormulaRow label="DSA Progress" value="20%" />
          <FormulaRow label="Mock Interview" value="20%" />
          <FormulaRow label="Consistency" value="10%" />
        </div>
      </section>
    </AppLayout>
  );
};

const BreakdownCard = ({ item }) => {
  const Icon = item.icon;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-500/10 p-3 text-blue-300">
            <Icon size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">{item.label}</h2>
            <p className="text-sm text-slate-400">
              Weight: {item.weight}% | Contribution: {item.contribution}
            </p>
          </div>
        </div>

        <span className="rounded-full bg-slate-950 px-3 py-1 text-sm text-blue-300">
          {item.score}%
        </span>
      </div>

      <p className="text-sm leading-6 text-slate-400">{item.description}</p>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${item.score || 0}%` }}
        />
      </div>

      <Link
        to={item.path}
        className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-700"
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
    <div className="flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-slate-200">{value}</span>
    </div>
  );
};

export default ReadinessReport;
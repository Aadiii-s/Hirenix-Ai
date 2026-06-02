import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  History,
  Sparkles,
  Target,
} from "lucide-react";

import {
  generateSkillGapAnalysisApi,
  getLatestSkillGapAnalysisApi,
} from "../api/skillGap.api";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/AppLayout";

const SkillGapAnalyzer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [targetRole, setTargetRole] = useState(
    user?.targetRole || "Software Development Engineer"
  );
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const fetchLatestAnalysis = async () => {
    try {
      setLoadingLatest(true);

      const response = await getLatestSkillGapAnalysisApi();

      setLatestAnalysis(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to fetch latest analysis"
      );
    } finally {
      setLoadingLatest(false);
    }
  };

  useEffect(() => {
    fetchLatestAnalysis();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!targetRole.trim()) {
      setError("Target role is required");
      return;
    }

    try {
      setGenerating(true);
      setError("");

      const response = await generateSkillGapAnalysisApi({
        targetRole,
      });

      navigate(`/skill-gap/${response.data._id}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to generate skill gap analysis"
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AppLayout>
        <div className="mx-auto max-w-6xl">
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
                <Brain size={30} />
              </div>

              <div>
                <p className="font-medium text-blue-400">
                  AI Skill Gap Analyzer
                </p>
                <h1 className="text-4xl font-bold">
                  Find Your Missing Placement Skills
                </h1>
              </div>
            </div>

            <p className="mt-4 max-w-3xl text-slate-400">
              Hirenix AI analyzes your profile, resume, roadmap, DSA progress,
              and mock interview performance to identify missing skills and
              create a focused learning plan.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <form
              onSubmit={handleGenerate}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-blue-500/10 p-3 text-blue-300">
                  <Sparkles size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    Generate New Analysis
                  </h2>
                  <p className="text-sm text-slate-400">
                    Use latest profile, resume, DSA, roadmap, and interview data.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Target Role
                  </label>

                  <input
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="Software Development Engineer"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="rounded-2xl bg-slate-950 p-5">
                  <h3 className="mb-3 font-semibold">Data Used by AI</h3>

                  <div className="grid grid-cols-1 gap-3 text-sm text-slate-400 md:grid-cols-2">
                    <p>Profile: {user?.isProfileCompleted ? "Completed" : "Incomplete"}</p>
                    <p>Skills: {user?.skills?.length || 0} added</p>
                    <p>
                      Target Companies: {user?.targetCompanies?.length || 0} added
                    </p>
                    <p>Role: {user?.targetRole || "Not added"}</p>
                  </div>
                </div>

                <button
                  disabled={generating}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Sparkles size={18} />
                  {generating ? "Generating analysis..." : "Generate Skill Gap Analysis"}
                </button>
              </div>
            </form>

            <aside className="space-y-5">
              <Link
                to="/skill-gap/history"
                className="block rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-blue-500/50"
              >
                <div className="mb-3 w-fit rounded-xl bg-purple-500/10 p-3 text-purple-300">
                  <History size={22} />
                </div>

                <p className="text-sm text-slate-400">Past analyses</p>
                <h2 className="mt-1 text-xl font-semibold">
                  View Skill Gap History
                </h2>
              </Link>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="mb-3 w-fit rounded-xl bg-green-500/10 p-3 text-green-300">
                  <Target size={22} />
                </div>

                <h2 className="text-xl font-semibold">Latest Analysis</h2>

                {loadingLatest ? (
                  <p className="mt-3 text-sm text-slate-400">
                    Loading latest analysis...
                  </p>
                ) : latestAnalysis ? (
                  <>
                    <p className="mt-3 text-sm text-slate-400">
                      {latestAnalysis.summary || "Latest skill gap report ready."}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {latestAnalysis.missingSkills?.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/skill-gap/${latestAnalysis._id}`}
                      className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
                    >
                      View Latest Report
                    </Link>
                  </>
                ) : (
                  <p className="mt-3 text-sm text-slate-400">
                    No analysis generated yet.
                  </p>
                )}
              </div>
            </aside>
          </section>
        </div>
      </AppLayout>
  );
};

export default SkillGapAnalyzer;
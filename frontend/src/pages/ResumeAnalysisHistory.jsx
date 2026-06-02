import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Eye,
  FileText,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import {
  deleteResumeAnalysisApi,
  getMyResumeAnalysesApi,
} from "../api/resume.api";
import AppLayout from "../components/AppLayout";

const ResumeAnalysisHistory = () => {
  const [analyses, setAnalyses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalyses = async () => {
    try {
      setLoading(true);

      const response = await getMyResumeAnalysesApi();

      setAnalyses(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to fetch resume analyses"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (analysisId) => {
    if (!analysisId) {
      alert("Analysis id is missing");
      return;
    }

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this resume analysis?"
    );

    if (!isConfirmed) return;

    try {
      setDeletingId(analysisId);

      await deleteResumeAnalysisApi(analysisId);

      setAnalyses((prev) =>
        prev.filter((analysis) => analysis._id !== analysisId)
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete analysis");
    } finally {
      setDeletingId("");
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const filteredAnalyses = analyses.filter((analysis) =>
    `${analysis.originalFileName} ${analysis.targetRole} ${analysis.summary}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return "bg-green-500/10 text-green-300";
    if (score >= 60) return "bg-yellow-500/10 text-yellow-300";
    return "bg-red-500/10 text-red-300";
  };

  return (
    <AppLayout>
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-blue-400 font-medium">Resume History</p>
              <h1 className="mt-2 text-4xl font-bold">Your Resume Analyses</h1>
              <p className="mt-2 text-slate-400">
                View, search, and manage your AI resume analysis reports.
              </p>
            </div>

            <Link
              to="/resume-analyzer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
            >
              <Plus size={18} />
              New Analysis
            </Link>
          </div>

          <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <label className="mb-2 block text-sm text-slate-300">
              Search by file name, target role, or summary
            </label>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search SDE, resume.pdf, MERN..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
              Loading resume analyses...
            </div>
          ) : analyses.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
              <FileText className="mx-auto mb-4 text-blue-300" size={40} />

              <h2 className="text-2xl font-bold">No resume analysis yet</h2>
              <p className="mt-2 text-slate-400">
                Upload your resume and get your first AI-powered analysis.
              </p>

              <Link
                to="/resume-analyzer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
              >
                <Plus size={18} />
                Analyze Resume
              </Link>
            </div>
          ) : filteredAnalyses.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
              <h2 className="text-2xl font-bold">No matching analyses</h2>
              <p className="mt-2 text-slate-400">
                Try another file name, role, or keyword.
              </p>

              <button
                onClick={() => setSearchTerm("")}
                className="mt-6 rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 hover:bg-slate-800"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredAnalyses.map((analysis) => (
                <div
                  key={analysis._id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="line-clamp-2 text-xl font-semibold">
                        {analysis.originalFileName}
                      </h2>

                      <p className="mt-2 text-sm text-slate-400">
                        {analysis.targetRole || "Software Developer"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getScoreBadgeClass(
                        analysis.atsScore
                      )}`}
                    >
                      {analysis.atsScore}/100
                    </span>
                  </div>

                  <p className="line-clamp-3 text-sm leading-6 text-slate-400">
                    {analysis.summary || "No summary available"}
                  </p>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${analysis.atsScore || 0}%` }}
                    />
                  </div>

                  <p className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                    <Calendar size={16} />
                    {new Date(analysis.createdAt).toLocaleDateString()}
                  </p>

                  <div className="mt-6 flex gap-3">
                    <Link
                      to={`/resume-analyses/${analysis._id}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700"
                    >
                      <Eye size={16} />
                      View
                    </Link>

                    <button
                      onClick={() => handleDelete(analysis._id)}
                      disabled={deletingId === analysis._id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-60"
                    >
                      <Trash2 size={16} />
                      {deletingId === analysis._id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </AppLayout>
  );
};

export default ResumeAnalysisHistory;
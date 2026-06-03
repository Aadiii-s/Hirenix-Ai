import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Eye, FileText, Plus, Search, Trash2 } from "lucide-react";

import {
  deleteResumeAnalysisApi,
  getMyResumeAnalysesApi,
} from "../api/resume.api";

import AppLayout from "../components/AppLayout";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";

const ResumeAnalysisHistory = () => {
  const [analyses, setAnalyses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      setError("");

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

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const handleDelete = async (analysisId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume analysis?"
    );

    if (!confirmed) return;

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

  const filteredAnalyses = analyses.filter((analysis) =>
    `${analysis.originalFileName} ${analysis.summary} ${analysis.missingKeywords?.join(
      " "
    )}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-blue-400">Resume Analysis History</p>
          <h1 className="mt-2 text-4xl font-bold">Your Resume Reports</h1>
          <p className="mt-2 text-slate-400">
            Review all your resume ATS reports, missing keywords, and AI
            suggestions.
          </p>
        </div>

        <Link
          to="/resume-analyzer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
        >
          <Plus size={18} />
          Analyze Resume
        </Link>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <label className="mb-2 block text-sm text-slate-300">
          Search by file name, summary, or missing keyword
        </label>

        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search resume, React, MongoDB, DSA..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingState
          title="Loading resume reports"
          message="Please wait while we fetch your previous resume analyses."
        />
      ) : analyses.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No resume analysis yet"
          message="Upload your resume to get ATS score, missing keywords, strengths, weaknesses, and improvement suggestions."
          buttonText="Analyze Resume"
          buttonPath="/resume-analyzer"
        />
      ) : filteredAnalyses.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching resume reports"
          message="No resume analysis matched your search. Clear the search and try again."
          buttonText="Clear Search"
          onAction={() => setSearchTerm("")}
        />
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
                    {analysis.originalFileName || "Resume Analysis"}
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    ATS Score:{" "}
                    <span className="font-semibold text-slate-200">
                      {analysis.atsScore || 0}/100
                    </span>
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    (analysis.atsScore || 0) >= 80
                      ? "bg-green-500/10 text-green-300"
                      : (analysis.atsScore || 0) >= 60
                      ? "bg-yellow-500/10 text-yellow-300"
                      : "bg-red-500/10 text-red-300"
                  }`}
                >
                  {analysis.atsScore || 0}%
                </span>
              </div>

              <p className="line-clamp-3 text-sm leading-6 text-slate-400">
                {analysis.summary || "Resume analysis report is ready."}
              </p>

              {analysis.missingKeywords?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {analysis.missingKeywords.slice(0, 4).map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-300"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}

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
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-60"
                >
                  <Trash2 size={16} />
                  {deletingId === analysis._id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
    </AppLayout>
  );
};

export default ResumeAnalysisHistory;
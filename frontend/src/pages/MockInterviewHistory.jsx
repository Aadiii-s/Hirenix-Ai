import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Brain, Calendar, Eye, Plus, Search, Trash2 } from "lucide-react";

import {
  deleteMockInterviewApi,
  getMyMockInterviewsApi,
} from "../api/interview.api";
import MobileHeader from "../components/MobileHeader";
import Sidebar from "../components/Sidebar";

const MockInterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInterviews = async () => {
    try {
      setLoading(true);

      const response = await getMyMockInterviewsApi();

      setInterviews(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch interviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleDelete = async (interviewId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this interview?"
    );

    if (!isConfirmed) return;

    try {
      setDeletingId(interviewId);

      await deleteMockInterviewApi(interviewId);

      setInterviews((prev) =>
        prev.filter((interview) => interview._id !== interviewId)
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete interview");
    } finally {
      setDeletingId("");
    }
  };

  const filteredInterviews = interviews.filter((interview) =>
    `${interview.title} ${interview.interviewType} ${interview.targetRole}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
              <p className="font-medium text-blue-400">Mock Interview History</p>
              <h1 className="mt-2 text-4xl font-bold">Your Interviews</h1>
              <p className="mt-2 text-slate-400">
                Review all your AI mock interview sessions and scores.
              </p>
            </div>

            <Link
              to="/mock-interview"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
            >
              <Plus size={18} />
              New Interview
            </Link>
          </div>

          <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <label className="mb-2 block text-sm text-slate-300">
              Search by title, type, or role
            </label>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search MERN, HR, project..."
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
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
              Loading interviews...
            </div>
          ) : interviews.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
              <Brain className="mx-auto mb-4 text-blue-300" size={40} />

              <h2 className="text-2xl font-bold">No interviews yet</h2>
              <p className="mt-2 text-slate-400">
                Start your first AI mock interview.
              </p>

              <Link
                to="/mock-interview"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
              >
                <Plus size={18} />
                Start Interview
              </Link>
            </div>
          ) : filteredInterviews.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
              <h2 className="text-2xl font-bold">No matching interviews</h2>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-5 rounded-xl border border-slate-700 px-5 py-3 text-slate-300 hover:bg-slate-800"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredInterviews.map((interview) => (
                <div
                  key={interview._id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="line-clamp-2 text-xl font-semibold">
                        {interview.title}
                      </h2>
                      <p className="mt-2 text-sm text-slate-400">
                        {interview.targetRole}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        interview.status === "completed"
                          ? "bg-green-500/10 text-green-300"
                          : "bg-blue-500/10 text-blue-300"
                      }`}
                    >
                      {interview.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm text-slate-400">
                    <p className="capitalize">
                      Type:{" "}
                      <span className="text-slate-200">
                        {interview.interviewType}
                      </span>
                    </p>

                    <p className="capitalize">
                      Difficulty:{" "}
                      <span className="text-slate-200">
                        {interview.difficulty}
                      </span>
                    </p>

                    <p>
                      Score:{" "}
                      <span className="text-slate-200">
                        {interview.status === "completed"
                          ? `${interview.overallScore}%`
                          : "Pending"}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link
                      to={`/mock-interviews/${interview._id}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700"
                    >
                      <Eye size={16} />
                      {interview.status === "completed" ? "Report" : "Continue"}
                    </Link>

                    <button
                      onClick={() => handleDelete(interview._id)}
                      disabled={deletingId === interview._id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-60"
                    >
                      <Trash2 size={16} />
                      {deletingId === interview._id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default MockInterviewHistory;
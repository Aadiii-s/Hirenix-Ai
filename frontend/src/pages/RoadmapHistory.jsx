import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Eye, Plus, Route, Search, Trash2 } from "lucide-react";

import {
  deleteRoadmapApi,
  getMyRoadmapsApi,
} from "../api/roadmap.api";

import AppLayout from "../components/AppLayout";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";

const RoadmapHistory = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyRoadmapsApi();

      setRoadmaps(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch roadmaps");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleDelete = async (roadmapId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this roadmap?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(roadmapId);

      await deleteRoadmapApi(roadmapId);

      setRoadmaps((prev) =>
        prev.filter((roadmap) => roadmap._id !== roadmapId)
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete roadmap");
    } finally {
      setDeletingId("");
    }
  };

  const filteredRoadmaps = roadmaps.filter((roadmap) =>
    `${roadmap.title} ${roadmap.targetRole} ${roadmap.targetCompany}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-blue-400">Roadmap History</p>
          <h1 className="mt-2 text-4xl font-bold">Your AI Roadmaps</h1>
          <p className="mt-2 text-slate-400">
            Review and continue your previously generated placement preparation
            plans.
          </p>
        </div>

        <Link
          to="/roadmap"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
        >
          <Plus size={18} />
          New Roadmap
        </Link>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <label className="mb-2 block text-sm text-slate-300">
          Search by title, role, or company
        </label>

        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search SDE, Google, MERN..."
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
          title="Loading roadmaps"
          message="Please wait while we fetch your AI-generated preparation plans."
        />
      ) : roadmaps.length === 0 ? (
        <EmptyState
          icon={Route}
          title="No roadmap generated yet"
          message="Generate your first AI-powered placement roadmap based on your target role and preparation level."
          buttonText="Generate Roadmap"
          buttonPath="/roadmap"
        />
      ) : filteredRoadmaps.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching roadmaps"
          message="No roadmap matched your search. Clear the search and try again."
          buttonText="Clear Search"
          onAction={() => setSearchTerm("")}
        />
      ) : (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredRoadmaps.map((roadmap) => (
            <div
              key={roadmap._id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <h2 className="line-clamp-2 text-xl font-semibold">
                {roadmap.title}
              </h2>

              <div className="mt-4 space-y-3 text-sm text-slate-400">
                <p>
                  Role:{" "}
                  <span className="text-slate-200">{roadmap.targetRole}</span>
                </p>

                <p>
                  Company:{" "}
                  <span className="text-slate-200">
                    {roadmap.targetCompany || "General"}
                  </span>
                </p>

                <p>
                  Progress:{" "}
                  <span className="text-slate-200">
                    {roadmap.progressPercentage || 0}%
                  </span>
                </p>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${roadmap.progressPercentage || 0}%` }}
                  />
                </div>

                <p>
                  Completed:{" "}
                  <span className="text-slate-200">
                    {roadmap.completedDays?.length || 0}/
                    {roadmap.durationInDays || 0} days
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date(roadmap.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  to={`/roadmaps/${roadmap._id}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700"
                >
                  <Eye size={16} />
                  Continue
                </Link>

                <button
                  onClick={() => handleDelete(roadmap._id)}
                  disabled={deletingId === roadmap._id}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-60"
                >
                  <Trash2 size={16} />
                  {deletingId === roadmap._id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
    </AppLayout>
  );
};

export default RoadmapHistory;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Eye, Plus, Trash2 } from "lucide-react";

import MobileHeader from "../components/MobileHeader";
import Sidebar from "../components/Sidebar";
import { deleteRoadmapApi, getMyRoadmapsApi } from "../api/roadmap.api";

const RoadmapHistory = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      const response = await getMyRoadmapsApi();
      setRoadmaps(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to fetch roadmaps"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roadmapId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this roadmap?"
    );

    if (!isConfirmed) return;

    try {
      setDeletingId(roadmapId);
      await deleteRoadmapApi(roadmapId);

      setRoadmaps((prevRoadmaps) =>
        prevRoadmaps.filter((roadmap) => roadmap._id !== roadmapId)
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete roadmap");
    } finally {
      setDeletingId("");
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

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
              <p className="text-blue-400 font-medium">Roadmap History</p>
              <h1 className="mt-2 text-4xl font-bold">Your AI Roadmaps</h1>
              <p className="mt-2 text-slate-400">
                View, open, and manage your generated placement roadmaps.
              </p>
            </div>

            <Link
              to="/roadmap"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
            >
              <Plus size={18} />
              Generate New
            </Link>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
              Loading roadmaps...
            </div>
          ) : roadmaps.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
              <h2 className="text-2xl font-bold">No roadmaps yet</h2>
              <p className="mt-2 text-slate-400">
                Generate your first AI-powered placement roadmap.
              </p>

              <Link
                to="/roadmap"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
              >
                <Plus size={18} />
                Generate Roadmap
              </Link>
            </div>
          ) : (
            <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {roadmaps.map((roadmap) => (
                <div
                  key={roadmap._id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="line-clamp-2 text-xl font-semibold">
                        {roadmap.title}
                      </h2>

                      <p className="mt-2 text-sm text-slate-400">
                        {roadmap.targetRole}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-300">
                      {roadmap.status}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm text-slate-400">
                    <p>
                      Company:{" "}
                      <span className="text-slate-200">
                        {roadmap.targetCompany || "General"}
                      </span>
                    </p>

                    <p>
                      Duration:{" "}
                      <span className="text-slate-200">
                        {roadmap.durationInDays} days
                      </span>
                    </p>

                    <p className="capitalize">
                      Level:{" "}
                      <span className="text-slate-200">
                        {roadmap.currentLevel}
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
                      View
                    </Link>

                    <button
                      onClick={() => handleDelete(roadmap._id)}
                      disabled={deletingId === roadmap._id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-60 cursor-pointer"
                    >
                      <Trash2 size={16} />
                      {deletingId === roadmap._id ? "..." : "Delete"}
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

export default RoadmapHistory;
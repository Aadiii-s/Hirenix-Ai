import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock,
  Lightbulb,
  Target,
} from "lucide-react";
import { getRoadmapByIdApi, toggleRoadmapDayApi } from "../api/roadmap.api";
import AppLayout from "../components/AppLayout";

const RoadmapDetails = () => {
  const { id } = useParams();

  const [roadmap, setRoadmap] = useState(null);
  const [activeTab, setActiveTab] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingDay, setUpdatingDay] = useState(null);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const response = await getRoadmapByIdApi(id);
      setRoadmap(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to fetch roadmap"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [id]);

  if (loading) {
    return (
      <AppLayout>

        <main className="flex-1 px-6 py-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            Loading roadmap...
          </div>
        </main>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>

        <main className="flex-1 px-6 py-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-red-300">
            <p>{error}</p>

            <Link
              to="/roadmaps"
              className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Back to Roadmaps
            </Link>
          </div>
        </main>
      </AppLayout>
    );
  }

  if (!roadmap) {
    return null;
  }

  const handleToggleDay = async (day) => {
    try {
      setUpdatingDay(day);

      const response = await toggleRoadmapDayApi(id, day);

      setRoadmap(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update roadmap day");
    } finally {
      setUpdatingDay(null);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            to="/roadmaps"
            className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to roadmap history
          </Link>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-blue-400 font-medium">AI Roadmap</p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              {roadmap.title}
            </h1>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs text-slate-500">Target Role</p>
                <p className="mt-1 font-semibold">{roadmap.targetRole}</p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs text-slate-500">Company</p>
                <p className="mt-1 font-semibold">
                  {roadmap.targetCompany || "General"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs text-slate-500">Duration</p>
                <p className="mt-1 font-semibold">
                  {roadmap.durationInDays} days
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs text-slate-500">Level</p>
                <p className="mt-1 font-semibold capitalize">
                  {roadmap.currentLevel}
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-300">
                <CalendarDays size={22} />
              </div>
              <h2 className="text-xl font-semibold">Daily Plan</h2>
            </div>

            <p className="text-3xl font-bold">
              {roadmap.dailyPlan?.length || 0}
            </p>
            <p className="mt-1 text-sm text-slate-400">planned days</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-green-500/10 p-3 text-green-300">
                <Target size={22} />
              </div>
              <h2 className="text-xl font-semibold">Milestones</h2>
            </div>

            <p className="text-3xl font-bold">
              {roadmap.weeklyMilestones?.length || 0}
            </p>
            <p className="mt-1 text-sm text-slate-400">weekly goals</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-purple-500/10 p-3 text-purple-300">
                <BookOpen size={22} />
              </div>
              <h2 className="text-xl font-semibold">Resources</h2>
            </div>

            <p className="text-3xl font-bold">
              {roadmap.recommendedResources?.length || 0}
            </p>
            <p className="mt-1 text-sm text-slate-400">recommended</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("daily")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${activeTab === "daily"
                ? "bg-blue-600 text-white"
                : "bg-slate-950 text-slate-400"
                }`}
            >
              Daily Plan
            </button>

            <button
              onClick={() => setActiveTab("weekly")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${activeTab === "weekly"
                ? "bg-blue-600 text-white"
                : "bg-slate-950 text-slate-400"
                }`}
            >
              Weekly Milestones
            </button>

            <button
              onClick={() => setActiveTab("resources")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${activeTab === "resources"
                ? "bg-blue-600 text-white"
                : "bg-slate-950 text-slate-400"
                }`}
            >
              Resources & Suggestions
            </button>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-orange-500/10 p-3 text-orange-300">
                <Target size={22} />
              </div>
              <h2 className="text-xl font-semibold">Progress</h2>
            </div>

            <p className="text-3xl font-bold">{roadmap.progressPercentage || 0}%</p>
            <p className="mt-1 text-sm text-slate-400">
              {roadmap.completedDays?.length || 0} days completed
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${roadmap.progressPercentage || 0}%` }}
              />
            </div>
          </div>

          {activeTab === "daily" && (
            <div className="space-y-4">
              {roadmap.dailyPlan?.map((day) => (
                <div
                  key={day.day}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                >
                  <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-blue-400">Day {day.day}</p>
                      <h3 className="text-xl font-semibold">{day.title}</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock size={16} />
                        {day.estimatedHours || 3} hours
                      </div>

                      <button
                        onClick={() => handleToggleDay(day.day)}
                        disabled={updatingDay === day.day}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold ${roadmap.completedDays?.includes(day.day)
                          ? "bg-green-500/10 text-green-300 hover:bg-green-500/20"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          }`}
                      >
                        {updatingDay === day.day
                          ? "Updating..."
                          : roadmap.completedDays?.includes(day.day)
                            ? "Completed"
                            : "Mark Complete"}
                      </button>
                    </div>
                  </div>

                  <p className="mb-4 text-sm text-slate-400">
                    Focus Area:{" "}
                    <span className="text-slate-200">{day.focusArea}</span>
                  </p>

                  <ul className="space-y-2">
                    {day.tasks?.map((task, index) => (
                      <li
                        key={index}
                        className="rounded-xl bg-slate-900 px-4 py-3 text-sm text-slate-300"
                      >
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === "weekly" && (
            <div className="space-y-4">
              {roadmap.weeklyMilestones?.map((week) => (
                <div
                  key={week.week}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                >
                  <p className="text-sm text-green-400">Week {week.week}</p>
                  <h3 className="mt-1 text-xl font-semibold">{week.goal}</h3>

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-sm text-slate-500">Topics</p>
                      <div className="flex flex-wrap gap-2">
                        {week.topics?.map((topic) => (
                          <span
                            key={topic}
                            className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-sm text-slate-500">
                        Deliverables
                      </p>
                      <ul className="space-y-2">
                        {week.deliverables?.map((deliverable, index) => (
                          <li
                            key={index}
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-slate-300"
                          >
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "resources" && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <BookOpen className="text-blue-300" size={22} />
                  <h3 className="text-xl font-semibold">
                    Recommended Resources
                  </h3>
                </div>

                <ul className="space-y-3">
                  {roadmap.recommendedResources?.map((resource, index) => (
                    <li
                      key={index}
                      className="rounded-xl bg-slate-900 px-4 py-3 text-sm text-slate-300"
                    >
                      {resource}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <Lightbulb className="text-yellow-300" size={22} />
                  <h3 className="text-xl font-semibold">AI Suggestions</h3>
                </div>

                <ul className="space-y-3">
                  {roadmap.aiSuggestions?.map((suggestion, index) => (
                    <li
                      key={index}
                      className="rounded-xl bg-slate-900 px-4 py-3 text-sm text-slate-300"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
};

export default RoadmapDetails;